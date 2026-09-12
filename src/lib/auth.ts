import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { prisma } from './db';
import { Role } from '@prisma/client';

const JWT_SECRET_STRING = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'aimimages-studio-jwt-secret-key-2026-production';
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);
export const SESSION_COOKIE_NAME = 'aim_session';

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export async function comparePassword(plain: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(plain, hashed);
}

export async function signSessionToken(payload: SessionUser): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

export async function verifySessionToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      id: payload.id as string,
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as Role,
    };
  } catch {
    return null;
  }
}

export async function getCurrentSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;
    return await verifySessionToken(token);
  } catch {
    return null;
  }
}

export async function setSessionCookie(user: SessionUser): Promise<string> {
  const token = await signSessionToken(user);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
  return token;
}

export async function removeSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function requireAuth(minimumRole?: Role): Promise<SessionUser> {
  const session = await getCurrentSession();
  if (!session) {
    throw new Error('UNAUTHORIZED');
  }

  if (minimumRole) {
    const hierarchy: Record<Role, number> = {
      EDITOR: 1,
      ADMIN: 2,
      SUPERADMIN: 3,
    };

    if (hierarchy[session.role] < hierarchy[minimumRole]) {
      throw new Error('FORBIDDEN');
    }
  }

  return session;
}
