import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { SectionHeading } from "@/components/marketing/section-heading";
import { ProsListClient } from "@/components/pros/pros-list-client";
import { demoPros } from "@/lib/demo-data";

export const dynamic = "force-static";

export default function MaquilleusesPage() {
  const pros: typeof demoPros = [];

  return (
    <main className="relative min-h-screen">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <span className="absolute left-[-10vw] top-[20vh] font-display text-[25vw] text-blood opacity-[0.03] select-none leading-none uppercase">
          GLOW
        </span>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Link
          className="mb-12 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-paper-mute transition-colors hover:text-blood"
          href="/beaute"
        >
          <ChevronLeft className="size-3" />
          Retour aux prestations
        </Link>

        <SectionHeading
          number="02"
          description="Trouve une maquilleuse dispo pour le jour J. Noms et contacts floutés."
          eyebrow="Maquilleuses"
          title="Beauté & Style"
        />

        <div className="mt-14">
          <ProsListClient pros={pros} categoryTitle="Maquilleuses" />
        </div>
      </div>
    </main>
  );
}
