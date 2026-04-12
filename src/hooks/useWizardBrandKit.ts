'use client';

import { useState } from 'react';
import type { BrandKit } from '@/types/managed-client-intake';
import { PRESET_PALETTES } from '@/components/shared/wizard/constants';

const DEFAULT_BRAND_KIT: BrandKit = {
  tone: { playful: 50, minimal: 50, corporate: 50 },
  vibe_tags: [],
  palette: { preset: null, colors: { bg: '#0D0D0D', accent: '#00E87A', text: '#F4F4F2' } },
  font_pairing: 'modern-mono',
  sample_sites: [],
};

export function useWizardBrandKit(initial: BrandKit | null) {
  const [brandKit, setBrandKit] = useState<BrandKit>(initial ?? DEFAULT_BRAND_KIT);
  const [sampleSiteInput, setSampleSiteInput] = useState('');

  function toggleVibeTag(tag: string) {
    setBrandKit((prev) => ({
      ...prev,
      vibe_tags: prev.vibe_tags.includes(tag)
        ? prev.vibe_tags.filter((x) => x !== tag)
        : [...prev.vibe_tags, tag],
    }));
  }

  function selectPreset(preset: typeof PRESET_PALETTES[number]) {
    setBrandKit((prev) => ({
      ...prev,
      palette: { preset: preset.id, colors: { bg: preset.bg, accent: preset.accent, text: preset.text } },
    }));
  }

  function updateCustomColor(key: 'bg' | 'accent' | 'text', value: string) {
    setBrandKit((prev) => ({
      ...prev,
      palette: { preset: 'custom', colors: { ...prev.palette.colors, [key]: value } },
    }));
  }

  function addSampleSite() {
    const v = sampleSiteInput.trim();
    if (!v || brandKit.sample_sites.includes(v)) return;
    setBrandKit((prev) => ({ ...prev, sample_sites: [...prev.sample_sites, v] }));
    setSampleSiteInput('');
  }

  function removeSampleSite(site: string) {
    setBrandKit((prev) => ({ ...prev, sample_sites: prev.sample_sites.filter((s) => s !== site) }));
  }

  return {
    brandKit,
    setBrandKit,
    sampleSiteInput,
    setSampleSiteInput,
    toggleVibeTag,
    selectPreset,
    updateCustomColor,
    addSampleSite,
    removeSampleSite,
  };
}
