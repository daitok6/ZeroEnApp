import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo/metadata';
import { GreenGlowLine } from '@/components/marketing/green-glow-line';
import { ScrollReveal } from '@/components/marketing/scroll-reveal';
import { ScreenshotImage } from '@/components/marketing/screenshot-image';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (locale === 'ja') {
    return buildMetadata({
      title: '制作実績 — ZeroEn',
      description: 'ZeroEnが制作したバイリンガルWebプロダクトの事例。東京の資金調達済みスタートアップと真剣なビジネス向け。',
      path: '/cases',
      locale,
      ogTitle: 'ZeroEn 制作実績',
      ogSubtitle: 'バイリンガルSaaS、確実に納品。',
    });
  }
  return buildMetadata({
    title: 'Case Studies — ZeroEn',
    description: 'Bilingual web products built by ZeroEn for funded founders and serious businesses in Tokyo.',
    path: '/cases',
    locale,
    ogTitle: 'ZeroEn Case Studies',
    ogSubtitle: 'Production-grade bilingual products.',
  });
}

export default async function CasesPage({ params }: Props) {
  const { locale } = await params;
  const ja = locale === 'ja';
  const scopingCallHref = locale === 'ja' ? '/ja/scoping-call' : '/scoping-call';

  return (
    <div className="bg-[#0D0D0D] text-[#F4F4F2] min-h-screen pt-24">

      {/* Header */}
      <section className="py-20 px-4 text-center">
        <ScrollReveal direction="up">
          <p className="text-[#00E87A] font-mono text-xs uppercase tracking-[0.2em] mb-4">
            {ja ? '制作実績' : 'Case Studies'}
          </p>
          <h1 className="text-4xl sm:text-5xl font-heading font-bold text-[#F4F4F2] mb-6">
            {ja ? '稼働中のプロダクト。実際のアーキテクチャ判断。' : 'Live products. Real architecture decisions.'}
          </h1>
          <p className="text-[#6B7280] font-mono text-sm max-w-xl mx-auto">
            {ja
              ? 'クライアントと同じ基準で、自分たちのために作っています。どちらも本番稼働中。'
              : 'We build for ourselves at the same standard we build for clients. Both run in production.'}
          </p>
        </ScrollReveal>
        <GreenGlowLine className="mt-16" />
      </section>

      {/* ── Case study: ZeroEn ──────────────────────────────── */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal direction="up">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-2xl font-heading font-bold text-[#F4F4F2]">ZeroEn</h2>
              <span className="text-[#0D0D0D] bg-[#00E87A] font-mono text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">
                {ja ? '稼働中' : 'Live'}
              </span>
            </div>
            <p className="text-[#6B7280] font-mono text-sm mb-3">zeroen.dev</p>
            <div className="flex flex-wrap gap-2 mb-8">
              {['Next.js + Supabase + Stripe', 'EN/JA routing', 'Multi-tenant', '30+ API routes'].map((tag) => (
                <span key={tag} className="border border-[#374151] text-[#6B7280] font-mono text-[10px] px-2 py-0.5 rounded">
                  {tag}
                </span>
              ))}
            </div>

            <div className="w-full aspect-video bg-[#111827] border border-[#374151] rounded-lg overflow-hidden mb-8">
              <ScreenshotImage src="/images/cases/zeroen-home.webp" alt="zeroen.dev homepage" />
            </div>

            {/* TODO-CASE-STUDY-BODY: ZeroEn — write full prose in a separate session */}
            <div className="bg-[#111827] border border-[#374151] rounded-lg p-6 font-mono text-sm text-[#6B7280]">
              <p className="text-[#00E87A] font-mono text-xs uppercase tracking-widest mb-4">
                {ja ? 'TODO-CASE-STUDY-BODY' : 'TODO-CASE-STUDY-BODY'}
              </p>
              <ul className="space-y-2 list-none">
                <li>→ Problem: Building a bilingual SaaS platform to run a productized service — solo operator</li>
                <li>→ Architecture decisions: next-intl locale routing, Supabase RLS per-client isolation, Stripe milestone billing</li>
                <li>→ Technical details: 30+ API routes, 5 cron jobs, multi-tenant dashboard, admin panel</li>
                <li>→ What would change at scale: shared Supabase schema with proper RLS vs. per-project isolation</li>
              </ul>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <GreenGlowLine />

      {/* ── Case study: WebMori ──────────────────────────────── */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal direction="up">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-2xl font-heading font-bold text-[#F4F4F2]">WebMori</h2>
              <span className="text-[#0D0D0D] bg-[#00E87A] font-mono text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">
                {ja ? '稼働中' : 'Live'}
              </span>
            </div>
            <p className="text-[#6B7280] font-mono text-sm mb-3">webmori.jp</p>
            <div className="flex flex-wrap gap-2 mb-8">
              {[ja ? '3日でリリース' : 'Launched in 3 days', ja ? '毎月の診断' : 'Monthly audits', 'Tokyo', 'Next.js'].map((tag) => (
                <span key={tag} className="border border-[#374151] text-[#6B7280] font-mono text-[10px] px-2 py-0.5 rounded">
                  {tag}
                </span>
              ))}
            </div>

            <div className="w-full aspect-video bg-[#111827] border border-[#374151] rounded-lg overflow-hidden mb-8">
              <ScreenshotImage src="/images/cases/webmori-home.webp" alt="webmori.jp homepage" />
            </div>

            {/* TODO-CASE-STUDY-BODY: WebMori — write full prose in a separate session */}
            <div className="bg-[#111827] border border-[#374151] rounded-lg p-6 font-mono text-sm text-[#6B7280]">
              <p className="text-[#00E87A] font-mono text-xs uppercase tracking-widest mb-4">
                TODO-CASE-STUDY-BODY
              </p>
              <ul className="space-y-2 list-none">
                <li>→ Problem: Security & SEO audit service needed a live site fast before outreach</li>
                <li>→ Architecture decisions: static-first Next.js, Resend for audit delivery, no auth needed at launch</li>
                <li>→ Technical details: MDX blog, automated monthly audit PDF generation</li>
                <li>→ Timeline: launched in 3 business days from kickoff</li>
              </ul>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <GreenGlowLine />

      {/* ── Placeholder: First paying client ────────────────── */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal direction="up">
            <div className="bg-[#0D0D0D] rounded-lg border border-dashed border-[#374151] p-12 text-center">
              <p className="text-[#374151] font-mono text-xs uppercase tracking-widest mb-3">
                {ja ? '次の事例' : 'Next case study'}
              </p>
              <p className="text-[#374151] font-mono text-sm mb-6">
                {ja ? '現在受注中のプロジェクトがここに掲載されます。' : 'A project currently in progress. Coming soon.'}
              </p>
              <a
                href={scopingCallHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#00E87A] text-[#0D0D0D] font-heading font-bold uppercase tracking-widest text-sm px-8 py-3 rounded hover:bg-[#00ff88] active:scale-95 transition-all duration-150 shadow-[0_0_24px_rgba(0,232,122,0.4)]"
              >
                {ja ? 'あなたのプロジェクトをここに' : 'Your project here →'}
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 text-center">
        <ScrollReveal direction="up">
          <p className="text-[#6B7280] font-mono text-sm mb-8">
            {ja ? 'あなたのビジネスも、ここに載りませんか。' : 'Want your project here?'}
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
