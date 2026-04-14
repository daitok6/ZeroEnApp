import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { NewsletterForm } from '@/components/marketing/newsletter-form';

export function Footer({ locale }: { locale: string }) {
  const t = useTranslations('footer');

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
              {t('tagline')}
            </p>
            <div className="mt-6 flex gap-4">
              <a
                href="https://x.com/ZeroEnBuilds"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#6B7280] hover:text-[#00E87A] transition-colors text-sm font-mono"
              >
                X / Twitter
              </a>
              <a
                href="https://www.instagram.com/zeroenbuilds/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#6B7280] hover:text-[#00E87A] transition-colors text-sm font-mono"
              >
                Instagram
              </a>
            </div>
          </div>

          {/* Company links */}
          <div>
            <h4 className="text-[#F4F4F2] text-xs font-bold uppercase tracking-widest mb-4">
              {t('company.heading')}
            </h4>
            <ul className="space-y-3">
              {[
                { href: `/${locale}/about`, label: t('company.about') },
                { href: `/${locale}/cases`, label: t('company.cases') },
                { href: `/${locale}/pricing`, label: t('company.pricing') },
                { href: `/${locale}/how-it-works`, label: t('product.howItWorks') },
                { href: `/${locale}/login`, label: t('product.applyFree') },
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

          {/* Resources links */}
          <div>
            <h4 className="text-[#F4F4F2] text-xs font-bold uppercase tracking-widest mb-4">
              {t('resources.heading')}
            </h4>
            <ul className="space-y-3">
              {[
                { href: `/${locale}/blog`, label: t('resources.blog') },
                { href: `/${locale}/pricing#faq`, label: t('resources.faq') },
                { href: `/${locale}/blog/peraichi-studio-zeroen-comparison`, label: t('resources.comparison') },
                { href: `/${locale}/blog/whats-included-5000`, label: t('resources.whatsIncluded') },
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

          {/* Newsletter */}
          <div>
            <h4 className="text-[#F4F4F2] text-xs font-bold uppercase tracking-widest mb-4">
              {t('newsletter.heading')}
            </h4>
            <p className="text-[#6B7280] text-sm font-mono mb-4">
              {t('newsletter.description')}
            </p>
            <NewsletterForm locale={locale} />
          </div>
        </div>

        <div className="mt-8 md:mt-12 pt-8 border-t border-[#374151] flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4">
          <p className="text-[#6B7280] text-xs font-mono">
            © {new Date().getFullYear()} ZeroEn. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href={`/${locale}/terms`}
              className="text-[#6B7280] hover:text-[#F4F4F2] text-xs font-mono transition-colors"
            >
              {t('bottom.terms')}
            </Link>
            <Link
              href={`/${locale}/privacy`}
              className="text-[#6B7280] hover:text-[#F4F4F2] text-xs font-mono transition-colors"
            >
              {t('bottom.privacy')}
            </Link>
            <p className="text-[#6B7280] text-xs font-mono">
              {t('bottom.tagline')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
