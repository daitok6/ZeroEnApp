import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import { ScrollReveal } from '@/components/marketing/scroll-reveal';
import { GreenGlowLine } from '@/components/marketing/green-glow-line';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (locale === 'ja') {
    return buildMetadata({
      title: 'ZeroEnについて — バイリンガルSaaSスタジオ',
      description: '東京を拠点とするバイリンガルプロダクトスタジオ。資金調達済みのスタートアップと真剣なビジネス向けに、固定価格でプロダクショングレードのバイリンガルWebプロダクトを制作。',
      path: '/about',
      locale,
      ogTitle: 'ZeroEnについて',
      ogSubtitle: 'バイリンガルSaaSスタジオ、東京',
    });
  }
  return buildMetadata({
    title: 'About ZeroEn — Bilingual SaaS Studio, Tokyo',
    description: 'ZeroEn is a bilingual product studio building production-grade EN/JA web products for funded founders and serious businesses in Tokyo. Fixed price, no equity.',
    path: '/about',
    locale,
    ogTitle: 'About ZeroEn',
    ogSubtitle: 'Bilingual SaaS studio, Tokyo',
  });
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  const ja = locale === 'ja';
  const scopingCallHref = locale === 'ja' ? '/ja/scoping-call' : '/scoping-call';

  return (
    <div className="bg-[#0D0D0D] text-[#F4F4F2] min-h-screen pt-24">

      {/* Header */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <ScrollReveal direction="up">
            <p className="text-[#00E87A] font-mono text-xs uppercase tracking-[0.2em] mb-4">
              {ja ? 'ZeroEnについて' : 'About ZeroEn'}
            </p>
            <h1 className="text-4xl sm:text-5xl font-heading font-bold text-[#F4F4F2] mb-6 leading-tight whitespace-pre-line">
              {ja
                ? '日系エージェンシーは\n800万円と4ヶ月と言う。'
                : 'Japanese agencies\nquote ¥8M and 4 months.'}
            </h1>
            <p className="text-[#9CA3AF] font-mono text-sm leading-relaxed">
              {ja
                ? 'それには理由があります。複数のスタッフ、仕様書、プロジェクト管理——大きな案件なら妥当な金額です。でも、今週資金調達を完了したファウンダーがバイリンガルのプロダクトを数週間で必要としているとき、その答えは現実的ではありません。'
                : "There's a reason. Multiple staff, spec documents, project management — for a large coordinated project the number makes sense. But for a founder who just closed a round and needs a bilingual product live in weeks, it's the wrong answer."}
            </p>
          </ScrollReveal>
        </div>
      </section>

      <GreenGlowLine />

      {/* Founder story */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <ScrollReveal direction="up">
            <div className="flex items-start gap-6 mb-10">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-[#111827] border border-[#00E87A]/30 flex items-center justify-center shadow-[0_0_16px_rgba(0,232,122,0.15)]">
                <span className="text-[#00E87A] font-mono text-sm font-bold">大都</span>
              </div>
              <div>
                <p className="text-[#F4F4F2] font-mono font-bold text-sm mb-0.5">
                  {ja ? '大都 (Daito)' : 'Daito'}
                </p>
                <p className="text-[#6B7280] font-mono text-xs mb-3">
                  {ja ? 'ZeroEn 代表 / Webエンジニア' : 'Founder, ZeroEn / Web Engineer'}
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[#374151] font-mono text-[10px] uppercase tracking-widest">
                    {ja ? '過去の所属' : 'Previously'}
                  </span>
                  <span className="border border-[#374151] text-[#6B7280] font-mono text-[10px] px-2 py-0.5 rounded">
                    {ja ? '日立製作所' : 'Hitachi'}
                  </span>
                  <span className="border border-[#374151] text-[#6B7280] font-mono text-[10px] px-2 py-0.5 rounded">
                    {ja ? '楽天グループ' : 'Rakuten'}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-6 font-mono text-sm text-[#9CA3AF] leading-relaxed">
              <p>
                {ja
                  ? '日立製作所でWebシステムの開発をしていました。その後、楽天でフロントエンド・バックエンドの開発を経験しました。企業の中で大規模なWebを作ってきた時間が長かったので、バイリンガルのプロダクトを求める人が直面する壁は、技術的な問題ではなく、構造的な問題だとわかります。'
                  : 'I spent years building web systems at Hitachi, then large-scale services at Rakuten. After that time inside large organizations, I know that the barrier people face when they need a bilingual product is not a technical problem — it\'s a structural one.'}
              </p>
              <p>
                {ja
                  ? '大きな開発会社は大きな案件のために作られています。東京で資金調達を完了したばかりのファウンダーや、日本市場に参入しようとしている外資系企業には、別の解決策が必要です——技術的に本格的で、バイリンガルが最初から組み込まれていて、数週間で納品できるもの。'
                  : "Large agencies are built for large projects. Funded founders in Tokyo and foreign companies entering the Japan market need something different — technically solid, bilingual from day one, shipped in weeks, not months."}
              </p>
              <p>
                {ja
                  ? '2026年4月、ZeroEnを始めました。プロダクショングレードのバイリンガルNext.js + Supabase + Stripeプロダクトを固定価格で。エクイティ不要、レベニューシェア不要。制作してすぐ終わりではなく、本番環境に対応したプロダクトを納品します。'
                  : 'In April 2026 I started ZeroEn. Production-grade bilingual Next.js + Supabase + Stripe products at fixed price. No equity, no revenue share. Not a build-and-abandon — a production-ready product delivered and owned by you.'}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Credentials */}
      <section className="py-16 px-4 bg-[#080808]">
        <div className="max-w-2xl mx-auto">
          <ScrollReveal direction="up">
            <p className="text-[#00E87A] font-mono text-xs uppercase tracking-[0.2em] mb-8">
              {ja ? '経歴' : 'Background'}
            </p>
            <div className="space-y-6">
              {[
                {
                  org: ja ? '日立製作所' : 'Hitachi, Ltd.',
                  role: ja ? '社内システム・Webアプリケーション開発' : 'Enterprise systems & web application development',
                },
                {
                  org: ja ? '楽天グループ' : 'Rakuten Group',
                  role: ja ? '大規模Webサービス フロントエンド・バックエンド開発' : 'Large-scale web service frontend & backend development',
                },
                {
                  org: ja ? '独立後 / ZeroEn' : 'Independent / ZeroEn',
                  role: ja
                    ? 'Next.js・Supabase・Stripeによるバイリンガルプロダクション開発。東京の資金調達済みスタートアップと真剣なビジネス向け。'
                    : 'Bilingual production builds — Next.js + Supabase + Stripe. For funded founders and serious businesses in Tokyo.',
                },
              ].map((c) => (
                <div key={c.org} className="flex gap-4">
                  <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#00E87A] mt-2" />
                  <div>
                    <p className="text-[#F4F4F2] font-mono text-sm font-bold">{c.org}</p>
                    <p className="text-[#6B7280] font-mono text-xs mt-0.5">{c.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <GreenGlowLine />

      {/* CTA */}
      <section className="py-24 px-4 text-center">
        <ScrollReveal direction="up">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[#F4F4F2] mb-4">
            {ja ? '一緒に作りましょう。' : "Let's build something."}
          </h2>
          <p className="text-[#6B7280] font-mono text-sm mb-8 max-w-md mx-auto">
            {ja
              ? '固定価格。エクイティ不要。数週間で納品。30分のスコーピングコールから始めます。'
              : 'Fixed price. No equity. Shipped in weeks. Starts with a 30-minute scoping call.'}
          </p>
          <a
            href={scopingCallHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#00E87A] text-[#0D0D0D] font-heading font-bold uppercase tracking-widest text-sm px-10 py-4 rounded hover:bg-[#00ff88] active:scale-95 transition-all duration-150 shadow-[0_0_32px_rgba(0,232,122,0.5)]"
          >
            {ja ? 'スコーピングコールを予約' : 'Book a scoping call'}
          </a>
        </ScrollReveal>
      </section>
    </div>
  );
}
