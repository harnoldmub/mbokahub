import { redirect } from "next/navigation";

import { isAdminEmail } from "@/lib/admin";
import { getDashboardUser } from "@/lib/dashboard";
import { prisma } from "@/lib/db/prisma";

export type ResolvedProTarget = {
  user: Awaited<ReturnType<typeof getDashboardUser>>;
  isAdminActingAs: boolean;
  actingAsProId: string | null;
  proUserId: string;
  proProfileId: string | null;
  ownerEmail: string | null;
  ownerName: string | null;
  ownerDisplay: string | null;
};

/**
 * Resolves which pro profile the current dashboard request targets.
 *
 * - If `actingAsProId` is provided AND the current user is an admin, the
 *   profile of that arbitrary pro is loaded and returned (admin "agit au nom
 *   de…" mode).
 * - Otherwise we resolve the profile owned by the current user.
 *
 * Non-admins passing `actingAsProId` are silently ignored (we fall back to
 * their own profile) so the URL parameter is harmless when shared.
 */
export async function resolveProTarget(
  actingAsProId?: string | null,
): Promise<ResolvedProTarget> {
  const user = await getDashboardUser();
  const cleaned = actingAsProId?.trim() || null;

  if (cleaned) {
    const isAdmin = await isAdminEmail(user.email);
    if (isAdmin) {
      const target = await prisma.proProfile.findUnique({
        where: { id: cleaned },
        include: { user: { select: { email: true, name: true } } },
      });
      if (!target) redirect("/admin/pros?error=pro-not-found");
      return {
        user,
        isAdminActingAs: true,
        actingAsProId: target.id,
        proUserId: target.userId,
        proProfileId: target.id,
        ownerEmail: target.user.email,
        ownerName: target.user.name ?? null,
        ownerDisplay: target.displayName,
      };
    }
  }

  return {
    user,
    isAdminActingAs: false,
    actingAsProId: null,
    proUserId: user.id,
    proProfileId: null,
    ownerEmail: user.email,
    ownerName: user.name ?? null,
    ownerDisplay: user.name ?? null,
  };
}

/**
 * Structured server log for any admin action performed in act-as-a-pro mode.
 * Always called from server actions immediately after the DB write succeeds.
 * Keeps a permanent trace tying admin email + target pro + action name.
 */
export function logActAs(
  action: string,
  ctx: {
    actingAs: string | null;
    adminEmail?: string | null;
    targetUserId?: string | null;
    extra?: Record<string, unknown>;
  },
): void {
  if (!ctx.actingAs) return;
  console.log(
    `[admin-act-as] action=${action} admin=${ctx.adminEmail ?? "?"} ` +
      `targetProId=${ctx.actingAs} targetUserId=${ctx.targetUserId ?? "?"} ` +
      `at=${new Date().toISOString()}` +
      (ctx.extra ? ` extra=${JSON.stringify(ctx.extra)}` : ""),
  );
}

export function asQuery(actingAsProId?: string | null): string {
  return actingAsProId ? `?as=${encodeURIComponent(actingAsProId)}` : "";
}

export function withAs(
  path: string,
  actingAsProId: string | null | undefined,
  extraParams?: Record<string, string | undefined>,
): string {
  const params = new URLSearchParams();
  if (actingAsProId) params.set("as", actingAsProId);
  if (extraParams) {
    for (const [k, v] of Object.entries(extraParams)) {
      if (v != null && v !== "") params.set(k, v);
    }
  }
  const qs = params.toString();
  return qs ? `${path}?${qs}` : path;
}

/**
 * Server-action helper: resolves the pro profile the form should target.
 *
 * Reads a hidden `_actingAs` form field. If present AND the current user is
 * an admin, the action operates on that arbitrary pro; otherwise the action
 * targets the current user's own profile (or redirects to `/pro/inscrire`).
 */
export async function resolveProForAction(form: FormData): Promise<{
  user: Awaited<ReturnType<typeof getDashboardUser>>;
  pro: NonNullable<Awaited<ReturnType<typeof prisma.proProfile.findUnique>>>;
  actingAs: string | null;
  isAdminActingAs: boolean;
}> {
  const user = await getDashboardUser();
  const actingAsRaw = String(form.get("_actingAs") || "").trim();
  if (actingAsRaw) {
    const isAdmin = await isAdminEmail(user.email);
    if (isAdmin) {
      const pro = await prisma.proProfile.findUnique({
        where: { id: actingAsRaw },
      });
      if (!pro) redirect("/admin/pros?error=pro-not-found");
      return { user, pro, actingAs: pro.id, isAdminActingAs: true };
    }
  }
  const pro = await prisma.proProfile.findUnique({
    where: { userId: user.id },
  });
  if (!pro) redirect("/pro/inscrire");
  return { user, pro, actingAs: null, isAdminActingAs: false };
}
