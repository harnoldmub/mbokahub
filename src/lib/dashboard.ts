import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/db/prisma";

function getDisplayName(firstName: string | null, lastName: string | null) {
  return [firstName, lastName].filter(Boolean).join(" ").trim() || null;
}

export async function getDashboardUser() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const clerkUser = await currentUser();
  const email = clerkUser?.primaryEmailAddress?.emailAddress;

  if (!email) {
    redirect("/sign-in");
  }

  return prisma.user.upsert({
    create: {
      clerkId: userId,
      email,
      name: getDisplayName(clerkUser.firstName, clerkUser.lastName),
    },
    update: {
      email,
      name: getDisplayName(clerkUser.firstName, clerkUser.lastName),
    },
    where: {
      clerkId: userId,
    },
  });
}

export function formatDate(value: Date | null | undefined) {
  if (!value) {
    return "Non défini";
  }

  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
  }).format(value);
}

export function formatMoney(value: number) {
  return new Intl.NumberFormat("fr-FR", {
    currency: "EUR",
    style: "currency",
  }).format(value);
}
