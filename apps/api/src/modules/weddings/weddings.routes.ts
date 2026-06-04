import { Router } from "express";
import { PrismaClient } from "database";
import { verifyToken, AuthRequest } from "../../middleware/auth.middleware";

const router = Router();
const prisma = new PrismaClient();

router.post("/", verifyToken, async (req: AuthRequest, res) => {
  try {
    const { name, weddingDate, venue, budget } = req.body;
    const wedding = await prisma.wedding.create({
      data: { name, weddingDate: new Date(weddingDate), venue, budget: parseFloat(budget), plannerId: req.userId },
    });
    res.json(wedding);
  } catch (error) {
    res.status(400).json({ error: (error as any).message });
  }
});

router.get("/", verifyToken, async (req: AuthRequest, res) => {
  try {
    const weddings = await prisma.wedding.findMany({
      where: { plannerId: req.userId },
      include: { tasks: true, vendors: true },
    });
    res.json(weddings);
  } catch (error) {
    res.status(400).json({ error: (error as any).message });
  }
});

router.get("/:id", verifyToken, async (req: AuthRequest, res) => {
  try {
    const wedding = await prisma.wedding.findUnique({
      where: { id: req.params.id },
      include: { tasks: true, vendors: true },
    });
    res.json(wedding);
  } catch (error) {
    res.status(400).json({ error: (error as any).message });
  }
});

export default router;