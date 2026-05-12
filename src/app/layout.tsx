import { frFR } from "@clerk/localizations";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import Script from "next/script";
import { Suspense } from "react";

import { QuickNav } from "@/components/layout/quick-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { AppProviders } from "@/components/providers/app-providers";
import { CookieConsent } from "@/components/shared/cookie-consent";
import { FomoTicker } from "@/components/shared/fomo-ticker";
import { fontBody, fontDisplay, fontMono, fontSerif } from "./fonts";

import "./globals.css";

const fontVariables = `${fontDisplay.variable} ${fontSerif.variable} ${fontBody.variable} ${fontMono.variable}`;
const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001";
const GA_ID = "G-YS8CL4ZE62";

export const metadata: Metadata = {
  applicationName: "Mboka Hub",
  title: {
    default: "Mboka Hub | Services, prestataires et réservations",
    template: "%s | Mboka Hub",
  },
  description:
    "Plateforme gratuite de mise en relation entre clients et prestataires : services locaux, planning, réservation, médias, boosts et placements sponsorisés.",
  icons: {
    apple: [{ url: "/apple-icon.svg", type: "image/svg+xml" }],
    icon: [{ url: "/logo.png", type: "image/png" }],
    shortcut: ["/logo.png"],
  },
  keywords: [
    "concert diaspora Paris 2026",
    "prestataires diaspora",
    "réservation prestataire",
    "annuaire prestataires",
    "plateforme services",
    "boost prestataire",
    "publicité locale",
    "maquilleuse afro Paris",
    "coiffeur afro Paris",
    "photographe afro Paris",
    "services diaspora",
  ],
  metadataBase: new URL(appUrl),
  alternates: {
    canonical: "/",
    languages: {
      fr: "/?lang=fr",
      en: "/?lang=en",
      de: "/?lang=de",
      nl: "/?lang=nl",
    },
  },
  openGraph: {
    description:
      "Annuaire gratuit, réservation directe et visibilité sponsorisée pour les prestataires.",
    images: [
      {
        alt: "Logo Mboka Hub",
        height: 512,
        url: "/logo.png",
        width: 512,
      },
    ],
    locale: "fr_FR",
    siteName: "Mboka Hub",
    title: "Mboka Hub | Services, prestataires et réservations",
    type: "website",
    url: "/",
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
    card: "summary",
    description:
      "Trouve un prestataire, réserve un créneau et booste ta visibilité locale.",
    images: ["/logo.png"],
    title: "Mboka Hub",
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
              <Suspense fallback={null}>
                <QuickNav />
              </Suspense>
              <main className="flex-1">{children}</main>
              <Suspense fallback={null}>
                <SiteFooter />
              </Suspense>
            </div>
            <CookieConsent />
            <FomoTicker />
          </AppProviders>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
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
