import { MessageSquare } from "lucide-react";
import Link from "next/link";

import { getDashboardUser } from "@/lib/dashboard";
import { prisma } from "@/lib/db/prisma";

export const metadata = { title: "Messages — Mboka Hub" };

export default async function MessagesPage() {
  const me = await getDashboardUser();

  const conversations = await prisma.conversation.findMany({
    where: { OR: [{ clientId: me.id }, { proId: me.id }] },
    orderBy: { lastMessageAt: "desc" },
    include: {
      client: { select: { id: true, name: true, email: true } },
      pro: { select: { id: true, name: true, email: true } },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { body: true, createdAt: true },
      },
    },
  });

  if (conversations.length === 0) {
    return (
      <div className="rounded-3xl border border-white/10 bg-coal p-8 text-center">
        <MessageSquare aria-hidden className="mx-auto mb-4 size-10 text-paper-mute" />
        <p className="font-heading text-xl text-paper">Aucun message</p>
        <p className="mt-2 text-sm text-paper-dim">
          Vos échanges avec les prestataires apparaîtront ici.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h1 className="font-heading text-2xl text-paper">Messages</h1>
      <ul className="space-y-2">
        {conversations.map((conv) => {
          const other = conv.clientId === me.id ? conv.pro : conv.client;
          const unread = conv.clientId === me.id ? conv.clientUnread : conv.proUnread;
          const last = conv.messages[0];

          return (
            <li key={conv.id}>
              <Link
                href={`/dashboard/messages/${conv.id}`}
                className="flex items-start gap-4 rounded-2xl border border-white/10 bg-smoke/40 px-5 py-4 transition hover:border-blood/30 hover:bg-blood/5"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blood/10 font-heading text-sm text-blood">
                  {(other?.name ?? other?.email ?? "?")[0].toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate font-heading text-paper">
                      {other?.name ?? other?.email ?? "Utilisateur"}
                    </p>
                    {last && (
                      <time className="shrink-0 font-mono text-[10px] text-paper-mute">
                        {new Intl.DateTimeFormat("fr-FR", {
                          day: "numeric",
                          month: "short",
                        }).format(new Date(last.createdAt))}
                      </time>
                    )}
                  </div>
                  <p className="mt-0.5 truncate text-sm text-paper-dim">
                    {last?.body ?? "Aucun message"}
                  </p>
                </div>
                {unread > 0 && (
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-blood font-mono text-[10px] text-white">
                    {unread > 9 ? "9+" : unread}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
