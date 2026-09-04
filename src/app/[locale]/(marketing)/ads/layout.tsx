import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata({ title: "Publicité et visibilité pour les marques", description: "Touchez les communautés afro en Europe grâce aux formats publicitaires et partenariats événementiels de Nevent.", path: "/ads", locale });
}

export default function AdsLayout({ children }: { children: React.ReactNode }) { return children; }
