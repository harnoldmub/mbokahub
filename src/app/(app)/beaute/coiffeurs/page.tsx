import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { SectionHeading } from "@/components/marketing/section-heading";
import { ProsListClient } from "@/components/pros/pros-list-client";
import { demoPros } from "@/lib/demo-data";

export default function CoiffeursPage() {
  const pros: typeof demoPros = [];

  return (
    <main className="relative min-h-screen">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <span className="absolute left-[-10vw] top-[20vh] font-display text-[25vw] text-gold opacity-[0.03] select-none leading-none uppercase">
          STYLE
        </span>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Link
          href="/beaute"
          className="inline-flex items-center gap-2 font-mono text-[10px] text-paper-mute uppercase tracking-[0.2em] mb-12 hover:text-blood transition-colors"
        >
          <ChevronLeft className="size-3" /> Retour aux prestations
        </Link>
        <SectionHeading
          number="02"
          description="Les meilleurs salons et coiffeurs indés pour être au top. Noms et contacts floutés."
          eyebrow="Coiffeurs"
          title="Beauté & Style"
        />

        <div className="mt-14">
          <ProsListClient pros={pros} categoryTitle="Coiffeurs" />
        </div>
      </div>
    </main>
  );
}
