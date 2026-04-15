import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Suspense } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
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
      <Header />
      <main>{children}</main>
      <Footer locale={locale} />
    </NextIntlClientProvider>
  );
}
