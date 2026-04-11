import Link from 'next/link';
import Image from 'next/image';
import { NewsletterForm } from '@/components/marketing/newsletter-form';

export function Footer({ locale }: { locale: string }) {
  return (
    <footer className="border-t border-[#374151] bg-[#0D0D0D] mt-24">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand column */}
          <div className="md:col-span-1">
            <Link href={`/${locale}`}>
              <Image src="/logo-dark.svg" alt="ZeroEn" width={90} height={26} />
            </Link>
            <p className="mt-4 text-[#6B7280] text-sm font-mono leading-relaxed">
              {locale === 'ja' ? 'アイデアを、形にする。' : 'Bring your idea to life.'}
            </p>
            <div className="mt-6 flex gap-4">
              <a
                href="https://x.com/zeroendev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#6B7280] hover:text-[#00E87A] transition-colors text-sm font-mono"
              >
                X / Twitter
              </a>
              <a
                href="https://instagram.com/zeroendev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#6B7280] hover:text-[#00E87A] transition-colors text-sm font-mono"
              >
                Instagram
              </a>
            </div>
          </div>

          {/* Product links */}
          <div>
            <h4 className="text-[#F4F4F2] text-xs font-bold uppercase tracking-widest mb-4">
              {locale === 'ja' ? 'プロダクト' : 'Product'}
            </h4>
            <ul className="space-y-3">
              {[
                {
                  href: `/${locale}/how-it-works`,
                  label: locale === 'ja' ? '仕組み' : 'How It Works',
                },
                {
                  href: `/${locale}/login?intent=apply`,
                  label: locale === 'ja' ? '申し込む' : 'Apply Free',
                },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[#6B7280] hover:text-[#F4F4F2] text-sm font-mono transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h4 className="text-[#F4F4F2] text-xs font-bold uppercase tracking-widest mb-4">
              {locale === 'ja' ? '会社' : 'Company'}
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href={`/${locale}/blog`}
                  className="text-[#6B7280] hover:text-[#F4F4F2] text-sm font-mono transition-colors"
                >
                  {locale === 'ja' ? 'ブログ' : 'Blog'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-[#F4F4F2] text-xs font-bold uppercase tracking-widest mb-4">
              {locale === 'ja' ? 'ニュースレター' : 'Newsletter'}
            </h4>
            <p className="text-[#6B7280] text-sm font-mono mb-4">
              {locale === 'ja' ? '最新情報をお届けします。' : 'Stay in the loop.'}
            </p>
            <NewsletterForm locale={locale} />
          </div>
        </div>

        <div className="mt-8 md:mt-12 pt-8 border-t border-[#374151] flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4">
          <p className="text-[#6B7280] text-xs font-mono">
            © {new Date().getFullYear()} ZeroEn. All rights reserved.
          </p>
          <p className="text-[#6B7280] text-xs font-mono">
            {locale === 'ja' ? '東京 · AI駆動のCTO' : 'Tokyo · AI-Powered CTO'}
          </p>
        </div>
      </div>
    </footer>
  );
}
