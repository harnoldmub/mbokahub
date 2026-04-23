import { Prisma, type User } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";

type SyncInput = {
  clerkId: string;
  email: string;
  name: string | null;
};

export async function syncClerkUser({
  clerkId,
  email,
  name,
}: SyncInput): Promise<User> {
  const normalizedEmail = email.toLowerCase();

  const byClerk = await prisma.user.findUnique({ where: { clerkId } });
  if (byClerk) {
    if (byClerk.email !== normalizedEmail || byClerk.name !== name) {
      return prisma.user.update({
        where: { id: byClerk.id },
        data: { email: normalizedEmail, name },
      });
    }
    return byClerk;
  }

  const byEmail = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });
  if (byEmail) {
    return prisma.user.update({
      where: { id: byEmail.id },
      data: { clerkId, name: name ?? byEmail.name },
    });
  }

  try {
    return await prisma.user.create({
      data: { clerkId, email: normalizedEmail, name },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const existing =
        (await prisma.user.findUnique({ where: { clerkId } })) ??
        (await prisma.user.findUnique({ where: { email: normalizedEmail } }));
      if (existing) {
        return prisma.user.update({
          where: { id: existing.id },
          data: { clerkId, email: normalizedEmail, name: name ?? existing.name },
        });
      }
    }
    throw error;
  }
}
