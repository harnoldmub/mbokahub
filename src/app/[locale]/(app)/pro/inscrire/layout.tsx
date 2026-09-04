import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata({
    title: "Devenir prestataire sur Nevent",
    description:
      "Crée gratuitement ton profil prestataire et présente tes services aux personnes qui organisent leur expérience autour d’un événement.",
    path: "/pro/inscrire",
    locale,
  });
}

export default function RegisterProLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
