import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { recordAuditLog, recordSettingRevision } from '@/lib/audit';

export async function GET(req: NextRequest) {
  try {
    await requireAuth();
    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key');

    if (!key) {
      return NextResponse.json({ error: 'Setting key is required' }, { status: 400 });
    }

    const setting = await prisma.siteSetting.findUnique({
      where: { key },
      include: {
        revisions: {
          orderBy: { version: 'desc' },
          take: 20,
        },
      },
    });

    if (!setting) {
      return NextResponse.json({ revisions: [] });
    }

    return NextResponse.json({ revisions: setting.revisions });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to fetch revisions' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth('ADMIN');
    const { revisionId } = await req.json();

    if (!revisionId) {
      return NextResponse.json({ error: 'Revision ID is required' }, { status: 400 });
    }

    const revision = await prisma.settingRevision.findUnique({
      where: { id: revisionId },
      include: { setting: true },
    });

    if (!revision) {
      return NextResponse.json({ error: 'Revision not found' }, { status: 404 });
    }

    const previousValue = revision.setting.value;
    const restoredValue = revision.value;

    // Apply restored value to setting
    const updated = await prisma.siteSetting.update({
      where: { id: revision.settingId },
      data: {
        value: restoredValue as any,
        updatedById: session.id,
      },
    });

    // Record new revision denoting rollback
    await recordSettingRevision({
      settingId: updated.id,
      value: restoredValue,
      changeReason: `Restored to historical version ${revision.version}`,
      actor: session,
    });

    // Record audit log
    await recordAuditLog({
      action: 'RESTORE',
      entityType: 'SiteSetting',
      entityId: updated.id,
      entityTitle: `Restored ${updated.label || updated.key} to v${revision.version}`,
      beforeValues: previousValue,
      afterValues: restoredValue,
      actor: session,
      metadata: { restoredFromVersion: revision.version },
    });

    return NextResponse.json({
      success: true,
      message: `Setting restored to version ${revision.version} successfully.`,
      setting: updated,
    });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    return NextResponse.json({ error: error.message || 'Rollback failed' }, { status: 500 });
  }
}
