import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { recordAuditLog } from '@/lib/audit';

export async function GET(req: NextRequest) {
  try {
    await requireAuth();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || '';

    const where: any = {};
    if (status && status !== 'ALL') {
      where.status = status;
    }

    let inquiries: any[] = [];
    try {
      inquiries = await prisma.enquiry.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: 100,
      });
    } catch (dbErr) {
      console.warn('DB error fetching inquiries:', dbErr);
    }

    return NextResponse.json({ inquiries });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to fetch inquiries' }, { status: 500 });
  }
}
