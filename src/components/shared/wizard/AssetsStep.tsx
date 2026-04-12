'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { AssetsData } from '@/types/managed-client-intake';
import { inputClass, labelClass, t } from './constants';
import { ErrorBanner } from './ErrorBanner';

interface Props {
  locale: string;
  assets: AssetsData;
  setAssets: React.Dispatch<React.SetStateAction<AssetsData>>;
  uploadingLogo: boolean;
  uploadingExtra: boolean;
  onLogoUpload: (file: File) => void;
  onExtraImagesUpload: (files: FileList) => void;
  onNext: () => void;
  onBack: () => void;
  isSaving: boolean;
  error: string | null;
}

export function AssetsStep({
  locale, assets, setAssets,
  uploadingLogo, uploadingExtra,
  onLogoUpload, onExtraImagesUpload,
  onNext, onBack, isSaving, error,
}: Props) {
  return (
    <section>
      <h2 className="font-heading text-2xl md:text-3xl text-[#F4F4F2] mb-4">
        {t(locale, 'Assets', 'アセット')}
      </h2>

      <div className="mb-6">
        <label className={labelClass}>{t(locale, 'Logo', 'ロゴ')}</label>
        {assets.logo_url && (
          <div className="mb-2">
            <Image
              src={assets.logo_url}
              alt="logo"
              width={200}
              height={96}
              className="max-h-24 w-auto rounded border border-[#374151]"
            />
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files?.[0] && onLogoUpload(e.target.files[0])}
          className="text-[#F4F4F2] text-xs font-mono"
          disabled={uploadingLogo}
        />
        {uploadingLogo && (
          <p className="text-[#6B7280] text-xs font-mono mt-1">
            {t(locale, 'Uploading...', 'アップロード中...')}
          </p>
        )}
      </div>

      <div className="mb-6">
        <label className={labelClass}>{t(locale, 'Brand Description', 'ブランド説明')}</label>
        <Textarea
          value={assets.copy}
          onChange={(e) => setAssets((prev) => ({ ...prev, copy: e.target.value }))}
          placeholder={t(locale, 'Describe your brand in 2-3 sentences', 'あなたのブランドを2〜3文で説明してください')}
          className={inputClass}
          rows={4}
        />
      </div>

      <div className="mb-6">
        <label className={labelClass}>{t(locale, 'Tagline (optional)', 'タグライン(任意)')}</label>
        <Input
          value={assets.tagline ?? ''}
          onChange={(e) => setAssets((prev) => ({ ...prev, tagline: e.target.value || null }))}
          className={inputClass}
        />
      </div>

      <div className="mb-6">
        <label className={labelClass}>{t(locale, 'Extra Images (up to 3)', '追加画像(最大3枚)')}</label>
        {assets.extra_image_urls.length > 0 && (
          <div className="flex gap-2 mb-2 flex-wrap">
            {assets.extra_image_urls.map((url) => (
              <Image
                key={url}
                src={url}
                alt=""
                width={80}
                height={80}
                className="max-h-20 w-auto rounded border border-[#374151]"
              />
            ))}
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => e.target.files && onExtraImagesUpload(e.target.files)}
          className="text-[#F4F4F2] text-xs font-mono"
          disabled={uploadingExtra || assets.extra_image_urls.length >= 3}
        />
        {uploadingExtra && (
          <p className="text-[#6B7280] text-xs font-mono mt-1">
            {t(locale, 'Uploading...', 'アップロード中...')}
          </p>
        )}
      </div>

      <ErrorBanner error={error} />
      <div className="flex gap-2">
        <Button
          onClick={onBack}
          variant="outline"
          className="bg-transparent border-[#374151] text-[#F4F4F2] font-mono"
        >
          {t(locale, 'Back', '戻る')}
        </Button>
        <Button
          onClick={onNext}
          disabled={isSaving}
          className="bg-[#00E87A] text-[#0D0D0D] hover:bg-[#00E87A]/90 font-mono"
        >
          {t(locale, 'Continue', '次へ')}
        </Button>
      </div>
    </section>
  );
}
