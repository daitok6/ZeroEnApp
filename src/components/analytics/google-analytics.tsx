'use client';

import Script from 'next/script';

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

/**
 * Loads Google Analytics 4 via gtag.js.
 * No-ops gracefully when NEXT_PUBLIC_GA_MEASUREMENT_ID is not set.
 */
export function GoogleAnalytics() {
  if (!GA_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            anonymize_ip: true,
            cookie_flags: 'SameSite=None;Secure'
          });
        `}
      </Script>
    </>
  );
}

type GtagEvent = {
  action: string;
  params?: Record<string, string | number | boolean | undefined>;
};

/** Fire a GA4 event. Safe to call even when GA4 is not loaded. */
export function trackEvent({ action, params }: GtagEvent) {
  if (typeof window === 'undefined') return;
  if (!GA_ID) return;
  const g = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof g !== 'function') return;
  g('event', action, params ?? {});
}
