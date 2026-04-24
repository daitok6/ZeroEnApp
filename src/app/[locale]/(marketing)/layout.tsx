import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Suspense } from 'react';
import { BTStatusBar } from '@/components/brutalist/bt-status-bar';
import { BTNav } from '@/components/brutalist/bt-nav';
import { BTFooter } from '@/components/brutalist/bt-footer';
import { UtmCapture } from '@/components/analytics/utm-capture';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function MarketingLayout({ children, params }: Props) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <Suspense>
        <UtmCapture />
      </Suspense>
      <div data-theme="brutalist">
        <a
          href="#main-content"
          style={{
            position: 'absolute',
            left: '-9999px',
            top: 'auto',
            width: '1px',
            height: '1px',
            overflow: 'hidden',
          }}
          onFocus={(e) => { (e.target as HTMLElement).style.cssText = 'position:static;width:auto;height:auto;overflow:visible;'; }}
          onBlur={(e) => { (e.target as HTMLElement).style.cssText = 'position:absolute;left:-9999px;top:auto;width:1px;height:1px;overflow:hidden;'; }}
        >
          Skip to content
        </a>
        <BTStatusBar />
        <BTNav />
        <main id="main-content" className="bt-fadein">{children}</main>
        <BTFooter locale={locale} />
      </div>
    </NextIntlClientProvider>
  );
}
