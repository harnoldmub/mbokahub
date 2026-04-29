"use client";

import { useFormStatus } from "react-dom";

import { sendPhotoReminderAction } from "@/lib/actions/admin";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className="rounded-full bg-yellow-500/15 px-2 py-0.5 text-[11px] text-yellow-200 hover:bg-yellow-500/25 disabled:cursor-not-allowed disabled:opacity-60"
      title="Envoyer un email « ajoute tes photos » à ce prestataire"
    >
      {pending ? "📸 Envoi…" : "📸 Rappeler photos"}
    </button>
  );
}

export function PhotoReminderButton({ proId }: { proId: string }) {
  return (
    <form action={sendPhotoReminderAction.bind(null, proId)}>
      <SubmitButton />
    </form>
  );
}
