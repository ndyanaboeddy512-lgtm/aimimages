import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { recordAuditLog, recordContentRevision } from '@/lib/audit';
import { updateStoreService, softDeleteStoreService } from '@/lib/store';

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth('EDITOR');
    const { id } = await context.params;
    const body = await req.json();

    const {
      title,
      slug,
      tagline,
      description,
      icon,
      startingPrice,
      deliverables,
      timeline,
      order,
      status,
    } = body;

    // Update in store
    const storeUpdated = updateStoreService(id, {
      ...(title !== undefined && { title }),
      ...(slug !== undefined && { slug }),
      ...(tagline !== undefined && { tagline }),
      ...(description !== undefined && { description }),
      ...(icon !== undefined && { icon }),
      ...(startingPrice !== undefined && { startingPrice }),
      ...(deliverables !== undefined && { deliverables: Array.isArray(deliverables) ? deliverables : [] }),
      ...(timeline !== undefined && { timeline }),
      ...(order !== undefined && { order: parseInt(order) }),
      ...(status !== undefined && { status }),
    });

    let updated = storeUpdated;

    try {
      const existing = await prisma.service.findUnique({ where: { id } });
      if (existing) {
        const dbUpdated = await prisma.service.update({
          where: { id },
          data: {
            title: title !== undefined ? title : existing.title,
            slug: slug !== undefined ? slug : existing.slug,
            tagline: tagline !== undefined ? tagline : existing.tagline,
            description: description !== undefined ? description : existing.description,
            icon: icon !== undefined ? icon : existing.icon,
            startingPrice: startingPrice !== undefined ? startingPrice : existing.startingPrice,
            deliverables: Array.isArray(deliverables) ? deliverables : existing.deliverables,
            timeline: timeline !== undefined ? timeline : existing.timeline,
            order: order !== undefined ? parseInt(order) : existing.order,
            status: status !== undefined ? status : existing.status,
          },
        });
        updated = dbUpdated as any;

        await recordAuditLog({
          action: 'UPDATE',
          entityType: 'Service',
          entityId: dbUpdated.id,
          entityTitle: dbUpdated.title,
          beforeValues: existing,
          afterValues: dbUpdated,
          actor: session,
        });

        await recordContentRevision({
          entityType: 'Service',
          entityId: dbUpdated.id,
          snapshot: dbUpdated,
          changeReason: body.changeReason || 'Updated service details',
          actor: session,
        });
      }
    } catch (dbErr) {
      console.warn('Prisma service update fallback to store:', dbErr);
    }

    if (!updated) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, service: updated });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    return NextResponse.json({ error: error.message || 'Failed to update service' }, { status: 500 });
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
    softDeleteStoreService(id, session);

    try {
      const existing = await prisma.service.findUnique({ where: { id } });
      if (existing) {
        const softDeleted = await prisma.service.update({
          where: { id },
          data: {
            isDeleted: true,
            deletedAt: new Date(),
            deletedBy: session.email,
            status: 'DRAFT',
          },
        });

        await recordAuditLog({
          action: 'SOFT_DELETE',
          entityType: 'Service',
          entityId: id,
          entityTitle: existing.title,
          beforeValues: existing,
          afterValues: softDeleted,
          actor: session,
        });
      }
    } catch (dbErr) {
      console.warn('Prisma service delete fallback to store:', dbErr);
    }

    return NextResponse.json({ success: true, message: 'Service moved to trash' });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
  }
}
