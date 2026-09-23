import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

const S3_BUCKET = process.env.S3_BUCKET || process.env.AWS_S3_BUCKET;
const S3_REGION = process.env.S3_REGION || process.env.AWS_REGION || 'auto';
const S3_ENDPOINT = process.env.S3_ENDPOINT || process.env.CLOUDFLARE_R2_ENDPOINT;
const S3_ACCESS_KEY = process.env.S3_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID;
const S3_SECRET_KEY = process.env.S3_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY;
const S3_PUBLIC_DOMAIN = process.env.S3_PUBLIC_DOMAIN; // e.g. https://media.aimimages.com or R2 public URL

export function isCloudStorageConfigured(): boolean {
  return Boolean(S3_BUCKET && S3_ACCESS_KEY && S3_SECRET_KEY);
}

let s3ClientInstance: S3Client | null = null;
function getS3Client(): S3Client {
  if (!s3ClientInstance) {
    s3ClientInstance = new S3Client({
      region: S3_REGION,
      endpoint: S3_ENDPOINT || undefined,
      credentials: {
        accessKeyId: S3_ACCESS_KEY || '',
        secretAccessKey: S3_SECRET_KEY || '',
      },
    });
  }
  return s3ClientInstance;
}

export interface UploadResult {
  url: string;
  storageKey: string;
  storageBucket: string;
  storageProvider: 'S3' | 'R2' | 'SUPABASE' | 'LOCAL';
  filename: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  width?: number | null;
  height?: number | null;
  isVideo: boolean;
  posterUrl?: string | null;
}

export async function processAndStoreFile(
  fileBuffer: Buffer,
  originalName: string,
  mimeType: string
): Promise<UploadResult> {
  const isVideo = mimeType.startsWith('video/');
  const ext = path.extname(originalName) || (isVideo ? '.mp4' : '.jpg');
  const sanitizedBase = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
  const timestamp = Date.now();
  const uniqueKey = `uploads/${timestamp}-${sanitizedBase}${ext}`;
  const filename = `${timestamp}-${sanitizedBase}${ext}`;

  let width: number | null = null;
  let height: number | null = null;
  let optimizedBuffer = fileBuffer;
  let posterUrl: string | null = null;

  // Process image if not video
  if (!isVideo && (mimeType.startsWith('image/') || mimeType === 'application/octet-stream')) {
    try {
      const meta = await sharp(fileBuffer).metadata();
      width = meta.width || null;
      height = meta.height || null;

      // If very large image, produce an optimized high-quality web-ready version
      if (width && width > 2560) {
        optimizedBuffer = await sharp(fileBuffer)
          .resize({ width: 2560, withoutEnlargement: true })
          .toBuffer();
      }
    } catch (e) {
      console.warn('Sharp metadata extraction skipped:', e);
    }
  }

  // Choose Storage Provider
  if (isCloudStorageConfigured()) {
    const s3 = getS3Client();
    const providerName = S3_ENDPOINT?.includes('r2.cloudflarestorage')
      ? 'R2'
      : S3_ENDPOINT?.includes('supabase')
      ? 'SUPABASE'
      : 'S3';

    await s3.send(
      new PutObjectCommand({
        Bucket: S3_BUCKET!,
        Key: uniqueKey,
        Body: optimizedBuffer,
        ContentType: mimeType,
      })
    );

    let url = '';
    if (S3_PUBLIC_DOMAIN) {
      url = `${S3_PUBLIC_DOMAIN.replace(/\/$/, '')}/${uniqueKey}`;
    } else if (S3_ENDPOINT) {
      url = `${S3_ENDPOINT}/${S3_BUCKET}/${uniqueKey}`;
    } else {
      url = `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/${uniqueKey}`;
    }

    return {
      url,
      storageKey: uniqueKey,
      storageBucket: S3_BUCKET!,
      storageProvider: providerName,
      filename,
      originalName,
      mimeType,
      sizeBytes: optimizedBuffer.length,
      width,
      height,
      isVideo,
      posterUrl,
    };
  }

  // Fallback: Local Disk Storage with serverless read-only fallback
  try {
    const localUploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(localUploadsDir)) {
      fs.mkdirSync(localUploadsDir, { recursive: true });
    }

    const localFilePath = path.join(localUploadsDir, filename);
    fs.writeFileSync(localFilePath, optimizedBuffer);

    return {
      url: `/uploads/${filename}`,
      storageKey: uniqueKey,
      storageBucket: 'local-filesystem',
      storageProvider: 'LOCAL',
      filename,
      originalName,
      mimeType,
      sizeBytes: optimizedBuffer.length,
      width,
      height,
      isVideo,
      posterUrl,
    };
  } catch (fsErr) {
    console.warn('Filesystem write failed (likely serverless/read-only), falling back to data URL:', fsErr);
    const base64Data = optimizedBuffer.toString('base64');
    const dataUrl = `data:${mimeType};base64,${base64Data}`;
    return {
      url: dataUrl,
      storageKey: uniqueKey,
      storageBucket: 'memory-data-url',
      storageProvider: 'LOCAL',
      filename,
      originalName,
      mimeType,
      sizeBytes: optimizedBuffer.length,
      width,
      height,
      isVideo,
      posterUrl,
    };
  }
}

export async function purgeStoredFile(params: {
  storageKey?: string | null;
  storageBucket?: string | null;
  storageProvider?: string | null;
  url?: string;
}): Promise<boolean> {
  const { storageKey, storageBucket, storageProvider, url } = params;

  if (storageProvider === 'LOCAL' || (!storageProvider && url?.startsWith('/uploads/'))) {
    try {
      const filename = storageKey?.replace(/^uploads\//, '') || (url ? path.basename(url) : null);
      if (filename) {
        const localPath = path.join(process.cwd(), 'public', 'uploads', filename);
        if (fs.existsSync(localPath)) {
          fs.unlinkSync(localPath);
        }
      }
      return true;
    } catch (e) {
      console.warn('Failed to delete local file:', e);
      return false;
    }
  }

  if (isCloudStorageConfigured() && storageKey && storageBucket) {
    try {
      const s3 = getS3Client();
      await s3.send(
        new DeleteObjectCommand({
          Bucket: storageBucket,
          Key: storageKey,
        })
      );
      return true;
    } catch (e) {
      console.warn('Failed to delete cloud object:', e);
      return false;
    }
  }

  return true;
}
