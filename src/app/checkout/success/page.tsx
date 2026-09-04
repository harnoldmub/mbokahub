import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Activation confirmée",
  robots: { index: false, follow: false },
};

type Search = Promise<{ type?: string; session_id?: string }>;

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Search;
}) {
  const { type } = await searchParams;

  const messages: Record<
    string,
    { title: string; body: string; cta: string; href: string }
  > = {
    // Le pass VIP est retiré : on n'atteint plus ce cas que par un vieux lien
    // ou un marque-page. Le message ne doit donc rien promettre qui n'existe
    // plus — les contacts sont ouverts à tous depuis la bascule.
    vip: {
      title: "Merci — tu fais partie de la Famille Fondatrice",
      body: "Le pass VIP n'existe plus : Nevent est gratuit pour tout le monde, contacts des prestataires compris. Ton badge Famille Fondatrice, lui, te reste à vie.",
      cta: "Voir comment ça marche",
      href: "/vip",
    },
    pro: {
      title: "Mise en avant activée",
      body: "Ta fiche pro est mise en avant gratuitement. Tu peux continuer à la compléter depuis ton tableau de bord.",
      cta: "Compléter mon profil pro",
      href: "/dashboard/profil-pro",
    },
    boost: {
      title: "Boost activé",
      body: "Ton annonce ou ton profil va apparaître en tête de liste pendant 7 jours.",
      cta: "Retour au tableau de bord",
      href: "/dashboard",
    },
  };

  const m = messages[type ?? ""] ?? {
    title: "Activation terminée",
    body: "La fonctionnalité est maintenant active gratuitement sur ton compte.",
    cta: "Retour à l'accueil",
    href: "/",
  };

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 py-16 text-center">
      <div className="grid size-20 place-items-center rounded-full bg-green-500/15 text-green-300">
        <CheckCircle2 aria-hidden className="size-10" />
      </div>
      <h1 className="mt-8 font-display text-4xl text-foreground md:text-5xl">
        {m.title}
      </h1>
      <p className="mt-4 max-w-xl text-muted-foreground text-lg leading-8">
        {m.body}
      </p>
      <Link
        className="mt-10 inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 font-mono text-ink text-sm uppercase tracking-[0.2em] transition hover:bg-primary/90"
        href={m.href}
      >
        {m.cta}
      </Link>
      <p className="mt-6 text-muted-foreground text-xs">
        Aucun paiement n&apos;a été demandé.
      </p>
    </div>
  );
}
