import { UserButton } from "@clerk/nextjs";
import { Bell, ShieldCheck, Star } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AdminAsProBannerSticky } from "@/components/admin/admin-as-pro-banner-sticky";
import { DashboardNav } from "@/components/dashboard/nav";
import { Badge } from "@/components/ui/badge";
import { isAdminEmail } from "@/lib/admin";
import { getDashboardUser } from "@/lib/dashboard";
import { prisma } from "@/lib/db/prisma";

export const metadata: Metadata = {
  title: "Mon espace",
  robots: { index: false, follow: false, noarchive: true },
};

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getDashboardUser();
  const isAdmin = user.role === "ADMIN" || (await isAdminEmail(user.email));
  const proProfile = await prisma.proProfile.findUnique({
    where: { userId: user.id },
    select: { id: true },
  });

  let unreadMessages = 0;
  try {
    const [unreadAgg, unreadAggPro] = await Promise.all([
      prisma.conversation.aggregate({
        where: { clientId: user.id },
        _sum: { clientUnread: true },
      }),
      proProfile
        ? prisma.conversation.aggregate({
            where: { proId: proProfile.id },
            _sum: { proUnread: true },
          })
        : Promise.resolve({ _sum: { proUnread: 0 } }),
    ]);
    unreadMessages =
      (unreadAgg._sum.clientUnread ?? 0) + (unreadAggPro._sum.proUnread ?? 0);
  } catch {
    unreadMessages = 0;
  }

  return (
    <div className="min-h-screen bg-coal">
      <Suspense fallback={null}>
        <AdminAsProBannerSticky isAdmin={isAdmin} />
      </Suspense>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-white/10 bg-smoke/40 p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-heading text-2xl text-paper">
                Bonjour, {user.name}
              </p>
              <p className="mt-1 text-paper-dim text-sm">{user.email}</p>
            </div>
            <UserButton />
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <Badge className={user.isVipActive ? "bg-gold text-ink gap-1" : ""}>
              {user.isVipActive ? (
                <>
                  <Star className="size-3 fill-current" aria-hidden="true" />
                  <span>Famille Fondatrice</span>
                </>
              ) : (
                "Fan"
              )}
            </Badge>
            {user.role !== "FAN" || isAdmin ? (
              <Badge
                className={
                  isAdmin
                    ? "border-amber-600 bg-amber-500 text-black"
                    : ""
                }
                variant="outline"
              >
                {isAdmin ? "ADMIN" : user.role}
              </Badge>
            ) : null}
          </div>

          <DashboardNav isAdmin={isAdmin} unreadMessages={unreadMessages} />
        </div>

        {isAdmin ? (
          <Link
            className="mt-4 block rounded-3xl border border-amber-500/40 bg-gradient-to-br from-amber-500/15 via-amber-500/10 to-transparent p-5 transition hover:border-amber-500/70 hover:bg-amber-500/15"
            href="/admin"
          >
            <div className="flex items-center gap-3">
              <ShieldCheck aria-hidden className="size-5 text-amber-500" />
              <p className="font-heading text-paper">Backoffice admin</p>
            </div>
            <p className="mt-3 text-paper-dim text-sm leading-6">
              Vérifie les pros, modère les trajets, suis les paiements et gère
              la communauté Nevent.
            </p>
            <p className="mt-3 font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-amber-600">
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
              L&apos;accès aux trajets, prestataires et afters est gratuit pour
              toute la communauté Nevent. Profite à fond !
            </p>
          </div>
        )}
      </div>

      <section>
        <Suspense fallback={null}>
          <AdminAsProBannerSticky isAdmin={isAdmin} />
        </Suspense>
        {children}
      </section>
    </div>
  );
}
