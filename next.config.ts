import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    '/api/onboarding/complete': ['./legal/**/*.md'],
    '/api/documents/[id]/pdf': ['./legal/**/*.md'],
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
  experimental: {
    optimizePackageImports: ['framer-motion', '@base-ui/react', 'lucide-react'],
  },
  async redirects() {
    return [
      { source: '/en/dashboard-preview', destination: '/en/live-from-day-one', permanent: true },
      { source: '/ja/dashboard-preview', destination: '/ja/live-from-day-one', permanent: true },
      { source: '/dashboard-preview',    destination: '/en/live-from-day-one', permanent: true },
      { source: '/en/book', destination: 'https://cal.com/zeroen/scoping-call',    permanent: false },
      { source: '/ja/book', destination: 'https://cal.com/zeroen/scoping-call-ja', permanent: false },
    ];
  },
};

export default withNextIntl(nextConfig);
