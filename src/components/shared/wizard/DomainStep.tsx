'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { DomainData } from '@/types/managed-client-intake';
import { inputClass, labelClass, t } from './constants';
import { ErrorBanner } from './ErrorBanner';

interface Props {
  locale: string;
  domain: DomainData;
  setDomain: React.Dispatch<React.SetStateAction<DomainData>>;
  onNext: () => void;
  onBack: () => void;
  isSaving: boolean;
  error: string | null;
  submitLabel?: string;
}

export function DomainStep({
  locale, domain, setDomain,
  onNext, onBack, isSaving, error, submitLabel,
}: Props) {
  return (
    <section>
      <h2 className="font-heading text-2xl md:text-3xl text-[#F4F4F2] mb-4">
        {t(locale, 'Domain', 'ドメイン')}
      </h2>

      <div className="flex flex-col gap-2 mb-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="radio"
            name="domain-type"
            checked={domain.type === 'own'}
            onChange={() => setDomain({ type: 'own', value: '' })}
            className="accent-[#00E87A]"
          />
          <span className="text-[#F4F4F2] text-sm font-mono">
            {t(locale, 'I own a domain', 'ドメインを所有しています')}
          </span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="radio"
            name="domain-type"
            checked={domain.type === 'help'}
            onChange={() => setDomain({ type: 'help', value: '' })}
            className="accent-[#00E87A]"
          />
          <span className="text-[#F4F4F2] text-sm font-mono">
            {t(locale, 'Help me choose one', 'ドメイン選びを手伝ってほしい')}
          </span>
        </label>
      </div>

      {domain.type === 'own' ? (
        <div className="mb-6">
          <label className={labelClass}>{t(locale, 'Domain name', 'ドメイン名')}</label>
          <Input
            value={domain.value}
            onChange={(e) => setDomain({ type: 'own', value: e.target.value })}
            placeholder="example.com"
            className={inputClass}
          />
        </div>
      ) : (
        <div className="mb-6">
          <label className={labelClass}>
            {t(locale, 'What domain names are you considering?', 'どのようなドメイン名を検討していますか?')}
          </label>
          <Textarea
            value={domain.value}
            onChange={(e) => setDomain({ type: 'help', value: e.target.value })}
            className={inputClass}
            rows={4}
          />
        </div>
      )}

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
          {submitLabel ?? t(locale, 'Continue', '次へ')}
        </Button>
      </div>
    </section>
  );
}
