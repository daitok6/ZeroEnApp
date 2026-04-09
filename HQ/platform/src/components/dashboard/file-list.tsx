'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { getFileIcon, formatFileSize } from '@/lib/file-icons';
import type { Database } from '@/types/database';

type FileRecord = Database['public']['Tables']['files']['Row'];

interface FileListProps {
  initialFiles: FileRecord[];
  locale: string;
}

export function FileList({ initialFiles, locale }: FileListProps) {
  const [files] = useState<FileRecord[]>(initialFiles);
  const supabase = createClient();

  const handleDownload = async (file: FileRecord) => {
    const { data } = await supabase.storage
      .from('project-files')
      .createSignedUrl(file.storage_path, 60); // 60 second signed URL

    if (data?.signedUrl) {
      const a = document.createElement('a');
      a.href = data.signedUrl;
      a.download = file.file_name;
      a.click();
    }
  };

  if (files.length === 0) {
    return (
      <p className="text-[#6B7280] font-mono text-sm text-center py-8">
        {locale === 'ja' ? 'ファイルはまだありません' : 'No files yet'}
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {files.map((file) => (
        <div
          key={file.id}
          className="flex items-center gap-3 p-3 md:p-4 border border-[#374151] rounded-lg bg-[#111827] hover:border-[#374151]/60 transition-colors"
        >
          {/* Icon */}
          <span className="text-xl shrink-0" aria-hidden="true">
            {getFileIcon(file.mime_type)}
          </span>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-[#F4F4F2] text-sm font-mono truncate">{file.file_name}</p>
            <p className="text-[#6B7280] text-xs font-mono">
              {formatFileSize(file.file_size)} · {new Date(file.created_at).toLocaleDateString(locale === 'ja' ? 'ja-JP' : 'en-US')}
            </p>
          </div>

          {/* Download */}
          <button
            onClick={() => handleDownload(file)}
            className="shrink-0 p-2 text-[#6B7280] hover:text-[#00E87A] transition-colors rounded hover:bg-[#00E87A]/10"
            aria-label={locale === 'ja' ? 'ダウンロード' : 'Download'}
          >
            <Download size={15} />
          </button>
        </div>
      ))}
    </div>
  );
}
