import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { recordAuditLog } from '@/lib/audit';

export async function GET() {
  try {
    await requireAuth();
    const testimonials = await prisma.testimonial.findMany({
      where: { isDeleted: false },
      orderBy: [{ featured: 'desc' }, { order: 'asc' }, { createdAt: 'desc' }],
    });
    return NextResponse.json({ testimonials });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth('EDITOR');
    const body = await req.json();
    const { clientName, roleOrEvent, comment, rating, avatar, featured, status, order } = body;

    if (!clientName || !comment) {
      return NextResponse.json(
        { error: 'Client name and comment are required.' },
        { status: 400 }
      );
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        clientName,
        roleOrEvent: roleOrEvent || 'Wedding Client',
        comment,
        rating: rating ? parseInt(rating) : 5,
        avatar: avatar || null,
        featured: Boolean(featured),
        status: status || 'PUBLISHED',
        order: order !== undefined ? parseInt(order) : 0,
      },
    });

    await recordAuditLog({
      action: 'CREATE',
      entityType: 'Testimonial',
      entityId: testimonial.id,
      entityTitle: testimonial.clientName,
      afterValues: testimonial,
      actor: session,
    });

    return NextResponse.json({ success: true, testimonial });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    return NextResponse.json({ error: error.message || 'Failed to create testimonial' }, { status: 500 });
  }
}
