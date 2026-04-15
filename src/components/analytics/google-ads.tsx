'use client';

import Script from 'next/script';

const ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;

/**
 * Loads the Google Ads global site tag (gtag.js).
 * No-ops gracefully when NEXT_PUBLIC_GOOGLE_ADS_ID is not set.
 * Mount this in the root layout next to GoogleAnalytics.
 */
export function GoogleAds() {
  if (!ADS_ID) return null;

  return (
    <Script id="google-ads-init" strategy="afterInteractive">
      {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('config', '${ADS_ID}');
      `}
    </Script>
  );
}

/**
 * Fire a Google Ads conversion event.
 * Call this from the apply thank-you page on mount.
 *
 * @param conversionLabel - The conversion label from Google Ads (e.g. "XXXXXXXXXXXXXXXX")
 *   Set NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL in Vercel env vars.
 */
export function fireApplyConversion() {
  if (typeof window === 'undefined') return;
  if (!ADS_ID) return;

  const label = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL;
  if (!label) return;

  const g = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof g !== 'function') return;

  g('event', 'conversion', {
    send_to: `${ADS_ID}/${label}`,
  });
}
