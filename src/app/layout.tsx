import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Suspense } from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { AppProviders } from "@/components/providers/app-providers";
import { CookieConsent } from "@/components/shared/cookie-consent";
import { EVENT_CONTEXT } from "@/lib/constants";
import { fontBody, fontDisplay, fontMono, fontSerif } from "./fonts";

import "./globals.css";

const fontVariables = `${fontDisplay.variable} ${fontSerif.variable} ${fontBody.variable} ${fontMono.variable}`;
const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001";

export const metadata: Metadata = {
  applicationName: "Mboka Hub",
  title: {
    default: "Mboka Hub | Concert diaspora Paris 2026",
    template: "%s | Mboka Hub",
  },
  description:
    "Trajets, pros beauté, afters externes, merch, jeu et bons plans pour le concert diaspora Paris 2026 au Stade de France, les 2 et 3 mai 2026.",
  icons: {
    apple: [{ url: "/apple-icon.svg", type: "image/svg+xml" }],
    icon: [{ url: "/logo.svg", type: "image/svg+xml" }],
    shortcut: ["/logo.svg"],
  },
  keywords: [
    "concert diaspora Paris 2026",
    "Stade de France 2 et 3 mai 2026",
    "concert Stade de France mai 2026",
    "covoiturage concert Paris",
    "maquilleuse afro Paris",
    "coiffeur afro Paris",
    "afters afro Paris",
    "bons plans Paris diaspora",
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
    description: `Services pratiques autour du ${EVENT_CONTEXT.seoLabel} : trajets, beauté, afters externes, merch et Paris pratique.`,
    images: [
      {
        alt: "Logo Mboka Hub",
        height: 512,
        url: "/logo.svg",
        width: 512,
      },
    ],
    locale: "fr_FR",
    siteName: "Mboka Hub",
    title: "Mboka Hub | Concert diaspora Paris 2026",
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
    description: `Prépare ton week-end autour du ${EVENT_CONTEXT.seoLabel}.`,
    images: ["/logo.svg"],
    title: "Mboka Hub",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="fr" className="dark" suppressHydrationWarning>
        <body
          className={`${fontVariables} min-h-screen bg-ink font-body text-paper antialiased`}
        >
          <AppProviders>
            <div className="relative flex min-h-screen flex-col">
              <Suspense fallback={null}>
                <SiteHeader />
              </Suspense>
              <main className="flex-1">{children}</main>
              <Suspense fallback={null}>
                <SiteFooter />
              </Suspense>
            </div>
            <CookieConsent />
          </AppProviders>
        </body>
      </html>
    </ClerkProvider>
  );
}
