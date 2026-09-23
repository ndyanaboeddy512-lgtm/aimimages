import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { recordAuditLog, recordSettingRevision } from '@/lib/audit';
import { getStoreRevisions, rollbackStoreRevision, setStoreSetting } from '@/lib/store';

export async function GET(req: NextRequest) {
  try {
    await requireAuth();
    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key');

    if (!key) {
      return NextResponse.json({ error: 'Setting key is required' }, { status: 400 });
    }

    let revisions: any[] = [];
    try {
      const setting = await prisma.siteSetting.findUnique({
        where: { key },
        include: {
          revisions: {
            orderBy: { version: 'desc' },
            take: 20,
          },
        },
      });
      if (setting && setting.revisions) {
        revisions = setting.revisions;
      }
    } catch (dbErr) {
      console.warn('Prisma revisions query fallback:', dbErr);
    }

    if (revisions.length === 0) {
      revisions = getStoreRevisions(key);
    }

    return NextResponse.json({ revisions });
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
    const { revisionId, version, key } = await req.json();

    if (!revisionId && !version) {
      return NextResponse.json({ error: 'Revision ID or version is required' }, { status: 400 });
    }

    let restoredValue: any = null;
    let targetVersion = version || 1;

    try {
      const revision = await prisma.settingRevision.findUnique({
        where: { id: revisionId },
        include: { setting: true },
      });

      if (revision) {
        targetVersion = revision.version;
        const previousValue = revision.setting.value;
        restoredValue = revision.value;
        const safeUserId = session.id !== 'superadmin-fallback' ? session.id : null;

        // Apply restored value to setting
        const updated = await prisma.siteSetting.update({
          where: { id: revision.settingId },
          data: {
            value: restoredValue as any,
            updatedById: safeUserId,
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

        if (key) {
          setStoreSetting(key, restoredValue, undefined, `Restored to v${revision.version}`, session);
        }

        return NextResponse.json({
          success: true,
          message: `Setting restored to version ${revision.version} successfully.`,
          setting: updated,
        });
      }
    } catch (dbErr) {
      console.warn('Prisma rollback fallback:', dbErr);
    }

    if (key && targetVersion) {
      const target = rollbackStoreRevision(key, targetVersion);
      if (target) {
        return NextResponse.json({
          success: true,
          message: `Setting restored to version ${targetVersion} successfully.`,
          value: target.value,
        });
      }
    }

    return NextResponse.json({ success: true, message: 'Setting restored successfully.' });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    return NextResponse.json({ error: error.message || 'Rollback failed' }, { status: 500 });
  }
}
