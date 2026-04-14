'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

const UTM_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;
const STORAGE_KEY = 'attribution_source';

/**
 * Captures first-touch UTM attribution on landing and stores it in localStorage.
 * The stored string is `utm_source` (e.g. "x_twitter") or "direct" if no UTMs present.
 * Submitted alongside apply_submit and saas-intake form payloads.
 *
 * Only writes on first landing — does not overwrite an existing stored value.
 */
export function UtmCapture() {
  const searchParams = useSearchParams();

  useEffect(() => {
    try {
      // First-touch: only write if no attribution stored yet
      const existing = localStorage.getItem(STORAGE_KEY);
      if (existing) return;

      const utmSource = searchParams.get('utm_source');
      if (utmSource) {
        // Build a compact attribution string: "source/medium/campaign"
        const parts = [
          utmSource,
          searchParams.get('utm_medium'),
          searchParams.get('utm_campaign'),
        ].filter(Boolean);
        localStorage.setItem(STORAGE_KEY, parts.join('/'));

        // Also push UTMs to dataLayer for GA4 session-scoped dimensions
        if (typeof window !== 'undefined' && 'gtag' in window) {
          const g = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
          if (typeof g === 'function') {
            const utmData: Record<string, string> = {};
            for (const key of UTM_PARAMS) {
              const val = searchParams.get(key);
              if (val) utmData[key] = val;
            }
            g('event', 'utm_captured', utmData);
          }
        }
      } else {
        localStorage.setItem(STORAGE_KEY, 'direct');
      }
    } catch {
      // localStorage unavailable (private browsing, etc.) — silently skip
    }
  }, [searchParams]);

  return null;
}
