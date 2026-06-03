import 'server-only';

import {createAdminClient} from '@/lib/supabase/admin';
import {slugify} from '@/lib/admin/slugify';

export const GALLERY_BUCKET = 'gallery';

/** 5 MB — matches next.config experimental.serverActions.bodySizeLimit. */
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/gif'
] as const;

/**
 * Builds a unique storage path. Optional `prefix` lets callers stash
 * files under a subfolder inside the bucket (e.g. 'trainers/').
 */
function buildPath(originalName: string, prefix?: string): string {
  const dot = originalName.lastIndexOf('.');
  const base = dot >= 0 ? originalName.slice(0, dot) : originalName;
  const extRaw = dot >= 0 ? originalName.slice(dot + 1) : 'jpg';
  const ext = extRaw.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
  const slug = slugify(base || 'image') || 'image';
  const name = `${slug}-${Date.now()}.${ext}`;
  return prefix ? `${prefix.replace(/\/+$/, '')}/${name}` : name;
}

export type UploadResult = {url: string; path: string};

/**
 * Uploads a File to the gallery bucket and returns its public URL.
 * Validates size + MIME type — throws a Turkish error on failure.
 */
export async function uploadGalleryImage(
  file: File,
  options: {prefix?: string} = {}
): Promise<UploadResult> {
  if (!file || file.size === 0) {
    throw new Error('Lütfen geçerli bir görsel seçin.');
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error('Görsel boyutu en fazla 5 MB olmalı.');
  }
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as never)) {
    throw new Error(
      'Sadece JPEG, PNG, WebP, AVIF veya GIF formatında görsel yükleyebilirsin.'
    );
  }

  const admin = createAdminClient();
  const path = buildPath(file.name, options.prefix);

  const {error: uploadErr} = await admin.storage
    .from(GALLERY_BUCKET)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type
    });

  if (uploadErr) {
    console.error('[storage.uploadGalleryImage]', uploadErr);
    throw new Error('Görsel yüklenemedi. Lütfen tekrar dene.');
  }

  const {
    data: {publicUrl}
  } = admin.storage.from(GALLERY_BUCKET).getPublicUrl(path);

  return {url: publicUrl, path};
}

/**
 * Deletes one or more objects from the gallery bucket. Accepts either
 * the storage path (e.g. 'foo-123.jpg', 'trainers/bar-456.jpg') OR a
 * full public URL — the URL is parsed for its bucket-relative path.
 */
export async function deleteGalleryImage(pathOrUrl: string): Promise<void> {
  const path = toStoragePath(pathOrUrl);
  if (!path) return;

  const admin = createAdminClient();
  const {error} = await admin.storage.from(GALLERY_BUCKET).remove([path]);
  if (error) {
    // Don't throw on a missing file — log and continue so the calling
    // CRUD action can still proceed with the DB delete/update.
    console.error('[storage.deleteGalleryImage]', error);
  }
}

/** Extract a bucket-relative path from a full Supabase public URL. */
export function toStoragePath(pathOrUrl: string): string | null {
  if (!pathOrUrl) return null;
  if (!pathOrUrl.startsWith('http')) return pathOrUrl;

  // Match …/storage/v1/object/public/<bucket>/<path>
  const m = pathOrUrl.match(
    /\/storage\/v1\/object\/public\/([^/]+)\/(.+)$/
  );
  if (!m) return null;
  const [, bucket, path] = m;
  if (bucket !== GALLERY_BUCKET) return null;
  return path;
}
