import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { recordAuditLog } from '@/lib/audit';
import { updateStoreMedia, softDeleteStoreMedia, restoreStoreItem } from '@/lib/store';

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth('EDITOR');
    const { action, ids, data } = await req.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'No items selected' }, { status: 400 });
    }

    let updatedCount = 0;

    if (action === 'publish') {
      try {
        const res = await prisma.mediaItem.updateMany({
          where: { id: { in: ids }, isDeleted: false },
          data: { status: 'PUBLISHED' },
        });
        updatedCount = res.count;
      } catch (dbErr) {
        console.warn('Prisma bulk publish error:', dbErr);
      }
      ids.forEach((id: string) => updateStoreMedia(id, { status: 'PUBLISHED' }));
      if (updatedCount === 0) updatedCount = ids.length;
    } else if (action === 'unpublish') {
      try {
        const res = await prisma.mediaItem.updateMany({
          where: { id: { in: ids }, isDeleted: false },
          data: { status: 'DRAFT' },
        });
        updatedCount = res.count;
      } catch (dbErr) {
        console.warn('Prisma bulk unpublish error:', dbErr);
      }
      ids.forEach((id: string) => updateStoreMedia(id, { status: 'DRAFT' }));
      if (updatedCount === 0) updatedCount = ids.length;
    } else if (action === 'soft_delete') {
      await requireAuth('ADMIN');
      try {
        const res = await prisma.mediaItem.updateMany({
          where: { id: { in: ids } },
          data: {
            isDeleted: true,
            deletedAt: new Date(),
            deletedBy: session.email,
            status: 'ARCHIVED',
          },
        });
        updatedCount = res.count;
      } catch (dbErr) {
        console.warn('Prisma bulk soft_delete error:', dbErr);
      }
      ids.forEach((id: string) => softDeleteStoreMedia(id, session));
      if (updatedCount === 0) updatedCount = ids.length;
    } else if (action === 'restore') {
      await requireAuth('ADMIN');
      try {
        const res = await prisma.mediaItem.updateMany({
          where: { id: { in: ids } },
          data: {
            isDeleted: false,
            deletedAt: null,
            deletedBy: null,
            status: 'PUBLISHED',
          },
        });
        updatedCount = res.count;
      } catch (dbErr) {
        console.warn('Prisma bulk restore error:', dbErr);
      }
      ids.forEach((id: string) => restoreStoreItem('media', id));
      if (updatedCount === 0) updatedCount = ids.length;
    } else if (action === 'assign_category' && data?.category) {
      try {
        const res = await prisma.mediaItem.updateMany({
          where: { id: { in: ids }, isDeleted: false },
          data: { category: data.category },
        });
        updatedCount = res.count;
      } catch (dbErr) {
        console.warn('Prisma bulk assign_category error:', dbErr);
      }
      ids.forEach((id: string) => updateStoreMedia(id, { category: data.category }));
      if (updatedCount === 0) updatedCount = ids.length;
    } else {
      return NextResponse.json({ error: 'Unsupported bulk action' }, { status: 400 });
    }

    await recordAuditLog({
      action: 'BULK_ACTION',
      entityType: 'MediaItem',
      entityTitle: `Bulk ${action} on ${updatedCount} items`,
      actor: session,
      metadata: { action, count: updatedCount, ids },
    });

    return NextResponse.json({
      success: true,
      updatedCount,
      message: `Bulk ${action} applied to ${updatedCount} items.`,
    });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Bulk action failed' }, { status: 500 });
  }
}
