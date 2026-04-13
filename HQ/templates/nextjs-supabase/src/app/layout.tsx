import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "App";
const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
// TODO per-client: rewrite description, tune OG title/description copy.
const description = "Built by ZeroEn";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: appName,
    template: `%s — ${appName}`,
  },
  description,
  openGraph: {
    title: appName,
    description,
    url: appUrl,
    siteName: appName,
    images: ["/opengraph-image"],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: appName,
    description,
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        {process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
          <Script
            src={`${process.env.NEXT_PUBLIC_UMAMI_URL ?? 'https://umami.zeroen.dev'}/script.js`}
            data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
