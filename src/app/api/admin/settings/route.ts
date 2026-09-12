import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { recordAuditLog, recordSettingRevision } from '@/lib/audit';

export async function GET() {
  try {
    await requireAuth();

    const settings = await prisma.siteSetting.findMany({
      orderBy: { category: 'asc' },
    });

    const settingsMap: Record<string, any> = {};
    for (const s of settings) {
      settingsMap[s.key] = s.value;
    }

    return NextResponse.json({ settings, settingsMap });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth('ADMIN');
    const body = await req.json();
    const { key, value, category, label, description, changeReason } = body;

    if (!key || value === undefined) {
      return NextResponse.json({ error: 'Key and value are required.' }, { status: 400 });
    }

    const existing = await prisma.siteSetting.findUnique({ where: { key } });

    const updated = await prisma.siteSetting.upsert({
      where: { key },
      update: {
        value,
        label: label !== undefined ? label : existing?.label,
        description: description !== undefined ? description : existing?.description,
        updatedById: session.id,
      },
      create: {
        key,
        category: category || 'GENERAL',
        label: label || key,
        description: description || '',
        value,
        updatedById: session.id,
      },
    });

    // Save snapshot revision
    await recordSettingRevision({
      settingId: updated.id,
      value,
      changeReason: changeReason || 'Updated in admin dashboard',
      actor: session,
    });

    // Record audit log
    await recordAuditLog({
      action: 'SETTINGS_CHANGE',
      entityType: 'SiteSetting',
      entityId: updated.id,
      entityTitle: updated.label || updated.key,
      beforeValues: existing?.value,
      afterValues: updated.value,
      actor: session,
      metadata: { key: updated.key, category: updated.category },
    });

    return NextResponse.json({ success: true, setting: updated });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    return NextResponse.json({ error: error.message || 'Failed to save setting' }, { status: 500 });
  }
}
