import { FileText, ExternalLink, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Fiscalité - Dashboard",
};

export default function FiscalitePage() {
  return (
    <div className="grid gap-6">
      <div>
        <h1 className="font-heading text-3xl text-paper">Fiscalité</h1>
        <p className="mt-2 text-paper-dim">
          Gérez vos déclarations et restez en règle avec l'administration.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-coal p-6">
          <div className="grid size-12 place-items-center rounded-xl bg-blood/10 text-blood">
            <FileText className="size-6" />
          </div>
          <h2 className="mt-5 font-heading text-xl text-paper">
            Récapitulatif de revenus
          </h2>
          <p className="mt-2 text-sm text-paper-dim">
            Téléchargez l'historique de vos réservations pour faciliter votre déclaration de revenus.
          </p>
          <Button variant="outline" className="mt-6 w-full" disabled>
            Bientôt disponible
          </Button>
        </div>

        <div className="rounded-3xl border border-white/10 bg-coal p-6">
          <div className="grid size-12 place-items-center rounded-xl bg-emerald-500/10 text-emerald-400">
            <ShieldCheck className="size-6" />
          </div>
          <h2 className="mt-5 font-heading text-xl text-paper">
            Accompagnement Pro
          </h2>
          <p className="mt-2 text-sm text-paper-dim">
            Besoin d'aide pour vos impôts ? Découvrez notre partenaire pour l'automatisation de votre comptabilité.
          </p>
          <Button asChild className="mt-6 w-full" variant="outline">
            <a href="https://www.indy.fr/" target="_blank" rel="noreferrer">
              Découvrir Indy <ExternalLink className="ml-2 size-4" />
            </a>
          </Button>
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-blood/20 bg-blood/5 p-6">
        <h3 className="font-heading text-lg text-paper">Rappel légal</h3>
        <p className="mt-2 text-sm leading-relaxed text-paper-dim">
          En tant que prestataire indépendant sur Mboka Hub, vous êtes responsable de la déclaration de tous vos revenus générés via la plateforme auprès de l'administration fiscale de votre pays de résidence. Mboka Hub transmettra prochainement un récapitulatif annuel pour vous aider dans cette démarche.
        </p>
      </div>
    </div>
  );
}
