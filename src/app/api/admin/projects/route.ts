import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { recordAuditLog, recordContentRevision } from '@/lib/audit';

export async function GET(req: NextRequest) {
  try {
    await requireAuth();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || '';
    const status = searchParams.get('status') || '';
    const search = searchParams.get('q') || '';

    const where: any = { isDeleted: false };
    if (category && category !== 'ALL') where.category = category;
    if (status && status !== 'ALL') where.status = status;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { client: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const projects = await prisma.project.findMany({
      where,
      orderBy: [{ order: 'asc' }, { year: 'desc' }, { createdAt: 'desc' }],
      include: {
        _count: { select: { mediaItems: true } },
      },
    });

    return NextResponse.json({ projects });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth('EDITOR');
    const body = await req.json();

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

    if (!title || !category || !coverImage) {
      return NextResponse.json(
        { error: 'Title, category, and cover image are required.' },
        { status: 400 }
      );
    }

    const autoSlug =
      slug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') + `-${Date.now().toString().slice(-4)}`;

    const project = await prisma.project.create({
      data: {
        title,
        slug: autoSlug,
        category,
        description: description || '',
        client: client || null,
        year: year ? parseInt(year) : new Date().getFullYear(),
        location: location || 'Worldwide',
        coverImage,
        videoUrl: videoUrl || null,
        duration: duration || null,
        isVideo: Boolean(isVideo),
        featured: Boolean(featured),
        status: status || 'PUBLISHED',
        order: order !== undefined ? parseInt(order) : 0,
        gallery: Array.isArray(gallery) ? gallery : [],
        deliverables: Array.isArray(deliverables) ? deliverables : [],
        gearUsed: Array.isArray(gearUsed) ? gearUsed : [],
      },
    });

    await recordAuditLog({
      action: 'CREATE',
      entityType: 'Project',
      entityId: project.id,
      entityTitle: project.title,
      afterValues: project,
      actor: session,
    });

    await recordContentRevision({
      entityType: 'Project',
      entityId: project.id,
      snapshot: project,
      changeReason: 'Initial project creation',
      actor: session,
    });

    return NextResponse.json({ success: true, project });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    return NextResponse.json({ error: error.message || 'Failed to create project' }, { status: 500 });
  }
}
