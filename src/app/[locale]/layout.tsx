import { notFound } from "next/navigation";

import { isMarket } from "@/lib/markets";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isMarket(locale)) notFound();
  return <>{children}</>;
}

export function generateStaticParams() {
  return [{ locale: "fr" }, { locale: "fr-be" }, { locale: "fr-cod" }];
}
