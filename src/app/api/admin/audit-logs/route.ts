import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getStoreAuditLogs } from '@/lib/store';

export async function GET(req: NextRequest) {
  try {
    await requireAuth('ADMIN');

    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action') || '';
    const entityType = searchParams.get('entityType') || '';
    const search = searchParams.get('q') || '';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '50')));
    const skip = (page - 1) * limit;

    let logs: any[] = [];
    let total = 0;

    try {
      const where: any = {};
      if (action && action !== 'ALL') where.action = action;
      if (entityType && entityType !== 'ALL') where.entityType = entityType;
      if (search) {
        where.OR = [
          { entityTitle: { contains: search, mode: 'insensitive' } },
          { userName: { contains: search, mode: 'insensitive' } },
          { userEmail: { contains: search, mode: 'insensitive' } },
        ];
      }

      const [dbLogs, dbTotal] = await Promise.all([
        prisma.auditLog.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.auditLog.count({ where }),
      ]);

      if (dbLogs.length > 0 || dbTotal > 0) {
        logs = dbLogs;
        total = dbTotal;
      }
    } catch (dbErr) {
      console.warn('Prisma audit logs fetch fallback to store:', dbErr);
    }

    if (logs.length === 0) {
      const allLogs = getStoreAuditLogs();
      total = allLogs.length;
      logs = allLogs.slice(skip, skip + limit);
    }

    return NextResponse.json({
      logs,
      auditLogs: logs,
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to fetch audit logs' }, { status: 500 });
  }
}
