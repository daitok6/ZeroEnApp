'use client';

import { useState } from 'react';
import { t } from '@/components/shared/wizard/constants';

export function useWizardSave(locale: string) {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function savePatch(patch: Record<string, unknown>): Promise<boolean> {
    setIsSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/coconala-onboarding/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        setError(json.error || t(locale, 'Failed to save', '保存に失敗しました'));
        return false;
      }
      return true;
    } catch {
      setError(t(locale, 'Network error', 'ネットワークエラー'));
      return false;
    } finally {
      setIsSaving(false);
    }
  }

  return { isSaving, error, setError, savePatch };
}
