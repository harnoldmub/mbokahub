import { UserButton } from "@clerk/nextjs";
import {
  BarChart3,
  Bell,
  Contact,
  LayoutDashboard,
  Megaphone,
  Settings,
} from "lucide-react";
import { DashboardNav } from "@/components/dashboard/nav";
import { Badge } from "@/components/ui/badge";
import { getDashboardUser } from "@/lib/dashboard";

const dashboardNav = [
  { href: "/dashboard", label: "Vue d'ensemble", icon: LayoutDashboard },
  { href: "/dashboard/contacts", label: "Contacts", icon: Contact },
  { href: "/dashboard/annonces", label: "Annonces", icon: Megaphone },
  { href: "/dashboard/stats", label: "Stats", icon: BarChart3 },
  { href: "/dashboard/parametres", label: "Paramètres", icon: Settings },
] as const;

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getDashboardUser();

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
            <Badge variant="outline">{user.role}</Badge>
          </div>

          <DashboardNav items={dashboardNav} />
        </div>

        <div className="mt-4 rounded-3xl border border-blood/20 bg-blood/5 p-5">
          <div className="flex items-center gap-3">
            <Bell aria-hidden className="size-5 text-blood" />
            <p className="font-heading text-paper">Rappel</p>
          </div>
          <p className="mt-3 text-paper-dim text-sm leading-6">
            Les contacts restent floutés tant qu'ils ne sont pas débloqués par
            un achat Mboka Hub.
          </p>
        </div>
      </aside>

      <section>{children}</section>
    </div>
  );
}
