import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, hashPassword } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { recordAuditLog } from '@/lib/audit';
import { Role } from '@prisma/client';

export async function GET() {
  try {
    await requireAuth('SUPERADMIN');
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        avatar: true,
        createdAt: true,
        lastLoginAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ users });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Unauthorized or insufficient permissions' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth('SUPERADMIN');
    const body = await req.json();
    const { email, name, password, role } = body;

    if (!email || !name || !password) {
      return NextResponse.json(
        { error: 'Email, name, and temporary password are required' },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const existing = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'A user with this email address already exists.' },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);
    const validRole = role && Object.values(Role).includes(role) ? (role as Role) : Role.EDITOR;

    const user = await prisma.user.create({
      data: {
        email: cleanEmail,
        name,
        passwordHash: hashedPassword,
        role: validRole,
        status: 'ACTIVE',
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    await recordAuditLog({
      action: 'CREATE',
      entityType: 'User',
      entityId: user.id,
      entityTitle: `User Created: ${user.name} (${user.email})`,
      afterValues: user,
      actor: session,
    });

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Unauthorized or insufficient permissions' }, { status: 403 });
    }
    return NextResponse.json({ error: error.message || 'Failed to create user' }, { status: 500 });
  }
}
