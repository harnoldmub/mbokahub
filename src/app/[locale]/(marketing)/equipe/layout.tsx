import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata({ title: "L’équipe Nevent", description: "Découvre l’équipe et les valeurs qui portent Nevent : diaspora first, transparence, sécurité et indépendance.", path: "/equipe", locale });
}

export default function TeamLayout({ children }: { children: React.ReactNode }) { return children; }
