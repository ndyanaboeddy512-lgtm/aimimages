import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { purgeStoredFile } from '@/lib/storage';
import { recordAuditLog } from '@/lib/audit';

export async function GET() {
  try {
    await requireAuth('ADMIN');

    const [deletedMedia, deletedProjects, deletedServices, deletedTestimonials] =
      await Promise.all([
        prisma.mediaItem.findMany({
          where: { isDeleted: true },
          orderBy: { deletedAt: 'desc' },
        }),
        prisma.project.findMany({
          where: { isDeleted: true },
          orderBy: { deletedAt: 'desc' },
        }),
        prisma.service.findMany({
          where: { isDeleted: true },
          orderBy: { deletedAt: 'desc' },
        }),
        prisma.testimonial.findMany({
          where: { isDeleted: true },
          orderBy: { deletedAt: 'desc' },
        }),
      ]);

    const trashItems = [
      ...deletedMedia.map((m) => ({ ...m, itemType: 'Media' as const })),
      ...deletedProjects.map((p) => ({ ...p, itemType: 'Project' as const })),
      ...deletedServices.map((s) => ({ ...s, itemType: 'Service' as const })),
      ...deletedTestimonials.map((t) => ({ ...t, title: t.clientName, itemType: 'Testimonial' as const })),
    ].sort((a, b) => {
      const dateA = a.deletedAt ? new Date(a.deletedAt).getTime() : 0;
      const dateB = b.deletedAt ? new Date(b.deletedAt).getTime() : 0;
      return dateB - dateA;
    });

    return NextResponse.json({ trashItems });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to fetch trash items' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth('ADMIN');
    const { entityType, id } = await req.json();

    if (!entityType || !id) {
      return NextResponse.json({ error: 'Entity type and ID are required.' }, { status: 400 });
    }

    let restoredItem: any = null;

    if (entityType === 'Media' || entityType === 'MediaItem') {
      restoredItem = await prisma.mediaItem.update({
        where: { id },
        data: { isDeleted: false, deletedAt: null, deletedBy: null, status: 'PUBLISHED' },
      });
    } else if (entityType === 'Project') {
      restoredItem = await prisma.project.update({
        where: { id },
        data: { isDeleted: false, deletedAt: null, deletedBy: null, status: 'PUBLISHED' },
      });
    } else if (entityType === 'Service') {
      restoredItem = await prisma.service.update({
        where: { id },
        data: { isDeleted: false, deletedAt: null, deletedBy: null, status: 'PUBLISHED' },
      });
    } else if (entityType === 'Testimonial') {
      restoredItem = await prisma.testimonial.update({
        where: { id },
        data: { isDeleted: false, deletedAt: null, deletedBy: null, status: 'PUBLISHED' },
      });
    }

    await recordAuditLog({
      action: 'RESTORE',
      entityType: (entityType === 'Media' ? 'MediaItem' : entityType) as any,
      entityId: id,
      entityTitle: restoredItem?.title || restoredItem?.clientName || id,
      afterValues: restoredItem,
      actor: session,
      metadata: { restoredFromTrash: true },
    });

    return NextResponse.json({
      success: true,
      message: `${entityType} restored to active status successfully.`,
      item: restoredItem,
    });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    return NextResponse.json({ error: error.message || 'Failed to restore item' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await requireAuth('SUPERADMIN');
    const { searchParams } = new URL(req.url);
    const entityType = searchParams.get('type');
    const id = searchParams.get('id');

    if (!entityType || !id) {
      return NextResponse.json({ error: 'Entity type and ID are required' }, { status: 400 });
    }

    let deletedTitle = id;

    if (entityType === 'Media' || entityType === 'MediaItem') {
      const item = await prisma.mediaItem.findUnique({ where: { id } });
      if (item) {
        deletedTitle = item.title;
        // Purge binary from cloud / local storage
        await purgeStoredFile({
          storageKey: item.storageKey,
          storageBucket: item.storageBucket,
          storageProvider: item.storageProvider,
          url: item.url,
        });
        await prisma.mediaItem.delete({ where: { id } });
      }
    } else if (entityType === 'Project') {
      const proj = await prisma.project.findUnique({ where: { id } });
      if (proj) {
        deletedTitle = proj.title;
        await prisma.project.delete({ where: { id } });
      }
    } else if (entityType === 'Service') {
      const srv = await prisma.service.findUnique({ where: { id } });
      if (srv) {
        deletedTitle = srv.title;
        await prisma.service.delete({ where: { id } });
      }
    } else if (entityType === 'Testimonial') {
      const t = await prisma.testimonial.findUnique({ where: { id } });
      if (t) {
        deletedTitle = t.clientName;
        await prisma.testimonial.delete({ where: { id } });
      }
    }

    await recordAuditLog({
      action: 'PERMANENT_DELETE',
      entityType: (entityType === 'Media' ? 'MediaItem' : entityType) as any,
      entityId: id,
      entityTitle: deletedTitle,
      actor: session,
      metadata: { irreversible: true, purgedBy: session.email },
    });

    return NextResponse.json({
      success: true,
      message: `${entityType} has been permanently and irreversibly purged.`,
    });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Requires Superadmin privileges to permanently delete items.' }, { status: 403 });
    }
    return NextResponse.json({ error: error.message || 'Failed to permanently delete item' }, { status: 500 });
  }
}
