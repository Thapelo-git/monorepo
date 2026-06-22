import { Router } from "express";
import * as bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@repo/database";
import { verifyToken, AuthRequest } from "../../middleware/auth.middleware.js";
import { sendInviteEmail } from "../../lib/email.js";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "secret";
const APP_URL = process.env.APP_URL || "http://localhost:3000";

// Planner self-registration
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcryptjs.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role: "planner" },
    });
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET);
    res.json({ user: { id: user.id, name, email, role: user.role }, token });
  } catch (error: any) {
    if (error?.code === "P2002") {
      return res.status(409).json({ error: "An account with this email already exists. Please sign in instead." });
    }
    res.status(400).json({ error: error.message });
  }
});

// Login for all roles
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true, password: true, role: true },
    });
    if (!user) {
      console.log("[login] no account found for:", email);
      return res.status(401).json({ error: "Invalid credentials" });
    }
    if (!user.password) {
      console.log("[login] account has no password set:", email);
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const valid = await bcryptjs.compare(password, user.password);
    console.log("[login] password check:", valid, "| hash:", user.password.substring(0, 7) + "...");
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET);
    res.json({ user: { id: user.id, name: user.name, email, role: user.role }, token });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Validate invite token — used by the accept-invite page to show wedding details
router.get("/invite/:token", async (req, res) => {
  try {
    const invite = await prisma.weddingInvite.findUnique({
      where: { token: req.params["token"] as string },
      include: { wedding: { select: { name: true, weddingDate: true } } },
    });
    if (!invite) return res.status(404).json({ error: "Invite not found" });
    if (invite.used) return res.status(400).json({ error: "This invite has already been used" });
    if (invite.expiresAt < new Date()) return res.status(400).json({ error: "This invite has expired" });
    res.json({
      email: invite.email,
      role: invite.role,
      weddingName: invite.wedding.name,
      weddingDate: invite.wedding.weddingDate,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Planner invites couple — sends email with invite link
router.post("/invite", verifyToken, async (req: AuthRequest, res) => {
  try {
    if (req.userRole !== "planner") {
      return res.status(403).json({ error: "Only planners can send invites" });
    }
    const { weddingId, email, role = "couple" } = req.body;

    const planner = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { name: true },
    });

    const wedding = await prisma.wedding.findUnique({ where: { id: weddingId } });
    if (!wedding || wedding.plannerId !== req.userId) {
      return res.status(403).json({ error: "Wedding not found or access denied" });
    }

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const invite = await prisma.weddingInvite.create({
      data: { email, role, weddingId, expiresAt },
      select: { id: true, token: true, email: true, role: true, expiresAt: true, weddingId: true },
    });

    const inviteLink = `${APP_URL}/auth/accept-invite?token=${invite.token}`;

    await sendInviteEmail({
      to: email,
      inviteLink,
      weddingName: wedding.name,
      plannerName: planner?.name ?? "Your wedding planner",
    });

    res.json({ invite, acceptUrl: inviteLink });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Couple accepts invite — creates account and gains access to the wedding board
router.post("/accept-invite", async (req, res) => {
  try {
    const { token, name, password } = req.body;

    const invite = await prisma.weddingInvite.findUnique({ where: { token } });
    if (!invite) return res.status(400).json({ error: "Invalid invite token" });
    if (invite.used) return res.status(400).json({ error: "Invite already used" });
    if (invite.expiresAt < new Date()) return res.status(400).json({ error: "Invite expired" });

    const hashedPassword = await bcryptjs.hash(password, 10);

    let user = await prisma.user.findUnique({ where: { email: invite.email } });
    if (!user) {
      user = await prisma.user.create({
        data: { name, email: invite.email, password: hashedPassword, role: invite.role },
      });
    }

    await prisma.weddingMember.upsert({
      where: { userId_weddingId: { userId: user.id, weddingId: invite.weddingId } },
      update: {},
      create: { userId: user.id, weddingId: invite.weddingId, role: invite.role },
    });

    await prisma.weddingInvite.update({ where: { id: invite.id }, data: { used: true } });

    const jwtToken = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET);
    res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token: jwtToken });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
