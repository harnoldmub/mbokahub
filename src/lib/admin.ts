import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";

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

  let dbUser = await prisma.user.findUnique({ where: { clerkId: userId } });

  if (!dbUser && email) {
    const existingByEmail = await prisma.user.findUnique({ where: { email } });
    if (existingByEmail) {
      dbUser = await prisma.user.update({
        where: { id: existingByEmail.id },
        data: {
          clerkId: userId,
          name: user?.fullName ?? existingByEmail.name,
          role: isWhitelisted ? "ADMIN" : existingByEmail.role,
        },
      });
    } else {
      dbUser = await prisma.user.create({
        data: {
          clerkId: userId,
          email,
          name: user?.fullName ?? null,
          role: isWhitelisted ? "ADMIN" : "FAN",
        },
      });
    }
  } else if (dbUser && isWhitelisted && dbUser.role !== "ADMIN") {
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
