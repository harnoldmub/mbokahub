import { Crown } from "lucide-react";

import { isCurrentUserVip, getOptionalDbUser } from "@/lib/auth-helpers";

type Props = {
  message?: string;
};

export async function VipMemberBanner({ message }: Props) {
  const isVip = await isCurrentUserVip();
  if (!isVip) return null;
  const user = await getOptionalDbUser();
  const until = user?.vipUntil
    ? user.vipUntil.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-400/40 bg-gradient-to-r from-amber-500/15 via-amber-400/10 to-amber-500/15 px-5 py-3">
      <div className="flex items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-full bg-amber-400/20 text-amber-300">
          <Crown aria-hidden className="size-5" />
        </span>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-amber-200">
            Famille Mboka VIP
          </p>
          <p className="font-body text-paper text-sm">
            {message ??
              "Tous les contacts WhatsApp sont débloqués pour toi."}
          </p>
        </div>
      </div>
      {until ? (
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber-200/80">
          Valide jusqu&apos;au {until}
        </p>
      ) : null}
    </div>
  );
}
