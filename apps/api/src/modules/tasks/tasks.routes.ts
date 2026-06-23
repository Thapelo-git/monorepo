import { Router } from "express";
import { prisma } from "@repo/database";
import { verifyToken, AuthRequest } from "../../middleware/auth.middleware.js";
import { notify, getWeddingParticipants } from "../../lib/notify.js";

const router = Router();

router.post("/", verifyToken, async (req: AuthRequest, res) => {
  try {
    const { title, description, status, priority, dueDate, weddingId } = req.body;
    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: status ?? "todo",
        priority: priority ?? "medium",
        dueDate: new Date(dueDate),
        weddingId,
        createdById: req.userId!,
      },
      include: { wedding: { select: { name: true } } },
    });

    // Notify everyone in this wedding except the creator
    const { plannerId, memberIds } = await getWeddingParticipants(weddingId);
    const others = [plannerId, ...memberIds].filter((id) => id && id !== req.userId) as string[];
    if (others.length > 0) {
      const dueDateStr = new Date(dueDate).toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" });
      await notify({
        userIds: others,
        title: "New Task Added",
        message: `"${title}" was added to ${(task as any).wedding?.name ?? "your wedding"} — due ${dueDateStr}.`,
        type: "task_update",
        weddingId,
      });
    }

    res.json(task);
  } catch (error) {
    res.status(400).json({ error: (error as any).message });
  }
});

router.get("/assigned", verifyToken, async (req: AuthRequest, res) => {
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
      where: { weddingId: req.params["weddingId"] as string },
      include: { createdBy: true, assignedTo: true },
    });
    res.json(tasks);
  } catch (error) {
    res.status(400).json({ error: (error as any).message });
  }
});

router.patch("/:id", verifyToken, async (req: AuthRequest, res) => {
  try {
    const data = { ...req.body };
    if (data.dueDate) data.dueDate = new Date(data.dueDate);

    const task = await prisma.task.update({
      where: { id: req.params["id"] as string },
      data,
      include: { wedding: { select: { id: true, name: true } } },
    });

    // Notify others when status changes
    if (req.body.status) {
      const { plannerId, memberIds } = await getWeddingParticipants(task.weddingId);
      const others = [plannerId, ...memberIds].filter((id) => id && id !== req.userId) as string[];
      if (others.length > 0) {
        const statusLabel: Record<string, string> = {
          todo: "To Do", inprogress: "In Progress", waiting: "Waiting", completed: "Completed",
        };
        await notify({
          userIds: others,
          title: "Task Updated",
          message: `"${task.title}" was moved to ${statusLabel[req.body.status] ?? req.body.status}.`,
          type: "task_update",
          weddingId: task.weddingId,
        });
      }
    }

    res.json(task);
  } catch (error) {
    res.status(400).json({ error: (error as any).message });
  }
});

router.delete("/:id", verifyToken, async (req: AuthRequest, res) => {
  try {
    const task = await prisma.task.findUnique({ where: { id: req.params["id"] as string } });
    if (task) {
      const { plannerId, memberIds } = await getWeddingParticipants(task.weddingId);
      const others = [plannerId, ...memberIds].filter((id) => id && id !== req.userId) as string[];
      if (others.length > 0) {
        await notify({
          userIds: others,
          title: "Task Removed",
          message: `"${task.title}" was deleted from the wedding plan.`,
          type: "task_update",
          weddingId: task.weddingId,
        });
      }
    }
    await prisma.task.delete({ where: { id: req.params["id"] as string } });
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: (error as any).message });
  }
});

export default router;
