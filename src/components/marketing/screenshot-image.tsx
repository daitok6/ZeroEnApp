'use client';

interface ScreenshotImageProps {
  src: string;
  alt: string;
}

/**
 * Renders a screenshot image and hides itself on load error,
 * letting the underlying placeholder text show through.
 */
export function ScreenshotImage({ src, alt }: ScreenshotImageProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className="relative w-full h-full object-cover"
      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
    />
  );
}
