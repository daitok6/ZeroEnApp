'use client';

import { useState } from 'react';
import { ZoomIn, X } from 'lucide-react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';

interface ScreenshotImageProps {
  src: string;
  alt: string;
}

/**
 * Renders a screenshot image with a click-to-expand lightbox.
 * Hides itself on load error, letting the underlying placeholder show through.
 */
export function ScreenshotImage({ src, alt }: ScreenshotImageProps) {
  const [errored, setErrored] = useState(false);

  if (errored) return null;

  return (
    <Dialog>
      <DialogTrigger
        className="relative w-full h-full block cursor-zoom-in group"
        aria-label={`View ${alt} full screen`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={() => setErrored(true)}
        />
        {/* Hover affordance — desktop only */}
        <div className="absolute inset-0 hidden sm:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150 bg-black/20">
          <ZoomIn className="w-8 h-8 text-white drop-shadow-lg" />
        </div>
      </DialogTrigger>

      <DialogContent
        className="bg-[#0D0D0D] p-0 ring-0 max-w-[95vw] sm:max-w-[95vw] rounded-lg overflow-hidden"
        showCloseButton={false}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="w-full max-h-[90vh] object-contain"
        />
        <DialogClose className="absolute top-3 right-3 bg-black/60 rounded-full p-1.5 text-[#F4F4F2] hover:bg-black/80 transition-colors z-10">
          <X size={16} />
          <span className="sr-only">Close</span>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
