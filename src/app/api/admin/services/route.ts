import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { recordAuditLog, recordContentRevision } from '@/lib/audit';

export async function GET() {
  try {
    await requireAuth();
    const services = await prisma.service.findMany({
      where: { isDeleted: false },
      orderBy: { order: 'asc' },
    });
    return NextResponse.json({ services });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth('EDITOR');
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

    if (!title || !startingPrice) {
      return NextResponse.json(
        { error: 'Title and starting price are required.' },
        { status: 400 }
      );
    }

    const autoSlug =
      slug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const service = await prisma.service.create({
      data: {
        title,
        slug: autoSlug,
        tagline: tagline || '',
        description: description || '',
        icon: icon || 'Camera',
        startingPrice,
        deliverables: Array.isArray(deliverables) ? deliverables : [],
        timeline: timeline || '2 - 4 Weeks',
        order: order !== undefined ? parseInt(order) : 0,
        status: status || 'PUBLISHED',
      },
    });

    await recordAuditLog({
      action: 'CREATE',
      entityType: 'Service',
      entityId: service.id,
      entityTitle: service.title,
      afterValues: service,
      actor: session,
    });

    await recordContentRevision({
      entityType: 'Service',
      entityId: service.id,
      snapshot: service,
      changeReason: 'Created service package',
      actor: session,
    });

    return NextResponse.json({ success: true, service });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    return NextResponse.json({ error: error.message || 'Failed to create service' }, { status: 500 });
  }
}
