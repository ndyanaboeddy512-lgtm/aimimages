import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { recordAuditLog } from '@/lib/audit';
import { updateStoreMedia, softDeleteStoreMedia, getStoreMedia } from '@/lib/store';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await context.params;

    let item: any = null;

    try {
      item = await prisma.mediaItem.findUnique({
        where: { id },
        include: {
          project: { select: { id: true, title: true, slug: true } },
          uploadedBy: { select: { id: true, name: true, email: true } },
        },
      });
    } catch (dbErr) {
      console.warn('Prisma media item fetch fallback to store:', dbErr);
    }

    if (!item) {
      const allItems = getStoreMedia();
      item = allItems.find((m) => m.id === id);
    }

    if (!item) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    return NextResponse.json({ item });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to fetch media item' }, { status: 500 });
  }
}

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
      description,
      category,
      tags,
      altText,
      location,
      projectId,
      featured,
      status,
      order,
      posterUrl,
    } = body;

    // Update in store
    const storeUpdated = updateStoreMedia(id, {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(category !== undefined && { category }),
      ...(tags !== undefined && { tags: Array.isArray(tags) ? tags : [] }),
      ...(altText !== undefined && { altText }),
      ...(location !== undefined && { location }),
      ...(projectId !== undefined && { projectId: projectId === 'none' ? null : projectId }),
      ...(featured !== undefined && { featured: Boolean(featured) }),
      ...(status !== undefined && { status }),
      ...(order !== undefined && { order: parseInt(order) }),
      ...(posterUrl !== undefined && { posterUrl }),
    });

    let updated = storeUpdated;

    try {
      const existing = await prisma.mediaItem.findUnique({ where: { id } });
      if (existing) {
        const dbUpdated = await prisma.mediaItem.update({
          where: { id },
          data: {
            title: title !== undefined ? title : existing.title,
            description: description !== undefined ? description : existing.description,
            category: category !== undefined ? category : existing.category,
            tags: Array.isArray(tags) ? tags : existing.tags,
            altText: altText !== undefined ? altText : existing.altText,
            location: location !== undefined ? location : existing.location,
            projectId: projectId === 'none' ? null : projectId !== undefined ? projectId : existing.projectId,
            featured: featured !== undefined ? Boolean(featured) : existing.featured,
            status: status !== undefined ? status : existing.status,
            order: order !== undefined ? parseInt(order) : existing.order,
            posterUrl: posterUrl !== undefined ? posterUrl : existing.posterUrl,
          },
        });
        updated = dbUpdated as any;

        await recordAuditLog({
          action: 'UPDATE',
          entityType: 'MediaItem',
          entityId: dbUpdated.id,
          entityTitle: dbUpdated.title,
          beforeValues: existing,
          afterValues: dbUpdated,
          actor: session,
        });
      }
    } catch (dbErr) {
      console.warn('Prisma media update fallback to store:', dbErr);
    }

    if (!updated) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, item: updated });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    return NextResponse.json({ error: error.message || 'Failed to update media item' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth('ADMIN');
    const { id } = await context.params;

    // Always soft delete in store
    softDeleteStoreMedia(id, session);

    try {
      const existing = await prisma.mediaItem.findUnique({ where: { id } });
      if (existing) {
        const softDeleted = await prisma.mediaItem.update({
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
          entityType: 'MediaItem',
          entityId: id,
          entityTitle: existing.title,
          beforeValues: existing,
          afterValues: softDeleted,
          actor: session,
          metadata: { reason: 'Moved to trash' },
        });
      }
    } catch (dbErr) {
      console.warn('Prisma media delete fallback to store:', dbErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Media moved to trash safely. Can be restored anytime from the Trash tab.',
    });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    return NextResponse.json({ error: error.message || 'Failed to delete media item' }, { status: 500 });
  }
}
