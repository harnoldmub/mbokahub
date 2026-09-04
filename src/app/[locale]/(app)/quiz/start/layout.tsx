import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata({ title: "Quiz Fally Ipupa", description: "Teste tes connaissances sur Fally Ipupa et partage ton score.", path: "/quiz/start", locale, noIndex: true });
}

export default function QuizStartLayout({ children }: { children: React.ReactNode }) { return children; }
