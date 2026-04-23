'use client';

import dynamic from 'next/dynamic';
import { useReducedMotion } from 'framer-motion';

const CanvasScene = dynamic(
  () => import('./hero-3d-canvas').then((m) => m.CanvasScene),
  { ssr: false, loading: () => null }
);

function StaticFallback() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full" aria-hidden>
      <polygon
        points="100,18 182,60 182,140 100,182 18,140 18,60"
        fill="none" stroke="#00E87A" strokeWidth="1" opacity="0.25"
      />
      <polygon
        points="100,48 152,74 152,126 100,152 48,126 48,74"
        fill="none" stroke="#00E87A" strokeWidth="0.6" opacity="0.15"
      />
      {[0, 60, 120, 180, 240, 300].map((deg, i) => {
        const r = (deg * Math.PI) / 180;
        return (
          <circle
            key={i}
            cx={100 + Math.cos(r) * 85}
            cy={100 + Math.sin(r) * 85}
            r="2.5" fill="#00E87A" opacity="0.3"
          />
        );
      })}
    </svg>
  );
}

export function Hero3DScene() {
  const reduced = useReducedMotion();

  return (
    <div className="w-full h-full">
      {reduced ? <StaticFallback /> : <CanvasScene />}
    </div>
  );
}
