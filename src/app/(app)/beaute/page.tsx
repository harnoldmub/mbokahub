import { ArrowRight, Camera, Scissors, Sparkles } from "lucide-react";
import Link from "next/link";

import { SectionHeading } from "@/components/marketing/section-heading";
import { Button } from "@/components/ui/button";
import {
  getLocaleFromSearchParams,
  localizedHref,
  nls,
  type SearchParams,
} from "@/lib/nls";
import { cn } from "@/lib/utils";

type PrestationsPageProps = {
  searchParams?: Promise<SearchParams>;
};

const categoryMeta = [
  {
    href: "/beaute/maquilleuses",
    icon: Sparkles,
    color: "text-blood",
    count: 24,
  },
  {
    href: "/beaute/coiffeurs",
    icon: Scissors,
    color: "text-gold",
    count: 18,
  },
  {
    href: "/beaute/photographes",
    icon: Camera,
    color: "text-paper",
    count: 12,
  },
] as const;

export default async function PrestationsPage({
  searchParams,
}: PrestationsPageProps) {
  const locale = getLocaleFromSearchParams(await searchParams);
  const copy = nls[locale].prestations;
  const categories = categoryMeta.map((meta, index) => ({
    ...meta,
    ...copy.categories[index],
  }));

  return (
    <main className="relative min-h-screen bg-ink">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <span className="absolute left-[-10vw] top-[30vh] font-display text-[25vw] text-paper opacity-[0.02] select-none leading-none uppercase -rotate-90">
          STYLE
        </span>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-32">
        <SectionHeading
          description={copy.description}
          eyebrow={copy.eyebrow}
          number={copy.number}
          title={copy.title}
        />

        <div className="mt-20 grid gap-8 lg:grid-cols-3">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                className="group relative overflow-hidden rounded-[3rem] bg-coal border border-white/10 p-10 transition-all duration-700 hover:border-blood/50 hover:-translate-y-4 hover:shadow-[0_40px_80px_-20px_rgba(230,57,70,0.25)]"
                href={localizedHref(category.href, locale)}
                key={category.href}
              >
                <div className="absolute top-0 right-0 p-10 opacity-[0.03] transition-all duration-1000 group-hover:opacity-20 group-hover:scale-125 group-hover:rotate-12">
                  <Icon className="size-48" />
                </div>

                <div className="relative z-10 space-y-8">
                  <div
                    className={cn(
                      "size-16 rounded-3xl bg-smoke flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:bg-blood shadow-glow-blood",
                      category.color,
                    )}
                  >
                    <Icon className="size-8 group-hover:text-paper" />
                  </div>

                  <div>
                    <div className="mb-3 flex items-center gap-3">
                      <span className="font-mono text-[10px] text-paper-mute uppercase tracking-[0.3em]">
                        {category.count} {copy.members}
                      </span>
                      <div className="size-1 rounded-full bg-blood" />
                    </div>
                    <h3 className="font-display text-5xl text-paper uppercase tracking-normal">
                      {category.title}
                    </h3>
                  </div>

                  <p className="max-w-[240px] text-paper-dim text-lg leading-relaxed font-body">
                    {category.description}
                  </p>

                  <div className="flex items-center gap-2 font-mono text-[10px] text-blood uppercase tracking-widest opacity-0 -translate-x-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0">
                    {copy.explore} <ArrowRight className="size-3" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-20 flex flex-col items-center justify-between gap-12 rounded-[3rem] border border-blood/20 bg-blood/5 p-12 lg:flex-row">
          <div className="max-w-xl text-center lg:text-left">
            <h2 className="mb-4 font-display text-4xl text-paper uppercase tracking-normal">
              {copy.proTitle}
            </h2>
            <p className="text-paper-dim font-body italic">
              {copy.proDescription}
            </p>
          </div>
          <Button
            asChild
            className="h-20 px-12 text-xl shadow-glow-blood group"
            size="lg"
          >
            <Link href={localizedHref("/pro/inscrire", locale)}>
              {copy.proCta}
              <ArrowRight className="ml-3 size-6 transition-transform group-hover:translate-x-2" />
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
