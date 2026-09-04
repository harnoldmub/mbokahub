import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata({ title: "Sape Run — Jeu Nevent", description: "Joue à Sape Run et grimpe dans le classement de la communauté Nevent.", path: "/jeu/play", locale, noIndex: true });
}

export default function GameLayout({ children }: { children: React.ReactNode }) { return children; }
