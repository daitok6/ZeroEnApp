import imageCompression from 'browser-image-compression';

const OPTIONS = {
  maxSizeMB: 2,
  maxWidthOrHeight: 2000,
  useWebWorker: true,
  initialQuality: 0.85,
};

/**
 * Compress a raster image file before upload.
 * SVGs are returned unchanged (can't be raster-compressed).
 * On any failure, returns the original file so the upload can still proceed.
 */
export async function compressPhoto(file: File): Promise<File> {
  if (file.type === 'image/svg+xml') return file;
  try {
    return await imageCompression(file, OPTIONS);
  } catch {
    return file;
  }
}
