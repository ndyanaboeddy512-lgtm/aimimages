import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, hashPassword } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { recordAuditLog } from '@/lib/audit';
import { Role } from '@prisma/client';

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth('SUPERADMIN');
    const { id } = await context.params;
    const body = await req.json();

    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { role, status, name, password } = body;
    const updateData: any = {};

    if (name) updateData.name = name;
    if (role && Object.values(Role).includes(role)) {
      // Prevent demoting self from SUPERADMIN if single superadmin
      updateData.role = role;
    }
    if (status && ['ACTIVE', 'SUSPENDED'].includes(status)) {
      if (id === session.id && status === 'SUSPENDED') {
        return NextResponse.json(
          { error: 'You cannot suspend your own account.' },
          { status: 400 }
        );
      }
      updateData.status = status;
    }
    if (password && password.length >= 6) {
      updateData.passwordHash = await hashPassword(password);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        updatedAt: true,
      },
    });

    await recordAuditLog({
      action: 'UPDATE',
      entityType: 'User',
      entityId: id,
      entityTitle: `User Updated: ${updatedUser.name} (${updatedUser.email})`,
      beforeValues: { role: existingUser.role, status: existingUser.status, name: existingUser.name },
      afterValues: { role: updatedUser.role, status: updatedUser.status, name: updatedUser.name },
      actor: session,
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Unauthorized or insufficient permissions' }, { status: 403 });
    }
    return NextResponse.json({ error: error.message || 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth('SUPERADMIN');
    const { id } = await context.params;

    if (id === session.id) {
      return NextResponse.json(
        { error: 'You cannot delete your own account.' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await prisma.user.delete({
      where: { id },
    });

    await recordAuditLog({
      action: 'PERMANENT_DELETE',
      entityType: 'User',
      entityId: id,
      entityTitle: `User Deleted: ${existingUser.name} (${existingUser.email})`,
      beforeValues: { email: existingUser.email, name: existingUser.name, role: existingUser.role },
      actor: session,
    });

    return NextResponse.json({ success: true, message: 'User deleted permanently' });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Unauthorized or insufficient permissions' }, { status: 403 });
    }
    return NextResponse.json({ error: error.message || 'Failed to delete user' }, { status: 500 });
  }
}
