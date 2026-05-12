import Link from "next/link";

import { withAs } from "@/lib/pro-context";

const tabs = [
  { href: "/dashboard/profil-pro", label: "Infos publiques" },
  { href: "/dashboard/profil-pro/prestations", label: "Prestations" },
  { href: "/dashboard/profil-pro/equipe", label: "Équipe" },
  { href: "/dashboard/profil-pro/horaires", label: "Horaires & congés" },
  { href: "/dashboard/planning", label: "Planning" },
];

export function ProfilProTabs({
  active,
  actingAs,
}: {
  active: string;
  actingAs?: string | null;
}) {
  return (
    <div className="-mx-1 flex flex-wrap gap-1 overflow-x-auto rounded-2xl border border-white/10 bg-coal p-1">
      {tabs.map((t) => {
        const isActive = t.href === active;
        return (
          <Link
            href={withAs(t.href, actingAs)}
            key={t.href}
            className={`rounded-xl px-4 py-2 text-sm transition ${
              isActive
                ? "bg-blood/15 text-paper"
                : "text-paper-dim hover:bg-smoke hover:text-paper"
            }`}
          >
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}
