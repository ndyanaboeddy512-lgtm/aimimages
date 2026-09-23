import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { recordAuditLog } from '@/lib/audit';
import { updateStoreTestimonial, softDeleteStoreTestimonial } from '@/lib/store';

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth('EDITOR');
    const { id } = await context.params;
    const body = await req.json();

    const { clientName, roleOrEvent, comment, rating, avatar, featured, status, order } = body;

    // Update in store
    const storeUpdated = updateStoreTestimonial(id, {
      ...(clientName !== undefined && { clientName }),
      ...(roleOrEvent !== undefined && { roleOrEvent }),
      ...(comment !== undefined && { comment }),
      ...(rating !== undefined && { rating: parseInt(rating) }),
      ...(avatar !== undefined && { avatar }),
      ...(featured !== undefined && { featured: Boolean(featured) }),
      ...(status !== undefined && { status }),
      ...(order !== undefined && { order: parseInt(order) }),
    });

    let updated = storeUpdated;

    try {
      const existing = await prisma.testimonial.findUnique({ where: { id } });
      if (existing) {
        const dbUpdated = await prisma.testimonial.update({
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
        updated = dbUpdated as any;

        await recordAuditLog({
          action: 'UPDATE',
          entityType: 'Testimonial',
          entityId: dbUpdated.id,
          entityTitle: dbUpdated.clientName,
          beforeValues: existing,
          afterValues: dbUpdated,
          actor: session,
        });
      }
    } catch (dbErr) {
      console.warn('Prisma testimonial update fallback to store:', dbErr);
    }

    if (!updated) {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
    }

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

    // Soft delete in store
    softDeleteStoreTestimonial(id, session);

    try {
      const existing = await prisma.testimonial.findUnique({ where: { id } });
      if (existing) {
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
      }
    } catch (dbErr) {
      console.warn('Prisma testimonial delete fallback to store:', dbErr);
    }

    return NextResponse.json({ success: true, message: 'Testimonial moved to trash.' });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    return NextResponse.json({ error: error.message || 'Failed to delete testimonial' }, { status: 500 });
  }
}
