import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { isCloudStorageConfigured } from '@/lib/storage';
import {
  getStoreMedia,
  getStoreProjects,
  getStoreServices,
  getStoreTrash,
  getStoreAuditLogs,
} from '@/lib/store';

export async function GET() {
  try {
    await requireAuth();

    let totalMedia = 0;
    let totalBytes = 0;
    let totalProjects = 0;
    let totalServices = 0;
    let pendingEnquiries = 0;
    let trashCount = 0;
    let recentAudits: any[] = [];
    let hasDbStats = false;

    try {
      const [mediaCount, mediaSizeAgg, projectsCount, servicesCount, enquiriesCount, trashMedia, trashProj, audits] =
        await Promise.all([
          prisma.mediaItem.count({ where: { isDeleted: false } }),
          prisma.mediaItem.aggregate({
            _sum: { sizeBytes: true },
            where: { isDeleted: false },
          }),
          prisma.project.count({ where: { isDeleted: false } }),
          prisma.service.count({ where: { isDeleted: false } }),
          prisma.enquiry.count({ where: { status: 'PENDING' } }),
          prisma.mediaItem.count({ where: { isDeleted: true } }),
          prisma.project.count({ where: { isDeleted: true } }),
          prisma.auditLog.findMany({
            take: 8,
            orderBy: { createdAt: 'desc' },
          }),
        ]);

      totalMedia = mediaCount;
      totalBytes = mediaSizeAgg._sum.sizeBytes || 0;
      totalProjects = projectsCount;
      totalServices = servicesCount;
      pendingEnquiries = enquiriesCount;
      trashCount = trashMedia + trashProj;
      recentAudits = audits;
      hasDbStats = true;
    } catch (dbErr) {
      console.warn('Stats database fetch fallback to store:', dbErr);
    }

    if (!hasDbStats || totalMedia === 0) {
      const storeMedia = getStoreMedia();
      totalMedia = storeMedia.length;
      totalBytes = storeMedia.reduce((acc, m) => acc + (m.sizeBytes || 0), 0);
      totalProjects = getStoreProjects().length;
      totalServices = getStoreServices().length;
      trashCount = getStoreTrash().length;
      recentAudits = getStoreAuditLogs().slice(0, 8);
    }

    return NextResponse.json({
      mediaCount: totalMedia,
      projectsCount: totalProjects,
      servicesCount: totalServices,
      pendingInquiriesCount: pendingEnquiries,
      storageSizeFormatted: (totalBytes / (1024 * 1024)).toFixed(2) + ' MB',
      metrics: {
        totalMedia,
        storageBytes: totalBytes,
        storageFormatted: (totalBytes / (1024 * 1024)).toFixed(2) + ' MB',
        totalProjects,
        totalServices,
        pendingEnquiries,
        trashCount,
        storageType: isCloudStorageConfigured() ? 'Cloud Object Storage (S3/R2)' : 'Local File System Storage',
      },
      recentAudits,
    });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
