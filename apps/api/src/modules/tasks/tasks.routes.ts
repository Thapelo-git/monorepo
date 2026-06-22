import { Router } from "express";
import { prisma } from "@repo/database";
import { verifyToken, AuthRequest } from "../../middleware/auth.middleware.js";

const router = Router();

router.post("/", verifyToken, async (req: AuthRequest, res) => {
  try {
    const { title, description, status, priority, dueDate, weddingId } = req.body;
    const task = await prisma.task.create({
      data: { title, description, status, priority, dueDate: new Date(dueDate), weddingId, createdById: req.userId },
    });
    res.json(task);
  } catch (error) {
    res.status(400).json({ error: (error as any).message });
  }
});

router.get("/assigned", async (req: AuthRequest, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { assignedToId: req.userId },
      include: { wedding: { select: { id: true, name: true } } },
      orderBy: { dueDate: "asc" },
    });
    res.json(tasks);
  } catch (error) {
    res.status(400).json({ error: (error as any).message });
  }
});

router.get("/wedding/:weddingId", verifyToken, async (req: AuthRequest, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { weddingId: req.params['weddingId'] as string },
      include: { createdBy: true, assignedTo: true },
    });
    res.json(tasks);
  } catch (error) {
    res.status(400).json({ error: (error as any).message });
  }
});

router.patch("/:id", verifyToken, async (req: AuthRequest, res) => {
  try {
    const task = await prisma.task.update({ where: { id: req.params['id'] as string }, data: req.body });
    res.json(task);
  } catch (error) {
    res.status(400).json({ error: (error as any).message });
  }
});

export default router;