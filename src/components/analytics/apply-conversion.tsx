'use client';

import { useEffect } from 'react';
import { fireApplyConversion } from './google-ads';
import { trackEvent } from './google-analytics';

export function ApplyConversion() {
  useEffect(() => {
    fireApplyConversion();
    trackEvent({ action: 'apply_thank_you_view' });
  }, []);

  return null;
}
