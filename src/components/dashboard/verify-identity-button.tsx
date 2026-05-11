"use client";

import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";

export function VerifyIdentityButton() {
  return (
    <Button asChild variant="outline" size="sm" className="gap-2">
      <a href="mailto:contact@mbokahub.com?subject=Vérification%20Identité%20Prestataire&body=Bonjour,%20merci%20de%20vérifier%20mon%20identité.%20Je%20vous%20envoie%20ma%20pièce%20d'identité%20en%20pièce%20jointe.">
        <ShieldCheck className="size-4" />
        Demander la vérification (Gratuit)
      </a>
    </Button>
  );
}
