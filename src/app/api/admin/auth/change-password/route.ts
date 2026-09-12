import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, comparePassword, hashPassword } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { recordAuditLog } from '@/lib/audit';

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await req.json();
    const { currentPassword, newPassword } = body;

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { error: 'New password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    // If the user is in the database, check current password
    if (session.id && session.id !== 'superadmin-fallback') {
      const user = await prisma.user.findUnique({
        where: { id: session.id },
      });

      if (user) {
        if (currentPassword) {
          const isValid = await comparePassword(currentPassword, user.passwordHash);
          if (!isValid) {
            return NextResponse.json(
              { error: 'Current password does not match.' },
              { status: 400 }
            );
          }
        }

        const hashed = await hashPassword(newPassword);
        await prisma.user.update({
          where: { id: user.id },
          data: { passwordHash: hashed },
        });

        await recordAuditLog({
          action: 'UPDATE',
          entityType: 'User',
          entityId: user.id,
          entityTitle: `Password changed for ${user.email}`,
          actor: session,
        });

        return NextResponse.json({
          success: true,
          message: 'Password changed successfully.',
        });
      }
    }

    // Fallback: If fallback superadmin user, upsert into DB
    const hashed = await hashPassword(newPassword);
    const updated = await prisma.user.upsert({
      where: { email: session.email },
      update: { passwordHash: hashed },
      create: {
        email: session.email,
        name: session.name || 'Studio Administrator',
        passwordHash: hashed,
        role: session.role,
        status: 'ACTIVE',
      },
    });

    await recordAuditLog({
      action: 'UPDATE',
      entityType: 'User',
      entityId: updated.id,
      entityTitle: `Master password updated in database for ${updated.email}`,
      actor: session,
    });

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully in database.',
    });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Password change error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to change password' },
      { status: 500 }
    );
  }
}
