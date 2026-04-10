'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Props {
  locale: string;
}

export function CongratsModal({ locale }: Props) {
  const router = useRouter();
  const isJa = locale === 'ja';
  const [leaving, setLeaving] = useState(false);

  const highlights = isJa
    ? [
        'MVPを無料で構築します',
        'Vercelにデプロイして本番環境を用意します',
        '月次のアナリティクスレポートをお届けします',
        '成功した時に一緒に成長します',
      ]
    : [
        'We build your MVP for free',
        'Deploy to production on Vercel',
        'Monthly analytics reports delivered to you',
        'We grow together when you succeed',
      ];

  const handleStart = () => {
    setLeaving(true);
    router.push(`/${locale}/dashboard/onboarding`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0D0D0D]/95 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="max-w-lg w-full space-y-8 text-center">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-[#00E87A]/10 border border-[#00E87A]/30 flex items-center justify-center">
            <span className="text-4xl">🎉</span>
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-3">
          <h1 className="text-3xl font-bold font-mono text-[#F4F4F2]">
            {isJa ? '採択されました！' : "You're in!"}
          </h1>
          <p className="text-[#9CA3AF] text-sm font-mono leading-relaxed">
            {isJa
              ? 'あなたのアプリケーションが承認されました。ZeroEnへようこそ。一緒にプロダクトを作りましょう。'
              : "Your application has been approved. Welcome to ZeroEn — let's build something great together."}
          </p>
        </div>

        {/* Highlights */}
        <ul className="space-y-3 text-left max-w-sm mx-auto">
          {highlights.map((point, i) => (
            <li key={i} className="flex items-start gap-3 text-sm font-mono text-[#F4F4F2]">
              <span className="text-[#00E87A] mt-0.5 shrink-0">✓</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="pt-2 space-y-3">
          <button
            onClick={handleStart}
            disabled={leaving}
            className="w-full bg-[#00E87A] text-[#0D0D0D] font-bold font-mono px-8 py-4 rounded hover:bg-[#00d070] transition-colors text-base disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {leaving
              ? (isJa ? '準備中...' : 'Loading...')
              : (isJa ? 'プロジェクトをセットアップする →' : 'Set up your project →')}
          </button>
          <p className="text-[#6B7280] text-xs font-mono">
            {isJa ? '所要時間：約3分' : 'Takes about 3 minutes'}
          </p>
        </div>
      </div>
    </div>
  );
}
