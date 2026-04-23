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

  const name = getDisplayName(clerkUser.firstName, clerkUser.lastName);

  const existingByClerkId = await prisma.user.findUnique({
    where: { clerkId: userId },
  });
  if (existingByClerkId) {
    return prisma.user.update({
      where: { clerkId: userId },
      data: { email, name },
    });
  }

  const existingByEmail = await prisma.user.findUnique({
    where: { email },
  });
  if (existingByEmail) {
    return prisma.user.update({
      where: { id: existingByEmail.id },
      data: { clerkId: userId, name },
    });
  }

  return prisma.user.create({
    data: { clerkId: userId, email, name },
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
