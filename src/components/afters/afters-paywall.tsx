import { Crown, Lock, Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

type Props = {
  totalCount: number;
  isAuthenticated: boolean;
};

export function AftersPaywall({ totalCount, isAuthenticated }: Props) {
  return (
    <div className="relative mx-auto max-w-3xl py-20 text-center">
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 size-[400px] rounded-full bg-blood/10 blur-[120px] pointer-events-none" />

      <div className="relative inline-flex size-16 items-center justify-center rounded-2xl border border-blood/30 bg-blood/10 text-blood">
        <Lock className="size-7" />
      </div>

      <p className="relative mt-6 font-mono text-[10px] uppercase tracking-[0.4em] text-ember">
        Accès réservé
      </p>
      <h1 className="relative mt-3 font-display text-5xl uppercase leading-[0.95] text-paper sm:text-6xl">
        Les <span className="font-serif italic text-ember">Afters</span> sont
        réservés aux{" "}
        <span className="text-blood">VIP</span>
      </h1>

      <p className="relative mx-auto mt-6 max-w-xl font-body text-paper-dim leading-relaxed">
        {totalCount > 0 ? (
          <>
            <span className="font-semibold text-paper">{totalCount}</span>{" "}
            soirée{totalCount > 1 ? "s" : ""} validée
            {totalCount > 1 ? "s" : ""} par le Hub t&apos;attendent. Passe VIP
            pour débloquer toutes les fiches : lieu exact, line-up, billetterie
            et accès prioritaire.
          </>
        ) : (
          <>
            Les soirées after-concert validées par le Hub sont réservées aux
            membres VIP. Passe VIP pour y accéder dès leur publication.
          </>
        )}
      </p>

      <div className="relative mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Button
          asChild
          size="lg"
          className="h-14 px-8 bg-blood text-paper shadow-glow-blood hover:bg-blood/90"
        >
          <Link href="/vip">
            <Crown className="mr-2 size-5" />
            {isAuthenticated ? "Passer VIP" : "Découvrir le VIP"}
          </Link>
        </Button>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="h-14 px-8 border-ember/40 text-ember hover:bg-ember hover:text-paper"
        >
          <Link href="/afters/organiser">
            <Plus className="mr-2 size-4" />
            Proposer un after
          </Link>
        </Button>
      </div>

      {!isAuthenticated && (
        <p className="relative mt-8 text-sm text-paper-mute">
          Déjà VIP ?{" "}
          <Link
            href="/sign-in?redirect_url=/afters"
            className="text-ember underline-offset-4 hover:underline"
          >
            Connecte-toi
          </Link>
          .
        </p>
      )}

      <p className="relative mt-12 font-mono text-[10px] uppercase tracking-widest text-paper-mute">
        VIP à partir de 6,99 € · Accès illimité aux afters, contacts pros et
        bonus Stade de France
      </p>
    </div>
  );
}
