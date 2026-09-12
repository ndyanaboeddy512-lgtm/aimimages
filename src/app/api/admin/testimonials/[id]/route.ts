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
    const body = await req.json();

    const existing = await prisma.testimonial.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
    }

    const { clientName, roleOrEvent, comment, rating, avatar, featured, status, order } = body;

    const updated = await prisma.testimonial.update({
      where: { id },
      data: {
        clientName: clientName !== undefined ? clientName : existing.clientName,
        roleOrEvent: roleOrEvent !== undefined ? roleOrEvent : existing.roleOrEvent,
        comment: comment !== undefined ? comment : existing.comment,
        rating: rating !== undefined ? parseInt(rating) : existing.rating,
        avatar: avatar !== undefined ? avatar : existing.avatar,
        featured: featured !== undefined ? Boolean(featured) : existing.featured,
        status: status !== undefined ? status : existing.status,
        order: order !== undefined ? parseInt(order) : existing.order,
      },
    });

    await recordAuditLog({
      action: 'UPDATE',
      entityType: 'Testimonial',
      entityId: updated.id,
      entityTitle: updated.clientName,
      beforeValues: existing,
      afterValues: updated,
      actor: session,
    });

    return NextResponse.json({ success: true, testimonial: updated });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    return NextResponse.json({ error: error.message || 'Failed to update testimonial' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth('ADMIN');
    const { id } = await context.params;

    const existing = await prisma.testimonial.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
    }

    const softDeleted = await prisma.testimonial.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: session.email,
        status: 'ARCHIVED',
      },
    });

    await recordAuditLog({
      action: 'SOFT_DELETE',
      entityType: 'Testimonial',
      entityId: id,
      entityTitle: existing.clientName,
      beforeValues: existing,
      afterValues: softDeleted,
      actor: session,
    });

    return NextResponse.json({ success: true, message: 'Testimonial moved to trash.' });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 });
  }
}
