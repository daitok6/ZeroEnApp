'use client';

import { useState, useEffect, useCallback } from 'react';
import { step3Schema } from '@/lib/validations/onboarding';
import type { OnboardingFormData } from '@/lib/validations/onboarding';
import { CheckCircle, FileSignature, Loader2 } from 'lucide-react';

interface Props {
  data: Partial<OnboardingFormData>;
  onNext: (data: Pick<OnboardingFormData, 'entity_name' | 'envelope_id' | 'signing_completed'>) => void;
  onBack: () => void;
  locale: string;
  userEmail: string;
  userName: string;
}

type SigningStatus = 'idle' | 'loading' | 'signing' | 'completed' | 'error';

const inputClass = 'w-full bg-[#111827] border border-[#374151] text-[#F4F4F2] text-sm font-mono px-4 py-3 rounded focus:outline-none focus:border-[#00E87A] placeholder:text-[#6B7280]';
const labelClass = 'block text-[#F4F4F2] text-xs font-bold uppercase tracking-widest mb-2';

export function Step3Terms({ data, onNext, onBack, locale, userEmail, userName }: Props) {
  const isJa = locale === 'ja';
  const [entityName, setEntityName] = useState(data.entity_name ?? '');
  const [signingStatus, setSigningStatus] = useState<SigningStatus>(
    data.signing_completed ? 'completed' : 'idle'
  );
  const [envelopeId, setEnvelopeId] = useState<string>(data.envelope_id ?? '');
  const [error, setError] = useState('');

  // Listen for postMessage from the DocuSign callback window
  const handleMessage = useCallback((event: MessageEvent) => {
    if (event.origin !== window.location.origin) return;
    if (event.data?.type !== 'docusign-complete') return;

    if (event.data.event === 'signing_complete' && event.data.envelopeId) {
      setEnvelopeId(event.data.envelopeId);
      setSigningStatus('completed');
    } else {
      setSigningStatus('idle');
    }
  }, []);

  useEffect(() => {
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [handleMessage]);

  const handleSign = async () => {
    setSigningStatus('loading');
    setError('');

    const returnUrl = `${window.location.origin}/api/docusign/callback`;

    try {
      const res = await fetch('/api/docusign/create-envelope', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          signerName: userName || (isJa ? '署名者' : 'Signer'),
          signerEmail: userEmail,
          returnUrl,
        }),
      });

      if (!res.ok) throw new Error('Failed to create envelope');

      const { signingUrl } = await res.json();

      setSigningStatus('signing');
      const popup = window.open(signingUrl, 'docusign-signing', 'width=900,height=700,scrollbars=yes');

      // If popup was blocked, fall back to full redirect
      if (!popup) {
        window.location.href = signingUrl;
      }
    } catch {
      setSigningStatus('error');
      setError(isJa ? '署名に失敗しました。もう一度お試しください。' : 'Signing failed. Please try again.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = step3Schema.safeParse({
      entity_name: entityName || undefined,
      envelope_id: envelopeId,
      signing_completed: signingStatus === 'completed' ? true : undefined,
    });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? (isJa ? '契約書に署名する必要があります' : 'You must sign the agreement to continue'));
      return;
    }
    setError('');
    onNext({ entity_name: entityName || undefined, envelope_id: envelopeId, signing_completed: true });
  };

  const terms = isJa
    ? [
        { label: 'エクイティ', value: 'SAFE note経由で10%（法人化時に転換）' },
        { label: 'レベニューシェア', value: 'アプリ収益の約10%（柔軟に交渉可能）' },
        { label: 'プラットフォーム料金', value: 'ローンチ後 $50/月（ホスティング＋月1回の小修正）' },
        { label: 'MVPスコープ', value: 'キックオフ時に確定。変更は別途料金' },
        { label: 'IP所有権', value: '共有（エクイティ割合に比例）' },
        { label: 'キルスイッチ', value: '90日未払いで契約終了、コードの権利はオペレーターへ' },
      ]
    : [
        { label: 'Equity', value: '10% via SAFE note (converts on incorporation)' },
        { label: 'Revenue Share', value: '~10% of app revenue (flexible per deal)' },
        { label: 'Platform Fee', value: '$50/mo after launch (hosting + 1 fix/mo)' },
        { label: 'MVP Scope', value: 'Locked at kickoff. Changes are charged separately.' },
        { label: 'IP Ownership', value: 'Shared — proportional to equity stake' },
        { label: 'Kill Switch', value: '90 days unpaid → agreement terminates, code rights to operator' },
      ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold font-mono text-[#F4F4F2] mb-6">
        {isJa ? 'ビジネス・契約条件' : 'Business & Legal'}
      </h2>

      <div>
        <label className={labelClass}>
          {isJa ? '会社・プロジェクト名（任意）' : 'Company / Entity Name (optional)'}
        </label>
        <input
          type="text"
          value={entityName}
          onChange={(e) => setEntityName(e.target.value)}
          placeholder={isJa ? '株式会社〇〇 または個人名' : 'Your company name, or personal name'}
          className={inputClass}
        />
      </div>

      <div className="border border-[#374151] rounded p-5 space-y-3">
        <p className="text-[#9CA3AF] text-xs font-mono uppercase tracking-widest mb-4">
          {isJa ? 'パートナーシップの主要条件' : 'Key Partnership Terms'}
        </p>
        {terms.map((term) => (
          <div key={term.label} className="flex gap-3 text-sm font-mono">
            <span className="text-[#00E87A] shrink-0 w-32">{term.label}</span>
            <span className="text-[#F4F4F2]">{term.value}</span>
          </div>
        ))}
      </div>

      {/* Signing section */}
      <div className="border border-[#374151] rounded p-4 space-y-3">
        <p className="text-[#9CA3AF] text-xs font-mono uppercase tracking-widest">
          {isJa ? '電子署名' : 'E-Signature'}
        </p>

        {signingStatus === 'completed' ? (
          <div className="flex items-center gap-3">
            <CheckCircle size={20} className="text-[#00E87A] shrink-0" />
            <div>
              <p className="text-[#F4F4F2] text-sm font-mono font-bold">
                {isJa ? '契約署名済み' : 'Agreement Signed'}
              </p>
              <p className="text-[#6B7280] text-xs font-mono mt-0.5">
                {isJa ? '次のステップに進んでください。' : 'You may proceed to the next step.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-[#F4F4F2] text-sm font-mono leading-relaxed">
              {isJa
                ? '上記の条件を読んで同意するには、契約書に電子署名してください。署名はDocuSignで安全に処理されます。'
                : 'To accept the above terms, please sign the partnership agreement electronically. Signing is handled securely via DocuSign.'}
            </p>

            <button
              type="button"
              onClick={handleSign}
              disabled={signingStatus === 'loading' || signingStatus === 'signing'}
              className="flex items-center gap-2 bg-[#00E87A] text-[#0D0D0D] font-bold font-mono px-6 py-3 rounded hover:bg-[#00d070] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {signingStatus === 'loading' ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  {isJa ? '署名を準備中...' : 'Preparing...'}
                </>
              ) : signingStatus === 'signing' ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  {isJa ? '署名ウィンドウを確認してください' : 'Complete signing in popup...'}
                </>
              ) : (
                <>
                  <FileSignature size={16} />
                  {isJa ? '契約に署名する' : 'Sign Agreement'}
                </>
              )}
            </button>

            {signingStatus === 'signing' && (
              <p className="text-[#6B7280] text-xs font-mono">
                {isJa
                  ? 'ポップアップウィンドウで署名を完了してください。ブロックされた場合は、ポップアップを許可してください。'
                  : 'Complete signing in the popup window. If blocked, allow popups for this site.'}
              </p>
            )}
          </div>
        )}

        {error && <p className="text-red-400 text-xs font-mono mt-2">{error}</p>}
      </div>

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="text-[#9CA3AF] font-mono text-sm px-6 py-3 rounded border border-[#374151] hover:border-[#6B7280] transition-colors"
        >
          ← {isJa ? '戻る' : 'Back'}
        </button>
        <button
          type="submit"
          disabled={signingStatus !== 'completed'}
          className="bg-[#00E87A] text-[#0D0D0D] font-bold font-mono px-8 py-3 rounded hover:bg-[#00d070] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isJa ? '次へ →' : 'Next →'}
        </button>
      </div>
    </form>
  );
}
