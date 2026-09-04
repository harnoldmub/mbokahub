import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata({ title: "Avertissement et indépendance", description: "Informations sur l’indépendance de Nevent, les billetteries externes et la responsabilité des contenus publiés.", path: "/disclaimer", locale });
}

export default function DisclaimerLayout({ children }: { children: React.ReactNode }) { return children; }
