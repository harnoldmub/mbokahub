"use client";

import { MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { startConversationAction } from "@/lib/actions/messages";

export function ContactProButton({
  proUserId,
  isSignedIn,
  label = "Envoyer un message",
}: {
  proUserId: string;
  isSignedIn: boolean;
  label?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (!isSignedIn) {
      router.push("/sign-in?redirect_url=/dashboard/messages");
      return;
    }
    setLoading(true);
    const res = await startConversationAction(proUserId);
    setLoading(false);
    if (res.ok && res.conversationId) {
      router.push(`/dashboard/messages/${res.conversationId}`);
    }
  }

  return (
    <button
      className="inline-flex items-center gap-2 rounded-2xl bg-blood px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blood/80 disabled:opacity-50"
      disabled={loading}
      onClick={handleClick}
      type="button"
    >
      <MessageSquare aria-hidden className="size-4" />
      {loading ? "Chargement…" : label}
    </button>
  );
}
