import { CheckCircle2, Clock3, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { requestProfessionalCertificationAction } from "@/lib/actions/verification";

type VerifyIdentityButtonProps = {
  certified?: boolean;
  pending?: boolean;
};

export function VerifyIdentityButton({
  certified,
  pending,
}: VerifyIdentityButtonProps) {
  if (certified) {
    return (
      <Button disabled variant="outline" size="sm" className="gap-2">
        <CheckCircle2 aria-hidden className="size-4" />
        Professionnel certifié
      </Button>
    );
  }

  if (pending) {
    return (
      <Button disabled variant="outline" size="sm" className="gap-2">
        <Clock3 aria-hidden className="size-4" />
        Vérification en cours
      </Button>
    );
  }

  return (
    <form action={requestProfessionalCertificationAction}>
      <Button type="submit" variant="outline" size="sm" className="gap-2">
        <ShieldCheck aria-hidden className="size-4" />
        Demander la certification gratuite
      </Button>
    </form>
  );
}
