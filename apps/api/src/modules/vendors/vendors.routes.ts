import { Router } from "express";
import { prisma } from "@repo/database";
import { AuthRequest } from "../../middleware/auth.middleware.js";

const router = Router();

router.get("/", async (req: AuthRequest, res) => {
  try {
    const vendors = await prisma.vendor.findMany({
      where: {
        wedding: {
          OR: [
            { plannerId: req.userId },
            { members: { some: { userId: req.userId } } },
          ],
        },
      },
      include: {
        invoices: true,
        wedding: { select: { id: true, name: true } },
      },
    });
    res.json(vendors);
  } catch (error) {
    res.status(400).json({ error: (error as any).message });
  }
});

router.get("/wedding/:weddingId", async (req: AuthRequest, res) => {
  try {
    const vendors = await prisma.vendor.findMany({
      where: { weddingId: req.params["weddingId"] as string },
      include: { invoices: true },
    });
    res.json(vendors);
  } catch (error) {
    res.status(400).json({ error: (error as any).message });
  }
});

router.post("/wedding/:weddingId", async (req: AuthRequest, res) => {
  try {
    const { name, category, email, phone } = req.body;
    const vendor = await prisma.vendor.create({
      data: { name, category, email, phone, weddingId: req.params["weddingId"] as string },
    });
    res.json(vendor);
  } catch (error) {
    res.status(400).json({ error: (error as any).message });
  }
});

export default router;
