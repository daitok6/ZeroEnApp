'use client';

import { useState } from 'react';
import { FileUploadZone } from './file-upload-zone';
import { FileList } from './file-list';
import type { Database } from '@/types/database';

type FileRecord = Database['public']['Tables']['files']['Row'];

interface FilesPageClientProps {
  initialFiles: FileRecord[];
  locale: string;
}

export function FilesPageClient({ initialFiles, locale }: FilesPageClientProps) {
  const [files, setFiles] = useState<FileRecord[]>(initialFiles);

  const handleUploadComplete = (newFile: FileRecord) => {
    setFiles((prev) => [newFile, ...prev]);
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[#6B7280] text-xs font-mono uppercase tracking-widest mb-3">
          {locale === 'ja' ? 'アップロード' : 'Upload'}
        </p>
        <FileUploadZone onUploadComplete={handleUploadComplete} locale={locale} />
      </div>

      <div>
        <p className="text-[#6B7280] text-xs font-mono uppercase tracking-widest mb-3">
          {locale === 'ja' ? `ファイル (${files.length})` : `Files (${files.length})`}
        </p>
        <FileList initialFiles={files} locale={locale} />
      </div>
    </div>
  );
}
