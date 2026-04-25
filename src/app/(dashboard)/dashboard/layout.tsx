import { UserButton } from "@clerk/nextjs";
import { Bell, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { DashboardNav } from "@/components/dashboard/nav";
import { Badge } from "@/components/ui/badge";
import { isAdminEmail } from "@/lib/admin";
import { getDashboardUser } from "@/lib/dashboard";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getDashboardUser();
  const isAdmin = user.role === "ADMIN" || (await isAdminEmail(user.email));

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[280px_1fr] lg:px-8">
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="rounded-3xl border border-white/10 bg-coal p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-heading text-xl text-paper">
                {user.name ?? "Mon compte"}
              </p>
              <p className="mt-1 text-paper-dim text-sm">{user.email}</p>
            </div>
            <UserButton />
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <Badge className={user.isVipActive ? "bg-gold text-ink" : ""}>
              {user.isVipActive ? "VIP actif" : "Fan"}
            </Badge>
            <Badge
              className={
                isAdmin
                  ? "border-amber-400/50 bg-amber-400/10 text-amber-200"
                  : ""
              }
              variant="outline"
            >
              {user.role}
            </Badge>
          </div>

          <DashboardNav isAdmin={isAdmin} />
        </div>

        {isAdmin ? (
          <Link
            className="mt-4 block rounded-3xl border border-amber-400/30 bg-gradient-to-br from-amber-500/10 via-amber-400/5 to-transparent p-5 transition hover:border-amber-400/50 hover:bg-amber-400/10"
            href="/admin"
          >
            <div className="flex items-center gap-3">
              <ShieldCheck aria-hidden className="size-5 text-amber-300" />
              <p className="font-heading text-paper">Backoffice admin</p>
            </div>
            <p className="mt-3 text-paper-dim text-sm leading-6">
              Vérifie les pros, modère les trajets, suis les paiements et gère
              la Famille Mboka.
            </p>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.25em] text-amber-200">
              Accéder au backoffice →
            </p>
          </Link>
        ) : (
          <div className="mt-4 rounded-3xl border border-blood/20 bg-blood/5 p-5">
            <div className="flex items-center gap-3">
              <Bell aria-hidden className="size-5 text-blood" />
              <p className="font-heading text-paper">Rappel</p>
            </div>
            <p className="mt-3 text-paper-dim text-sm leading-6">
              Les contacts restent floutés tant qu&apos;ils ne sont pas
              débloqués par un achat Mboka Hub.
            </p>
          </div>
        )}
      </aside>

      <section>{children}</section>
    </div>
  );
}
