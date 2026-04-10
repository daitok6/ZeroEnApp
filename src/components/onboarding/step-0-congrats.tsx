'use client';

interface Props {
  onNext: () => void;
  locale: string;
}

export function Step0Congrats({ onNext, locale }: Props) {
  const isJa = locale === 'ja';

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
        "We grow together when you succeed",
      ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="max-w-lg w-full space-y-8">
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
              : 'Your application has been approved. Welcome to ZeroEn — let\'s build something great together.'}
          </p>
        </div>

        {/* Highlights */}
        <ul className="space-y-3 text-left">
          {highlights.map((point, i) => (
            <li key={i} className="flex items-start gap-3 text-sm font-mono text-[#F4F4F2]">
              <span className="text-[#00E87A] mt-0.5 shrink-0">✓</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="pt-2">
          <button
            onClick={onNext}
            className="w-full bg-[#00E87A] text-[#0D0D0D] font-bold font-mono px-8 py-4 rounded hover:bg-[#00d070] transition-colors text-base"
          >
            {isJa ? 'プロジェクトをセットアップする →' : 'Set up your project →'}
          </button>
          <p className="text-[#6B7280] text-xs font-mono mt-3">
            {isJa ? '所要時間：約3分' : 'Takes about 3 minutes'}
          </p>
        </div>
      </div>
    </div>
  );
}
