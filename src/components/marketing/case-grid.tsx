import Image from 'next/image';
import Link from 'next/link';
import { ScrollReveal } from './scroll-reveal';
import { StaggerChildren, StaggerItem } from './stagger-children';
import type { JSX } from 'react';

interface LocalizedText {
  ja: string;
  en: string;
}

interface CaseItem {
  slug: string;
  name: string;
  desc: LocalizedText;
  screenshot?: string;
  liveUrl?: string;
  isDemo?: boolean;
}

const CASES: CaseItem[] = [
  {
    slug: 'webmori',
    name: 'WebMori',
    desc: { ja: 'セキュリティ・SEO監査サービス', en: 'Security & SEO Audit Service' },
    screenshot: '/webmori-screenshot.png',
    liveUrl: 'https://webmori.jp',
    isDemo: false,
  },
  {
    slug: 'sato-career-coaching',
    name: '佐藤キャリアコーチング',
    desc: { ja: 'ビジネスパーソンのキャリア転換支援', en: 'Career transition coaching for business professionals' },
    isDemo: true,
  },
  {
    slug: 'kokoro-counseling',
    name: 'こころの杜カウンセリング',
    desc: { ja: '対話型心理カウンセリングサービス', en: 'Dialogue-based psychological counseling service' },
    isDemo: true,
  },
];

interface Props {
  locale: string;
}

export function CaseGrid({ locale }: Props): JSX.Element {
  const ja = locale === 'ja';

  return (
    <section className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <ScrollReveal direction="up">
          <div className="mb-16 text-center">
            <p className="text-[#00E87A] font-mono text-xs uppercase tracking-[0.2em] mb-3">
              {ja ? '制作実績' : 'Case Studies'}
            </p>
            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-[#F4F4F2] mb-4">
              {ja ? '公開済みのLP' : 'Live sites we\'ve built.'}
            </h1>
            <p className="text-[#6B7280] font-mono text-sm">
              {ja ? '本物のクライアント。本物のLP。本物の結果。' : 'Real clients. Real landing pages. Real results.'}
            </p>
          </div>
        </ScrollReveal>

        {/* Real client section */}
        <div className="mb-14">
          <p className="text-[#00E87A] font-mono text-xs uppercase tracking-widest mb-5 pl-1">
            {ja ? '本物のクライアント' : 'Real Clients'}
          </p>
          <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 gap-6" staggerDelay={0.1}>
            {CASES.filter((c) => !c.isDemo).map((item) => (
              <StaggerItem key={item.slug}>
                <CaseCard item={item} locale={locale} />
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>

        {/* Demo showcase section */}
        <div>
          <div className="flex items-center gap-4 mb-5">
            <p className="text-[#4B5563] font-mono text-xs uppercase tracking-widest pl-1">
              {ja ? 'テンプレートショーケース' : 'Template Showcase'}
            </p>
            <span className="text-[#374151] font-mono text-xs border border-[#1F2937] rounded px-2 py-0.5">
              {ja ? 'デモサイト — 架空のビジネス' : 'Demo sites — fictional businesses'}
            </span>
          </div>
          <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 gap-6" staggerDelay={0.1}>
            {CASES.filter((c) => c.isDemo).map((item) => (
              <StaggerItem key={item.slug}>
                <CaseCard item={item} locale={locale} />
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </div>
    </section>
  );
}

function CaseCard({ item, locale }: { item: CaseItem; locale: string }): JSX.Element {
  const ja = locale === 'ja';
  const desc = item.desc[locale === 'ja' ? 'ja' : 'en'];

  return (
    <Link
      href={`/${locale}/cases/${item.slug}`}
      className="group block bg-[#111827] border border-[#1F2937] rounded-lg overflow-hidden hover:border-[#00E87A]/30 hover:shadow-[0_0_20px_rgba(0,232,122,0.08)] transition-all duration-300 h-full"
    >
      {/* Screenshot / placeholder */}
      <div className="relative w-full h-44 bg-[#0D0D0D] border-b border-[#1F2937] overflow-hidden">
        {item.screenshot ? (
          <>
            <Image
              src={item.screenshot}
              alt={item.name}
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/60 to-transparent" />
            <span className="absolute bottom-2 right-2 flex items-center gap-1.5 text-[#00E87A] font-mono text-[10px] uppercase tracking-widest bg-[#0D0D0D]/80 px-2 py-0.5 rounded">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E87A] shadow-[0_0_6px_rgba(0,232,122,0.8)] animate-pulse" />
              {ja ? '公開中' : 'Live'}
            </span>
          </>
        ) : (
          <>
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `linear-gradient(rgba(0,232,122,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,232,122,0.04) 1px, transparent 1px)`,
                backgroundSize: '24px 24px',
              }}
            />
            <span className="absolute inset-0 flex items-center justify-center text-[#374151] font-mono text-xs uppercase tracking-widest">
              {ja ? 'サンプルサイト' : 'Sample site'}
            </span>
          </>
        )}
      </div>

      {/* Card body */}
      <div className="p-5">
        {/* Cost comparison ribbon */}
        <div className="flex items-center gap-2 mb-3 text-[10px] font-mono">
          <span className="text-[#4B5563] line-through">
            {ja ? '制作会社 ¥300,000' : 'Agency ¥300,000'}
          </span>
          <span className="text-[#374151]">→</span>
          <span className="text-[#00E87A]">
            {ja ? 'ZeroEn 無料制作 + ¥10,000/月' : 'ZeroEn free build + ¥10,000/mo'}
          </span>
        </div>

        <h3 className="text-[#F4F4F2] font-heading font-bold text-base mb-1 group-hover:text-[#00E87A] transition-colors duration-200">
          {item.name}
        </h3>
        <p className="text-[#6B7280] font-mono text-xs mb-4">{desc}</p>

        <div className="flex items-center justify-between">
          <span className="text-[#374151] font-mono text-[10px] border border-[#1F2937] rounded px-2 py-0.5">
            {ja ? '3日で制作' : 'Built in 3 days'}
          </span>
          <span className="text-[#00E87A] font-mono text-xs group-hover:underline">
            {ja ? '事例を読む →' : 'Read case study →'}
          </span>
        </div>
      </div>
    </Link>
  );
}
