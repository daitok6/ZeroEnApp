'use client';

import dynamic from 'next/dynamic';

const ChangeCatalogueSheet = dynamic(
  () => import('./change-catalogue-sheet').then((m) => m.ChangeCatalogueSheet),
  { ssr: false }
);

export { ChangeCatalogueSheet };
