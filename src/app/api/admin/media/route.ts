import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { processAndStoreFile } from '@/lib/storage';
import { recordAuditLog } from '@/lib/audit';

export async function GET(req: NextRequest) {
  try {
    await requireAuth();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';
    const type = searchParams.get('type') || ''; // 'image' | 'video'
    const status = searchParams.get('status') || '';
    const projectId = searchParams.get('projectId') || '';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '24')));
    const skip = (page - 1) * limit;

    const where: any = {
      isDeleted: false,
    };

    if (category && category !== 'ALL') {
      where.category = category;
    }

    if (type === 'image') {
      where.isVideo = false;
    } else if (type === 'video') {
      where.isVideo = true;
    }

    if (status && status !== 'ALL') {
      where.status = status;
    }

    if (projectId) {
      where.projectId = projectId;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
        { filename: { contains: search, mode: 'insensitive' } },
        { tags: { hasSome: [search] } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.mediaItem.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
        include: {
          project: {
            select: { id: true, title: true, slug: true },
          },
        },
      }),
      prisma.mediaItem.count({ where }),
    ]);

    return NextResponse.json({
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth('EDITOR');

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate size (100MB limit)
    const MAX_SIZE = 100 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File exceeds 100MB size limit' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const stored = await processAndStoreFile(buffer, file.name, file.type);

    // Extract metadata from form
    const title = (formData.get('title') as string) || pathWithoutExt(file.name);
    const description = (formData.get('description') as string) || '';
    const category = (formData.get('category') as string) || 'Portfolio';
    const altText = (formData.get('altText') as string) || title;
    const location = (formData.get('location') as string) || '';
    const projectId = (formData.get('projectId') as string) || null;
    const featured = formData.get('featured') === 'true';
    const status = (formData.get('status') as string) || 'PUBLISHED';
    const tagsRaw = (formData.get('tags') as string) || '';
    const tags = tagsRaw
      ? tagsRaw.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    const mediaItem = await prisma.mediaItem.create({
      data: {
        url: stored.url,
        storageKey: stored.storageKey,
        storageBucket: stored.storageBucket,
        storageProvider: stored.storageProvider,
        filename: stored.filename,
        originalName: stored.originalName,
        mimeType: stored.mimeType,
        sizeBytes: stored.sizeBytes,
        width: stored.width,
        height: stored.height,
        isVideo: stored.isVideo,
        posterUrl: stored.posterUrl,
        title,
        description,
        category,
        tags,
        projectId: projectId && projectId !== 'none' ? projectId : null,
        altText,
        location,
        featured,
        status,
        uploadedById: session.id,
      },
    });

    await recordAuditLog({
      action: 'CREATE',
      entityType: 'MediaItem',
      entityId: mediaItem.id,
      entityTitle: mediaItem.title,
      afterValues: mediaItem,
      actor: session,
      metadata: {
        filesize: stored.sizeBytes,
        mimetype: stored.mimeType,
        provider: stored.storageProvider,
      },
    });

    return NextResponse.json({ success: true, item: mediaItem });
  } catch (error: any) {
    console.error('Media upload error:', error);
    if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    return NextResponse.json({ error: error.message || 'Failed to upload media' }, { status: 500 });
  }
}

function pathWithoutExt(name: string): string {
  const lastDot = name.lastIndexOf('.');
  if (lastDot === -1) return name;
  return name.substring(0, lastDot).replace(/[-_]/g, ' ');
}
