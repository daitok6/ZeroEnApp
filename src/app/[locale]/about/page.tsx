import Link from 'next/link';
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import { ScrollReveal } from '@/components/marketing/scroll-reveal';
import { GreenGlowLine } from '@/components/marketing/green-glow-line';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (locale === 'ja') {
    return buildMetadata({
      title: 'ZeroEnについて — 元日立・元楽天エンジニアが月¥5,000でLP制作を始めた理由',
      description: '元日立製作所・元楽天のWebエンジニア、大都がZeroEnを作った背景。「1ページのLPに数十万円」という相場への違和感から生まれたサービスです。',
      path: '/about',
      locale,
      ogTitle: 'ZeroEnについて',
      ogSubtitle: '元日立・元楽天エンジニアが作ったサービス',
    });
  }
  return buildMetadata({
    title: 'About ZeroEn — Why an Ex-Hitachi, Ex-Rakuten Engineer Charges ¥5,000/mo',
    description: 'The story behind ZeroEn. Ex-Hitachi, ex-Rakuten web engineer Daito built this after seeing solo operators quoted ¥200,000+ for a single landing page.',
    path: '/about',
    locale,
    ogTitle: 'About ZeroEn',
    ogSubtitle: 'Built by an ex-Hitachi, ex-Rakuten engineer',
  });
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  const ja = locale === 'ja';

  return (
    <div className="bg-[#0D0D0D] text-[#F4F4F2] min-h-screen pt-24">

      {/* ── Header ─────────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <ScrollReveal direction="up">
            <p className="text-[#00E87A] font-mono text-xs uppercase tracking-[0.2em] mb-4">
              {ja ? 'ZeroEnについて' : 'About ZeroEn'}
            </p>
            <h1 className="text-4xl sm:text-5xl font-heading font-bold text-[#F4F4F2] mb-6 leading-tight">
              {ja
                ? '1ページのLPに\n数十万円、という感覚。'
                : 'The ¥200,000\nquestion.'}
            </h1>
            <p className="text-[#9CA3AF] font-mono text-sm leading-relaxed">
              {ja
                ? 'Web制作会社でLP1枚の見積もりを取ると、初期20〜50万円という金額が返ってきます。理由はあります。複数スタッフ、仕様書、プロジェクト管理——大きな案件ならその金額は妥当です。でも、個人でコーチング・セラピーをされている方が「まず1枚、ちゃんとしたLPを持ちたい」と思ったとき、それは現実的じゃないかもしれない。'
                : 'Web agencies quote ¥200,000–¥500,000 for a single landing page. That makes sense at scale — multiple staff, spec documents, project management. But for a solo coach or therapist who just needs one good LP to exist, it often doesn\'t.'}
            </p>
          </ScrollReveal>
        </div>
      </section>

      <GreenGlowLine />

      {/* ── Founder story ──────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <ScrollReveal direction="up">
            <div className="flex items-start gap-6 mb-12">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-[#111827] border border-[#374151] flex items-center justify-center">
                <span className="text-[#00E87A] font-mono text-xs font-bold">大都</span>
              </div>
              <div>
                <p className="text-[#F4F4F2] font-mono font-bold text-sm mb-0.5">
                  {ja ? '大都 (Daito)' : 'Daito'}
                </p>
                <p className="text-[#6B7280] font-mono text-xs">
                  {ja ? 'ZeroEn 代表 / Webエンジニア' : 'Founder, ZeroEn / Web Engineer'}
                </p>
              </div>
            </div>

            <div className="space-y-6 font-mono text-sm text-[#9CA3AF] leading-relaxed">
              <p>
                {ja
                  ? '日立製作所でWebシステムの開発をしていました。その後、楽天でフロントエンド・バックエンドの開発を経験しました。企業の中で大規模なWebを作ってきた時間が長かったので、「LP1枚に数十万円」という相場の話を聞くたびに、どこか腑に落ちないものがありました。'
                  : 'I spent years building web systems at Hitachi, then large-scale services at Rakuten. Every time I heard someone quote ¥200,000+ for a single landing page, something didn\'t sit right.'}
              </p>
              <p>
                {ja
                  ? '大きな開発会社が動く案件なら、その金額は理解できます。でも、「まず1枚、ちゃんとしたLPが欲しい」と思っているコーチやセラピストにとっては、スタートのハードルが高すぎる。'
                  : 'For a large agency running a coordinated project, the number makes sense. But for a solo operator who just wants their first real landing page, it\'s too high a bar to clear.'}
              </p>
              <p>
                {ja
                  ? 'そこで2026年4月、ZeroEnを始めました。初期費用ゼロ。月¥5,000のホスティング費用の中に、制作・運用・毎月の改善をすべて含めます。月額モデルにしたのは、納品して終わりではなく、一緒にサイトを育てていきたいからです。'
                  : 'So in April 2026 I started ZeroEn. Zero upfront. ¥5,000/month covers building, hosting, and monthly improvements. The subscription model exists because I don\'t want to deliver and disappear — I want to grow the site alongside the business.'}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Credentials ────────────────────────────────────── */}
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
                  role: ja ? 'Next.js・React・TypeScript中心のWeb開発。LP制作・運用サービスを提供。' : 'Next.js, React, TypeScript web development. LP build & run service.',
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

      {/* ── Note article link ──────────────────────────────── */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <ScrollReveal direction="up">
            <div className="border-l-2 border-[#00E87A] pl-6 py-2">
              <p className="text-[#00E87A] font-mono text-xs uppercase tracking-widest mb-2">
                {ja ? 'Noteで詳しく書きました' : 'Full story on Note'}
              </p>
              <p className="text-[#9CA3AF] font-mono text-sm leading-relaxed mb-3">
                {ja
                  ? 'なぜ月¥5,000という金額にしたのか、制作費をこちら側で負担する仕組みの理由、最初のクライアントをどうやって探したか——Noteにまとめて書きました。'
                  : 'Why ¥5,000/month, how the upfront-free model works, how I found the first clients — written up in full on Note (Japanese).'}
              </p>
              <a
                href="https://note.com/zeroen_dev/n/n2d8f1bb2247a"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#00E87A] font-mono text-xs hover:underline"
              >
                {ja ? '記事を読む — note.com →' : 'Read on note.com (JP) →'}
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <GreenGlowLine />

      {/* ── CTA ────────────────────────────────────────────── */}
      <section className="py-24 px-4 text-center">
        <ScrollReveal direction="up">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[#F4F4F2] mb-4">
            {ja ? '一緒に作りましょう。' : 'Let\'s build something.'}
          </h2>
          <p className="text-[#6B7280] font-mono text-sm mb-8 max-w-md mx-auto">
            {ja
              ? '初期費用ゼロ。月¥5,000から。あなたのビジネスに合ったLPを3日で届けます。'
              : 'Zero upfront. From ¥5,000/month. Your LP delivered in 3 days.'}
          </p>
          <Link
            href={`/${locale}/login`}
            className="inline-block bg-[#00E87A] text-[#0D0D0D] font-heading font-bold uppercase tracking-widest text-sm px-10 py-4 rounded hover:bg-[#00ff88] active:scale-95 transition-all duration-150 shadow-[0_0_32px_rgba(0,232,122,0.5)]"
          >
            {ja ? '無料で申し込む' : 'Apply free'}
          </Link>
        </ScrollReveal>
      </section>
    </div>
  );
}
