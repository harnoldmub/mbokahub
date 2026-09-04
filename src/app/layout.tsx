import { frFR } from "@clerk/localizations";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import Script from "next/script";
import { Suspense } from "react";

import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { AppProviders } from "@/components/providers/app-providers";
import { CookieConsent } from "@/components/shared/cookie-consent";
import { FomoTicker } from "@/components/shared/fomo-ticker";
import { getSiteUrl, SITE_DESCRIPTION, SITE_NAME } from "@/lib/seo";
import { fontBody, fontDisplay, fontMono, fontSerif } from "./fonts";

import "./globals.css";

const fontVariables = `${fontDisplay.variable} ${fontSerif.variable} ${fontBody.variable} ${fontMono.variable}`;
const appUrl = getSiteUrl();
const GA_ID = "G-YS8CL4ZE62";

const ORG_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: appUrl,
  logo: `${appUrl}/icon.svg`,
  image: `${appUrl}/opengraph-image`,
};

const WEBSITE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  url: appUrl,
  potentialAction: {
    "@type": "SearchAction",
    target: `${appUrl}/fr/evenements?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  applicationName: SITE_NAME,
  title: {
    default: "Nevent — Événements afro, trajets et services",
    template: "%s | Nevent",
  },
  description: SITE_DESCRIPTION,
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml", sizes: "any" }],
    shortcut: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [
      { url: "/apple-icon.svg", type: "image/svg+xml", sizes: "180x180" },
    ],
  },
  keywords: [
    "événements afro Europe",
    "concerts afro Paris",
    "concerts afro Bruxelles",
    "concerts afro Londres",
    "Afrobeats",
    "Amapiano",
    "rumba congolaise",
    "covoiturage concert",
    "prestataires afro",
    "afters afro",
  ],
  category: "events",
  creator: SITE_NAME,
  publisher: SITE_NAME,
  referrer: "origin-when-cross-origin",
  formatDetection: { address: false, email: false, telephone: false },
  openGraph: {
    description: SITE_DESCRIPTION,
    images: [
      {
        alt: "Nevent — événements afro, trajets et services",
        height: 630,
        url: "/opengraph-image",
        width: 1200,
      },
    ],
    locale: "fr_FR",
    alternateLocale: ["fr_BE", "fr_CD"],
    siteName: SITE_NAME,
    title: "Nevent — Découvre l’événement, organise toute ton expérience",
    type: "website",
    url: "/fr",
  },
  robots: {
    follow: true,
    googleBot: {
      follow: true,
      index: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
    index: true,
  },
  twitter: {
    card: "summary_large_image",
    description: SITE_DESCRIPTION,
    images: ["/opengraph-image"],
    title: "Nevent — Événements afro, trajets et services",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={frFR}>
      <html lang="fr" suppressHydrationWarning>
        <body
          className={`${fontVariables} min-h-screen bg-ink font-body text-paper antialiased`}
        >
          <AppProviders>
            <div className="relative flex min-h-screen flex-col">
              <Suspense fallback={null}>
                <SiteHeader />
              </Suspense>
              <div className="flex-1">{children}</div>
              <Suspense fallback={null}>
                <SiteFooter />
              </Suspense>
            </div>
            <Suspense fallback={null}>
              <MobileBottomNav />
            </Suspense>
            <CookieConsent />
            <FomoTicker />
          </AppProviders>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <script type="application/ld+json">
            {JSON.stringify(ORG_JSONLD)}
          </script>
          <script type="application/ld+json">
            {JSON.stringify(WEBSITE_JSONLD)}
          </script>
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}', { anonymize_ip: true });
            `}
          </Script>
        </body>
      </html>
    </ClerkProvider>
  );
}
