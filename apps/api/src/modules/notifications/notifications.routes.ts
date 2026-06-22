import { Router } from "express";
import { prisma } from "@repo/database";
import { AuthRequest } from "../../middleware/auth.middleware.js";

const router = Router();

router.get("/", async (req: AuthRequest, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: "desc" },
      include: { wedding: { select: { id: true, name: true } } },
    });
    res.json(notifications);
  } catch (error) {
    res.status(400).json({ error: (error as any).message });
  }
});

router.patch("/:id/read", async (req: AuthRequest, res) => {
  try {
    await prisma.notification.updateMany({
      where: { id: req.params["id"] as string, userId: req.userId },
      data: { read: true },
    });
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: (error as any).message });
  }
});

export default router;
