import { prisma } from './db';
import { getCurrentSession, SessionUser } from './auth';

export interface AuditLogInput {
  action:
    | 'CREATE'
    | 'UPDATE'
    | 'PUBLISH'
    | 'UNPUBLISH'
    | 'SOFT_DELETE'
    | 'RESTORE'
    | 'PERMANENT_DELETE'
    | 'LOGIN'
    | 'REORDER'
    | 'SETTINGS_CHANGE'
    | 'BULK_ACTION';
  entityType:
    | 'MediaItem'
    | 'Project'
    | 'Service'
    | 'SiteSetting'
    | 'Testimonial'
    | 'TeamMember'
    | 'User'
    | 'Auth'
    | 'Enquiry';
  entityId?: string | null;
  entityTitle?: string | null;
  beforeValues?: any;
  afterValues?: any;
  metadata?: Record<string, any>;
  actor?: SessionUser | null;
}

export async function recordAuditLog(input: AuditLogInput): Promise<void> {
  try {
    const actor = input.actor || (await getCurrentSession());

    await prisma.auditLog.create({
      data: {
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId || null,
        entityTitle: input.entityTitle || null,
        beforeValues: input.beforeValues ? JSON.parse(JSON.stringify(input.beforeValues)) : undefined,
        afterValues: input.afterValues ? JSON.parse(JSON.stringify(input.afterValues)) : undefined,
        metadata: input.metadata ? JSON.parse(JSON.stringify(input.metadata)) : undefined,
        userId: actor?.id || null,
        userName: actor?.name || 'System / Anonymous',
        userEmail: actor?.email || null,
        userRole: actor?.role || null,
      },
    });
  } catch (err) {
    console.warn('Audit log recording fallback (e.g. database offline):', err);
  }
}

export async function recordContentRevision(params: {
  entityType: 'Project' | 'Service' | 'Testimonial' | 'MediaItem';
  entityId: string;
  snapshot: any;
  changeReason?: string;
  actor?: SessionUser | null;
}): Promise<void> {
  try {
    const actor = params.actor || (await getCurrentSession());

    // Find current latest version count
    const count = await prisma.contentRevision.count({
      where: {
        entityType: params.entityType,
        entityId: params.entityId,
      },
    });

    await prisma.contentRevision.create({
      data: {
        entityType: params.entityType,
        entityId: params.entityId,
        version: count + 1,
        snapshot: JSON.parse(JSON.stringify(params.snapshot)),
        changeReason: params.changeReason || 'Updated content',
        createdById: actor?.id || null,
      },
    });
  } catch (err) {
    console.warn('Content revision recording failed:', err);
  }
}

export async function recordSettingRevision(params: {
  settingId: string;
  value: any;
  changeReason?: string;
  actor?: SessionUser | null;
}): Promise<void> {
  try {
    const actor = params.actor || (await getCurrentSession());

    const count = await prisma.settingRevision.count({
      where: { settingId: params.settingId },
    });

    await prisma.settingRevision.create({
      data: {
        settingId: params.settingId,
        value: JSON.parse(JSON.stringify(params.value)),
        version: count + 1,
        changeReason: params.changeReason || 'Updated setting',
        createdById: actor?.id || null,
      },
    });
  } catch (err) {
    console.warn('Setting revision recording failed:', err);
  }
}
