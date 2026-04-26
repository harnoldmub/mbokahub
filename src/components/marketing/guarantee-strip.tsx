import { BadgeCheck, ShieldCheck, Sparkles } from "lucide-react";

type GuaranteeStripProps = {
  variant?: "full" | "compact";
};

const PILLARS = [
  {
    icon: ShieldCheck,
    title: "Prestataires vérifiés",
    desc: "Sélection humaine par l'équipe Mboka Hub : profils contrôlés, avis transparents.",
  },
  {
    icon: BadgeCheck,
    title: "Tarifs diaspora",
    desc: "Conditions négociées pour la communauté Mboka Hub, sans commission cachée.",
  },
  {
    icon: Sparkles,
    title: "Contact direct",
    desc: "WhatsApp du prestataire débloqué pour les VIP, sans intermédiaire.",
  },
] as const;

export function GuaranteeStrip({ variant = "full" }: GuaranteeStripProps) {
  if (variant === "compact") {
    return (
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 rounded-2xl border border-blood/20 bg-blood/5 px-4 py-3 text-paper-dim text-xs">
        {PILLARS.map(({ icon: Icon, title }) => (
          <span key={title} className="inline-flex items-center gap-1.5">
            <Icon className="size-3.5 text-blood" aria-hidden />
            <span className="font-medium text-paper">{title}</span>
          </span>
        ))}
      </div>
    );
  }

  return (
    <section
      aria-label="Pourquoi passer par Mboka Hub"
      className="relative overflow-hidden rounded-3xl border border-blood/20 bg-gradient-to-br from-blood/10 via-coal/40 to-transparent p-6 sm:p-8"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(229,9,20,0.08),transparent_60%)]" />
      <div className="relative">
        <p className="font-mono text-[10px] text-blood uppercase tracking-[0.3em]">
          Pourquoi Mboka Hub
        </p>
        <h2 className="mt-2 max-w-2xl font-display text-2xl text-paper uppercase leading-tight sm:text-3xl">
          Une sélection diaspora,
          <br className="hidden sm:block" /> sans intermédiaire.
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {PILLARS.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl border border-white/10 bg-ink/40 p-4"
            >
              <span className="flex size-9 items-center justify-center rounded-xl bg-blood/15 text-blood">
                <Icon className="size-4" aria-hidden />
              </span>
              <h3 className="mt-3 font-display text-sm text-paper uppercase tracking-wide">
                {title}
              </h3>
              <p className="mt-1.5 text-paper-mute text-xs leading-5">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
