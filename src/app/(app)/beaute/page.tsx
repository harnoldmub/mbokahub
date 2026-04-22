import { SectionHeading } from "@/components/marketing/section-heading";
import { Scissors, Sparkles, Camera, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const stylistCategories = [
  {
    title: "Maquilleuses",
    description: "Pros spécialisées peaux noires & métisses.",
    href: "/beaute/maquilleuses",
    icon: Sparkles,
    color: "text-blood",
    count: 24
  },
  {
    title: "Coiffeurs & Barbiers",
    description: "Tresses, lace wigs et dégradés parfaits.",
    href: "/beaute/coiffeurs",
    icon: Scissors,
    color: "text-gold",
    count: 18
  },
  {
    title: "Photographes",
    description: "Immortalisez votre passage au Stade de France.",
    href: "/beaute/photographes",
    icon: Camera,
    color: "text-paper",
    count: 12
  }
];

export default function PrestationsPage() {
  return (
    <main className="relative min-h-screen bg-ink">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <span className="absolute left-[-10vw] top-[30vh] font-display text-[25vw] text-paper opacity-[0.02] select-none leading-none uppercase -rotate-90">
          STYLE
        </span>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-32 relative z-10">
        <SectionHeading
          number="02"
          eyebrow="Prestations"
          title="Le centre du *style*."
          description="Trouve les meilleurs prestataires pour être irréprochable. Tous nos membres sont certifiés sur base de leur portfolio."
        />

        <div className="mt-20 grid lg:grid-cols-3 gap-8">
           {stylistCategories.map((cat) => {
             const Icon = cat.icon;
             return (
               <Link 
                 key={cat.href}
                 href={cat.href}
                 className="group relative overflow-hidden rounded-[3rem] bg-coal border border-white/10 p-10 transition-all duration-700 hover:border-blood/50 hover:-translate-y-4 hover:shadow-[0_40px_80px_-20px_rgba(230,57,70,0.25)]"
               >
                 <div className="absolute top-0 right-0 p-10 opacity-[0.03] transition-all duration-1000 group-hover:opacity-20 group-hover:scale-125 group-hover:rotate-12">
                   <Icon className="size-48" />
                 </div>

                 <div className="relative z-10 space-y-8">
                    <div className={cn("size-16 rounded-3xl bg-smoke flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:bg-blood shadow-glow-blood", cat.color)}>
                      <Icon className="size-8 group-hover:text-paper" />
                    </div>

                    <div>
                       <div className="flex items-center gap-3 mb-3">
                          <span className="font-mono text-[10px] text-paper-mute uppercase tracking-[0.3em]">{cat.count} Membres</span>
                          <div className="size-1 rounded-full bg-blood" />
                       </div>
                       <h3 className="font-display text-5xl text-paper uppercase tracking-tighter">
                         {cat.title}
                       </h3>
                    </div>

                    <p className="text-paper-dim text-lg leading-relaxed max-w-[240px] font-body">
                      {cat.description}
                    </p>

                    <div className="flex items-center gap-2 font-mono text-[10px] text-blood uppercase tracking-widest opacity-0 -translate-x-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0">
                      Explorer la catégorie <ArrowRight className="size-3" />
                    </div>
                 </div>
               </Link>
             )
           })}
        </div>

        {/* CTA FOR PROS */}
        <div className="mt-20 rounded-[3rem] border border-blood/20 bg-blood/5 p-12 flex flex-col lg:flex-row items-center justify-between gap-12">
           <div className="max-w-xl text-center lg:text-left">
              <h2 className="font-display text-4xl text-paper uppercase mb-4 tracking-tight">Tu es un prestataire ?</h2>
              <p className="text-paper-dim font-body italic">"Mboka Hub est la vitrine n°1 de la diaspora. Rejoins l'aventure et sois visible par des milliers de fans."</p>
           </div>
           <Button asChild size="lg" className="h-20 px-12 text-xl shadow-glow-blood group">
              <Link href="/pro/inscrire">
                S'inscrire comme Pro <ArrowRight className="ml-3 size-6 transition-transform group-hover:translate-x-2" />
              </Link>
           </Button>
        </div>
      </div>
    </main>
  );
}

import { Button } from "@/components/ui/button";
