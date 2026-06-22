import { Router } from "express";
import { prisma } from "@repo/database";
import { AuthRequest } from "../../middleware/auth.middleware.js";

const router = Router();

router.get("/:weddingId", async (req: AuthRequest, res) => {
  try {
    const messages = await prisma.chatMessage.findMany({
      where: { weddingId: req.params["weddingId"] as string },
      include: { user: { select: { id: true, name: true, role: true } } },
      orderBy: { createdAt: "asc" },
    });
    res.json(messages);
  } catch (error) {
    res.status(400).json({ error: (error as any).message });
  }
});

router.post("/:weddingId", async (req: AuthRequest, res) => {
  try {
    const message = await prisma.chatMessage.create({
      data: {
        text: req.body.text,
        userId: req.userId!,
        weddingId: req.params["weddingId"] as string,
      },
      include: { user: { select: { id: true, name: true, role: true } } },
    });
    res.json(message);
  } catch (error) {
    res.status(400).json({ error: (error as any).message });
  }
});

export default router;
