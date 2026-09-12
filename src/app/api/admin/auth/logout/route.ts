import { NextResponse } from 'next/server';
import { removeSessionCookie, getCurrentSession } from '@/lib/auth';
import { recordAuditLog } from '@/lib/audit';

export async function POST() {
  const session = await getCurrentSession();
  if (session) {
    await recordAuditLog({
      action: 'UPDATE',
      entityType: 'Auth',
      entityId: session.id,
      entityTitle: `Admin Logout: ${session.email}`,
      actor: session,
    });
  }

  await removeSessionCookie();
  return NextResponse.json({ success: true });
}
