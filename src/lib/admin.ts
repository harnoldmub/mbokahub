import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { syncClerkUser } from "@/lib/user-sync";

function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export async function isAdminEmail(email?: string | null): Promise<boolean> {
  if (!email) return false;
  return getAdminEmails().includes(email.toLowerCase());
}

export async function requireAdmin() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in?redirect_url=/admin");

  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress?.toLowerCase();

  const adminEmails = getAdminEmails();
  const isWhitelisted = !!email && adminEmails.includes(email);

  let dbUser = email
    ? await syncClerkUser({
        clerkId: userId,
        email,
        name: user?.fullName ?? null,
      })
    : await prisma.user.findUnique({ where: { clerkId: userId } });

  if (dbUser && isWhitelisted && dbUser.role !== "ADMIN") {
    dbUser = await prisma.user.update({
      where: { id: dbUser.id },
      data: { role: "ADMIN" },
    });
  }

  if (!isWhitelisted) {
    if (dbUser && dbUser.role === "ADMIN") {
      await prisma.user.update({
        where: { id: dbUser.id },
        data: { role: "FAN" },
      });
    }
    redirect("/?admin=forbidden");
  }

  if (!dbUser) {
    redirect("/?admin=forbidden");
  }

  return { user: dbUser, clerkUserId: userId, email };
}
