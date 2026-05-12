"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { sendMessageAction } from "@/lib/actions/messages";

type Message = {
  id: string;
  senderId: string;
  body: string;
  readAt: string | null;
  createdAt: string;
};

export function MessageThreadClient({
  conversationId,
  myId,
  initialMessages,
  otherName,
}: {
  conversationId: string;
  myId: string;
  initialMessages: Message[];
  otherName: string;
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const poll = useCallback(async () => {
    try {
      const res = await fetch(`/api/messages/${conversationId}`, {
        cache: "no-store",
      });
      if (!res.ok) return;
      const data = await res.json();
      setMessages(data.messages);
    } catch {}
  }, [conversationId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Poll every 5 seconds
  useEffect(() => {
    const interval = setInterval(poll, 5000);
    return () => clearInterval(interval);
  }, [poll]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setSending(true);
    setError(null);
    const result = await sendMessageAction(conversationId, body);
    setSending(false);
    if (!result.ok) {
      setError(result.error ?? "Erreur lors de l'envoi.");
      return;
    }
    setBody("");
    await poll();
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 overflow-y-auto rounded-2xl border border-white/10 bg-coal p-4 min-h-[320px] max-h-[60vh]">
        {messages.length === 0 && (
          <p className="m-auto text-sm text-paper-mute">
            Commencez la conversation avec {otherName}.
          </p>
        )}
        {messages.map((msg) => {
          const isMine = msg.senderId === myId;
          return (
            <div
              key={msg.id}
              className={`flex ${isMine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  isMine
                    ? "bg-blood text-white rounded-br-sm"
                    : "bg-smoke text-paper rounded-bl-sm"
                }`}
              >
                <p className="whitespace-pre-wrap break-words">{msg.body}</p>
                <time
                  className={`mt-1 block font-mono text-[9px] ${isMine ? "text-white/60" : "text-paper-mute"}`}
                >
                  {new Intl.DateTimeFormat("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  }).format(new Date(msg.createdAt))}
                </time>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="flex gap-2">
        <textarea
          className="min-h-[52px] flex-1 resize-none rounded-2xl border border-white/10 bg-coal px-4 py-3 text-sm text-paper outline-none transition focus:border-blood/40 placeholder:text-paper-mute"
          disabled={sending}
          maxLength={2000}
          onChange={(e) => setBody(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              e.currentTarget.form?.requestSubmit();
            }
          }}
          placeholder="Votre message…"
          rows={2}
          value={body}
        />
        <button
          className="self-end rounded-2xl bg-blood px-5 py-3 text-sm font-medium text-white transition hover:bg-blood/80 disabled:opacity-50"
          disabled={sending || !body.trim()}
          type="submit"
        >
          {sending ? "…" : "Envoyer"}
        </button>
      </form>

      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}
