import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { recordAuditLog, recordContentRevision } from '@/lib/audit';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await context.params;

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        mediaItems: {
          where: { isDeleted: false },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ project });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
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

    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const {
      title,
      slug,
      category,
      description,
      client,
      year,
      location,
      coverImage,
      videoUrl,
      duration,
      isVideo,
      featured,
      status,
      order,
      gallery,
      deliverables,
      gearUsed,
    } = body;

    const updated = await prisma.project.update({
      where: { id },
      data: {
        title: title !== undefined ? title : existing.title,
        slug: slug !== undefined ? slug : existing.slug,
        category: category !== undefined ? category : existing.category,
        description: description !== undefined ? description : existing.description,
        client: client !== undefined ? client : existing.client,
        year: year !== undefined ? parseInt(year) : existing.year,
        location: location !== undefined ? location : existing.location,
        coverImage: coverImage !== undefined ? coverImage : existing.coverImage,
        videoUrl: videoUrl !== undefined ? videoUrl : existing.videoUrl,
        duration: duration !== undefined ? duration : existing.duration,
        isVideo: isVideo !== undefined ? Boolean(isVideo) : existing.isVideo,
        featured: featured !== undefined ? Boolean(featured) : existing.featured,
        status: status !== undefined ? status : existing.status,
        order: order !== undefined ? parseInt(order) : existing.order,
        gallery: Array.isArray(gallery) ? gallery : existing.gallery,
        deliverables: Array.isArray(deliverables) ? deliverables : existing.deliverables,
        gearUsed: Array.isArray(gearUsed) ? gearUsed : existing.gearUsed,
      },
    });

    await recordAuditLog({
      action: 'UPDATE',
      entityType: 'Project',
      entityId: updated.id,
      entityTitle: updated.title,
      beforeValues: existing,
      afterValues: updated,
      actor: session,
    });

    await recordContentRevision({
      entityType: 'Project',
      entityId: updated.id,
      snapshot: updated,
      changeReason: body.changeReason || 'Updated project details',
      actor: session,
    });

    return NextResponse.json({ success: true, project: updated });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    return NextResponse.json({ error: error.message || 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth('ADMIN');
    const { id } = await context.params;

    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const softDeleted = await prisma.project.update({
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
      entityType: 'Project',
      entityId: id,
      entityTitle: existing.title,
      beforeValues: existing,
      afterValues: softDeleted,
      actor: session,
    });

    return NextResponse.json({
      success: true,
      message: 'Project moved to trash safely.',
    });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
