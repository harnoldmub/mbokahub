import { notFound } from "next/navigation";

import { isLocale, LOCALES } from "@/lib/locales";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <>{children}</>;
}

export function generateStaticParams() {
  return [{ locale: "fr" }, { locale: "fr-be" }, { locale: "fr-cod" }];
}
