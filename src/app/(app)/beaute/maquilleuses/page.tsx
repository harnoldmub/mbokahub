import { SectionHeading } from "@/components/marketing/section-heading";
import { ProCard } from "@/components/pros/pro-card";
import { demoPros } from "@/lib/demo-data";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function MaquilleusesPage() {
  const pros = demoPros.filter((pro) => pro.category === "MAQUILLEUSE");

  return (
    <main className="relative min-h-screen">
       {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <span className="absolute left-[-10vw] top-[20vh] font-display text-[25vw] text-blood opacity-[0.03] select-none leading-none uppercase">
          GLOW
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
          description="Trouve une maquilleuse dispo pour le jour J. Noms et contacts floutés."
          eyebrow="Maquilleuses"
          title="Beauté & Style"
        />
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {pros.map((pro) => (
            <ProCard key={pro.id} pro={pro} />
          ))}
        </div>
      </div>
    </main>
  );
}
