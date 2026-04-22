"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/db/prisma";

export async function deleteAccountAction(formData: FormData) {
  const confirmation = formData.get("confirmation");

  if (confirmation !== "SUPPRIMER") {
    redirect("/dashboard/parametres?error=confirmation");
  }

  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  await prisma.user.deleteMany({
    where: {
      clerkId: userId,
    },
  });

  const clerk = await clerkClient();
  await clerk.users.deleteUser(userId);

  redirect("/");
}
