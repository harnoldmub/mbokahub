import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata({ title: "Publier un trajet partagé", description: "Propose gratuitement un covoiturage vers un concert ou un événement à la communauté Nevent.", path: "/trajets/publier", locale, noIndex: true });
}

export default function PublishRideLayout({ children }: { children: React.ReactNode }) { return children; }
