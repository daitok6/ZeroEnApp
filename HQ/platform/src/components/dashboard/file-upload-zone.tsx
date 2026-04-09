'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import { formatFileSize } from '@/lib/file-icons';

interface FileUploadZoneProps {
  onUploadComplete: (file: { id: string; file_name: string; file_size: number; mime_type: string; storage_path: string; created_at: string; project_id: string; uploaded_by: string }) => void;
  locale: string;
}

interface UploadingFile {
  name: string;
  size: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
}

export function FileUploadZone({ onUploadComplete, locale }: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState<UploadingFile[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(async (file: File) => {
    const item: UploadingFile = { name: file.name, size: file.size, status: 'uploading' };
    setUploading((prev) => [...prev, item]);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/files/upload', { method: 'POST', body: formData });
      const json = await res.json();

      if (res.ok && json.file) {
        setUploading((prev) =>
          prev.map((u) => u.name === file.name ? { ...u, status: 'success' } : u)
        );
        onUploadComplete(json.file);
        // Remove success indicator after 3s
        setTimeout(() => {
          setUploading((prev) => prev.filter((u) => u.name !== file.name));
        }, 3000);
      } else {
        setUploading((prev) =>
          prev.map((u) => u.name === file.name ? { ...u, status: 'error', error: json.error } : u)
        );
      }
    } catch {
      setUploading((prev) =>
        prev.map((u) => u.name === file.name ? { ...u, status: 'error', error: 'Upload failed' } : u)
      );
    }
  }, [onUploadComplete]);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach(uploadFile);
  }, [uploadFile]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragging(false), []);

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-lg p-8 md:p-12 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-[#00E87A] bg-[#00E87A]/5'
            : 'border-[#374151] hover:border-[#00E87A]/50 hover:bg-[#111827]/50'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <Upload
          size={28}
          className={`mx-auto mb-3 transition-colors ${isDragging ? 'text-[#00E87A]' : 'text-[#6B7280]'}`}
        />
        <p className="text-[#F4F4F2] font-mono text-sm font-bold mb-1">
          {locale === 'ja' ? 'ファイルをドロップ、またはクリックして選択' : 'Drop files or click to select'}
        </p>
        <p className="text-[#6B7280] font-mono text-xs">
          {locale === 'ja' ? '最大50MBまで' : 'Up to 50MB per file'}
        </p>
      </div>

      {/* Upload status items */}
      {uploading.map((file) => (
        <div
          key={file.name}
          className={`flex items-center gap-3 p-3 rounded-lg border ${
            file.status === 'error'
              ? 'border-red-400/30 bg-red-400/5'
              : file.status === 'success'
              ? 'border-[#00E87A]/30 bg-[#00E87A]/5'
              : 'border-[#374151] bg-[#111827]'
          }`}
        >
          {file.status === 'uploading' && (
            <div className="w-4 h-4 border-2 border-[#00E87A] border-t-transparent rounded-full animate-spin shrink-0" />
          )}
          {file.status === 'success' && <CheckCircle size={16} className="text-[#00E87A] shrink-0" />}
          {file.status === 'error' && <AlertCircle size={16} className="text-red-400 shrink-0" />}

          <div className="flex-1 min-w-0">
            <p className="text-[#F4F4F2] text-xs font-mono truncate">{file.name}</p>
            {file.status === 'error' && (
              <p className="text-red-400 text-xs font-mono">{file.error}</p>
            )}
            {file.status === 'uploading' && (
              <p className="text-[#6B7280] text-xs font-mono">{formatFileSize(file.size)}</p>
            )}
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); setUploading((prev) => prev.filter((u) => u.name !== file.name)); }}
            className="text-[#6B7280] hover:text-[#F4F4F2] shrink-0"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
