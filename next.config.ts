import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  serverExternalPackages: ['docusign-esign'],
  async redirects() {
    return [
      { source: '/pricing', destination: '/en', permanent: true },
      { source: '/en/pricing', destination: '/en', permanent: true },
      { source: '/ja/pricing', destination: '/ja', permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);
