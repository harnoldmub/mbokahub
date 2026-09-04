import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata({ title: "Référencer une soirée ou un after", description: "Propose gratuitement ta soirée ou ton after à l’équipe Nevent pour vérification et publication.", path: "/afters/organiser", locale, noIndex: true });
}

export default function OrganizeAfterLayout({ children }: { children: React.ReactNode }) { return children; }
