/**
 * Client-side image resizing and compression utility.
 * Downscales images proportionally before uploading to Firestore,
 * ensuring document sizes stay strictly within Firestore limits (<100KB)
 * while preserving high fidelity for Neo-brutalist cards and thumbnails.
 */

export interface ResizeImageOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 to 1.0 (default 0.85)
  format?: 'image/jpeg' | 'image/webp' | 'image/png';
}

export const resizeImageFile = (
  file: File,
  options: ResizeImageOptions = {}
): Promise<string> => {
  const {
    maxWidth = 500,
    maxHeight = 500,
    quality = 0.85,
    format = 'image/jpeg',
  } = options;

  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      return reject(new Error('Selected file is not an image'));
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));

    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to parse image data'));

      img.onload = () => {
        let { width, height } = img;

        // Calculate proportional scale
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Canvas 2D context not available'));
        }

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL(format, quality);
        resolve(dataUrl);
      };

      img.src = readerEvent.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
};
