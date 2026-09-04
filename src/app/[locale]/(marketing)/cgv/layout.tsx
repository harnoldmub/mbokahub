import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata({ title: "Conditions générales de vente", description: "Conditions applicables aux services proposés par Nevent.", path: "/cgv", locale });
}

export default function CgvLayout({ children }: { children: React.ReactNode }) { return children; }
