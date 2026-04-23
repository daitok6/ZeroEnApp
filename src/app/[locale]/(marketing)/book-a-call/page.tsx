import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import { ScrollReveal } from '@/components/marketing/scroll-reveal';
import { GreenGlowLine } from '@/components/marketing/green-glow-line';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (locale === 'ja') {
    return buildMetadata({
      title: 'スコーピングコールを予約 — ZeroEn',
      description: '30分のスコーピングコール。固定価格の提案書を48時間以内にお送りします。東京のバイリンガルSaaSビルダー。',
      path: '/book-a-call',
      locale,
      ogTitle: 'スコーピングコールを予約',
      ogSubtitle: '30分。提案書は48時間以内に。',
    });
  }
  return buildMetadata({
    title: 'Book a Scoping Call — ZeroEn',
    description: '30-minute scoping call. Fixed-price proposal within 48 hours. Bilingual SaaS studio in Tokyo.',
    path: '/book-a-call',
    locale,
    ogTitle: 'Book a Scoping Call',
    ogSubtitle: '30 minutes. Proposal within 48 hours.',
  });
}

export default async function BookACallPage({ params }: Props) {
  const { locale } = await params;
  const ja = locale === 'ja';
  const scopingCallHref = locale === 'ja' ? '/ja/scoping-call' : '/scoping-call';

  return (
    <div className="bg-[#0D0D0D] text-[#F4F4F2] min-h-screen pt-24">
      <section className="py-20 px-4">
        <div className="max-w-xl mx-auto">
          <ScrollReveal direction="up">
            <p className="text-[#00E87A] font-mono text-xs uppercase tracking-[0.2em] mb-4">
              {ja ? 'スコーピングコール' : 'Scoping call'}
            </p>
            <h1 className="text-4xl sm:text-5xl font-heading font-bold text-[#F4F4F2] mb-6">
              {ja ? 'プロジェクトの\nスコープを確認しましょう。' : "Let's scope\nyour project."}
            </h1>
            <p className="text-[#9CA3AF] font-mono text-sm leading-relaxed mb-10">
              {ja
                ? '30分のコール。コール後48時間以内に固定価格の提案書を送付します。コミットメントは不要です。'
                : '30-minute call. Fixed-price proposal within 48 hours. No commitment required.'}
            </p>
          </ScrollReveal>

          <GreenGlowLine className="mb-12" />

          <ScrollReveal direction="up" delay={0.1}>
            <div className="space-y-6 mb-10">
              {[
                {
                  label: ja ? '何が起こるか' : 'What happens',
                  items: ja
                    ? [
                        'プロジェクトの詳細と要件をお聞きします',
                        'ICP適合を確認します（現在対応できないプロジェクトは正直にお伝えします）',
                        '48時間以内に固定価格の提案書を送付します',
                      ]
                    : [
                        'We discuss your project details and requirements',
                        'We confirm ICP fit (we\'ll be honest if we\'re not the right fit)',
                        'Fixed-price proposal sent within 48 hours',
                      ],
                },
              ].map((block) => (
                <div key={block.label}>
                  <p className="text-[#6B7280] font-mono text-xs uppercase tracking-widest mb-3">
                    {block.label}
                  </p>
                  <ul className="space-y-2">
                    {block.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 font-mono text-sm text-[#9CA3AF]">
                        <span className="text-[#00E87A] flex-shrink-0 mt-0.5">→</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <a
              href={scopingCallHref}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center bg-[#00E87A] text-[#0D0D0D] font-heading font-bold uppercase tracking-widest text-sm px-8 py-4 rounded hover:bg-[#00ff88] active:scale-95 transition-all duration-150 shadow-[0_0_32px_rgba(0,232,122,0.5)] hover:shadow-[0_0_48px_rgba(0,232,122,0.7)]"
            >
              {ja ? 'スコーピングコールを予約する' : 'Book a scoping call →'}
            </a>
            <p className="text-[#374151] font-mono text-xs mt-4 text-center">
              {ja ? 'コミットメントは不要です。' : 'No commitment required.'}
            </p>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
