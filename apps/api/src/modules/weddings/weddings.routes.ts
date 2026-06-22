import { Router } from "express";
import { prisma } from "@repo/database";
import { verifyToken, AuthRequest } from "../../middleware/auth.middleware.js";

const router = Router();

const weddingInclude = {
  tasks: true,
  vendors: true,
  members: {
    include: {
      user: { select: { id: true, name: true, email: true, role: true } },
    },
  },
};

// Only planners can create weddings
router.post("/", async (req: AuthRequest, res) => {
  try {
    if (req.userRole !== "planner") {
      return res.status(403).json({ error: "Only planners can create weddings" });
    }
    const { name, weddingDate, venue, budget } = req.body;
    const wedding = await prisma.wedding.create({
      data: { name, weddingDate: new Date(weddingDate), venue, budget: parseFloat(budget), plannerId: req.userId! },
      include: weddingInclude,
    });
    res.json(wedding);
  } catch (error) {
    res.status(400).json({ error: (error as any).message });
  }
});

// Returns weddings the user planned OR was invited to as a couple
router.get("/", async (req: AuthRequest, res) => {
  try {
    const weddings = await prisma.wedding.findMany({
      where: {
        OR: [
          { plannerId: req.userId },
          { members: { some: { userId: req.userId } } },
        ],
      },
      include: weddingInclude,
    });
    res.json(weddings);
  } catch (error) {
    res.status(400).json({ error: (error as any).message });
  }
});

// Only returns the wedding if the user is the planner or a member
router.get("/:id", async (req: AuthRequest, res) => {
  try {
    const wedding = await prisma.wedding.findFirst({
      where: {
        id: req.params['id'] as string,
        OR: [
          { plannerId: req.userId },
          { members: { some: { userId: req.userId } } },
        ],
      },
      include: weddingInclude,
    });
    if (!wedding) return res.status(404).json({ error: "Wedding not found" });
    res.json(wedding);
  } catch (error) {
    res.status(400).json({ error: (error as any).message });
  }
});

export default router;
