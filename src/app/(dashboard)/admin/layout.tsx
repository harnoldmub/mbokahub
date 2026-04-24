import Link from "next/link";
import { requireAdmin } from "@/lib/admin";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/users", label: "Utilisateurs" },
  { href: "/admin/pros", label: "Pros" },
  { href: "/admin/trajets", label: "Trajets" },
  { href: "/admin/communautes", label: "Communautés" },
  { href: "/admin/moderateurs", label: "Modérateurs" },
  { href: "/admin/signalements", label: "🚨 Signalements" },
  { href: "/admin/promo-codes", label: "Codes promo" },
  { href: "/admin/newsletter", label: "Newsletter" },
  { href: "/admin/payments", label: "Paiements" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { email } = await requireAdmin();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-white/10 border-b pb-6">
          <div>
            <p className="font-mono text-muted-foreground text-xs uppercase tracking-widest">
              Mboka Hub · Backoffice
            </p>
            <h1 className="mt-1 font-heading text-3xl text-foreground">
              Administration
            </h1>
          </div>
          <div className="text-right text-muted-foreground text-sm">
            Connecté en tant que
            <div className="font-mono text-foreground">{email}</div>
          </div>
        </header>

        <nav className="mb-8 flex flex-wrap gap-2">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-foreground text-sm transition hover:border-red-500/40 hover:bg-red-500/10"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <main>{children}</main>
      </div>
    </div>
  );
}
