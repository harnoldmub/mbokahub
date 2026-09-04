import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata({ title: "Devenir partenaire de Nevent", description: "Marques, médias, créateurs, salles et organisateurs : construisons ensemble de meilleures expériences événementielles pour la diaspora.", path: "/partenariat", locale });
}

export default function PartnershipLayout({ children }: { children: React.ReactNode }) { return children; }
