'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { AssetsData } from '@/types/managed-client-intake';

const DEFAULT_ASSETS: AssetsData = { logo_url: null, copy: '', tagline: null, extra_image_urls: [] };

export function useWizardAssets(profileId: string, initial: AssetsData | null) {
  const supabase = createClient();
  const [assets, setAssets] = useState<AssetsData>(initial ?? DEFAULT_ASSETS);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingExtra, setUploadingExtra] = useState(false);

  async function uploadFile(file: File, filename: string): Promise<string | null> {
    const path = `${profileId}/${filename}`;
    const { error } = await supabase.storage
      .from('client-assets')
      .upload(path, file, { upsert: true });
    if (error) return null;
    const { data } = supabase.storage.from('client-assets').getPublicUrl(path);
    return data.publicUrl;
  }

  async function handleLogoUpload(file: File) {
    setUploadingLogo(true);
    const ext = file.name.split('.').pop() || 'png';
    const url = await uploadFile(file, `logo.${ext}`);
    if (url) setAssets((prev) => ({ ...prev, logo_url: url }));
    setUploadingLogo(false);
  }

  async function handleExtraImagesUpload(files: FileList) {
    setUploadingExtra(true);
    const urls: string[] = [];
    for (let i = 0; i < Math.min(files.length, 3); i++) {
      const f = files[i];
      const ext = f.name.split('.').pop() || 'png';
      const url = await uploadFile(f, `extra-${Date.now()}-${i}.${ext}`);
      if (url) urls.push(url);
    }
    setAssets((prev) => ({
      ...prev,
      extra_image_urls: [...prev.extra_image_urls, ...urls].slice(0, 3),
    }));
    setUploadingExtra(false);
  }

  return { assets, setAssets, uploadingLogo, uploadingExtra, handleLogoUpload, handleExtraImagesUpload };
}
