import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { recordAuditLog } from '@/lib/audit';

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth('EDITOR');
    const { id } = await context.params;
    const { status } = await req.json();

    const existing = await prisma.enquiry.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
    }

    const updated = await prisma.enquiry.update({
      where: { id },
      data: { status },
    });

    await recordAuditLog({
      action: 'UPDATE',
      entityType: 'Enquiry',
      entityId: id,
      entityTitle: `Enquiry from ${existing.name} (${existing.service})`,
      beforeValues: { status: existing.status },
      afterValues: { status: updated.status },
      actor: session,
    });

    return NextResponse.json({ success: true, inquiry: updated });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to update inquiry' }, { status: 500 });
  }
}
