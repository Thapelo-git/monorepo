import { Router } from "express";
import * as bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "database";

const router = Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "secret";

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcryptjs.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role },
    });
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET);
    res.json({ user: { id: user.id, name, email, role }, token });
  } catch (error) {
    res.status(400).json({ error: (error as any).message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: "Invalid" });
    const valid = await bcryptjs.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Invalid" });
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET);
    res.json({ user: { id: user.id, name: user.name, email, role: user.role }, token });
  } catch (error) {
    res.status(400).json({ error: (error as any).message });
  }
});

export default router;