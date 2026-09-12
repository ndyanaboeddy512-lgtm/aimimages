import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { recordAuditLog } from '@/lib/audit';

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth('EDITOR');
    const { action, ids, data } = await req.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'No items selected' }, { status: 400 });
    }

    let updatedCount = 0;

    if (action === 'publish') {
      const res = await prisma.mediaItem.updateMany({
        where: { id: { in: ids }, isDeleted: false },
        data: { status: 'PUBLISHED' },
      });
      updatedCount = res.count;
    } else if (action === 'unpublish') {
      const res = await prisma.mediaItem.updateMany({
        where: { id: { in: ids }, isDeleted: false },
        data: { status: 'DRAFT' },
      });
      updatedCount = res.count;
    } else if (action === 'soft_delete') {
      await requireAuth('ADMIN');
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
    } else if (action === 'restore') {
      await requireAuth('ADMIN');
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
    } else if (action === 'assign_category' && data?.category) {
      const res = await prisma.mediaItem.updateMany({
        where: { id: { in: ids }, isDeleted: false },
        data: { category: data.category },
      });
      updatedCount = res.count;
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
