import { prisma } from "@repo/database";

export async function getWeddingParticipants(weddingId: string) {
  const wedding = await prisma.wedding.findUnique({
    where: { id: weddingId },
    select: {
      plannerId: true,
      members: { select: { userId: true } },
    },
  });
  if (!wedding) return { plannerId: null, memberIds: [] };
  return {
    plannerId: wedding.plannerId,
    memberIds: wedding.members.map((m) => m.userId),
  };
}

export async function notify({
  userIds,
  title,
  message,
  type,
  weddingId,
}: {
  userIds: string[];
  title: string;
  message: string;
  type: string;
  weddingId?: string;
}) {
  const unique = [...new Set(userIds.filter(Boolean))];
  if (unique.length === 0) return;
  await prisma.notification.createMany({
    data: unique.map((userId) => ({
      userId,
      title,
      message,
      type,
      weddingId: weddingId ?? null,
    })),
    skipDuplicates: false,
  });
}
