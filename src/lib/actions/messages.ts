"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/db/prisma";

async function getAuthUser() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) redirect("/sign-in");
  return user;
}

export async function startConversationAction(proUserId: string) {
  const me = await getAuthUser();
  if (me.id === proUserId) {
    return { ok: false, error: "Vous ne pouvez pas vous écrire à vous-même." };
  }
  const pro = await prisma.user.findUnique({ where: { id: proUserId } });
  if (!pro) return { ok: false, error: "Utilisateur introuvable." };

  const existing = await prisma.conversation.findFirst({
    where: { clientId: me.id, proId: proUserId, contextType: null },
  });
  if (existing) return { ok: true, conversationId: existing.id };

  const conv = await prisma.conversation.create({
    data: { clientId: me.id, proId: proUserId },
  });
  return { ok: true, conversationId: conv.id };
}

export async function sendMessageAction(conversationId: string, body: string) {
  const trimmed = body.trim();
  if (!trimmed) return { ok: false, error: "Message vide." };
  if (trimmed.length > 2000) return { ok: false, error: "Message trop long." };

  const me = await getAuthUser();
  const conv = await prisma.conversation.findUnique({
    where: { id: conversationId },
  });
  if (!conv) return { ok: false, error: "Conversation introuvable." };
  if (conv.clientId !== me.id && conv.proId !== me.id) {
    return { ok: false, error: "Accès refusé." };
  }

  const isClient = conv.clientId === me.id;

  await prisma.$transaction([
    prisma.message.create({
      data: { conversationId, senderId: me.id, body: trimmed },
    }),
    prisma.conversation.update({
      where: { id: conversationId },
      data: {
        lastMessageAt: new Date(),
        ...(isClient
          ? { proUnread: { increment: 1 } }
          : { clientUnread: { increment: 1 } }),
      },
    }),
  ]);

  revalidatePath(`/dashboard/messages/${conversationId}`);
  return { ok: true };
}

export async function markConversationReadAction(conversationId: string) {
  const me = await getAuthUser();
  const conv = await prisma.conversation.findUnique({
    where: { id: conversationId },
  });
  if (!conv) return;
  if (conv.clientId !== me.id && conv.proId !== me.id) return;

  const isClient = conv.clientId === me.id;
  await prisma.conversation.update({
    where: { id: conversationId },
    data: isClient ? { clientUnread: 0 } : { proUnread: 0 },
  });

  revalidatePath("/dashboard/messages");
}
