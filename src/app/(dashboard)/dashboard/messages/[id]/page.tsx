import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { MessageThreadClient } from "@/components/messages/message-thread-client";
import { markConversationReadAction } from "@/lib/actions/messages";
import { getDashboardUser } from "@/lib/dashboard";
import { prisma } from "@/lib/db/prisma";

export const metadata = { title: "Conversation — Mboka Hub" };

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const me = await getDashboardUser();

  const conv = await prisma.conversation.findUnique({
    where: { id },
    include: {
      client: { select: { id: true, name: true, email: true } },
      pro: { select: { id: true, name: true, email: true } },
      messages: {
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          senderId: true,
          body: true,
          readAt: true,
          createdAt: true,
        },
      },
    },
  });

  if (!conv || (conv.clientId !== me.id && conv.proId !== me.id)) notFound();

  await markConversationReadAction(id);

  const other = conv.clientId === me.id ? conv.pro : conv.client;
  const otherName = other?.name ?? other?.email ?? "Utilisateur";

  return (
    <div className="space-y-4">
      <Link
        className="inline-flex items-center gap-1 text-sm text-paper-dim transition hover:text-paper"
        href="/dashboard/messages"
      >
        <ChevronLeft className="size-4" aria-hidden />
        Retour aux messages
      </Link>

      <div className="rounded-3xl border border-white/10 bg-coal p-6">
        <h1 className="mb-4 font-heading text-xl text-paper">{otherName}</h1>
        <MessageThreadClient
          conversationId={id}
          myId={me.id}
          initialMessages={conv.messages.map((m) => ({
            ...m,
            readAt: m.readAt?.toISOString() ?? null,
            createdAt: m.createdAt.toISOString(),
          }))}
          otherName={otherName}
        />
      </div>
    </div>
  );
}
