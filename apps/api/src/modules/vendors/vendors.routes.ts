import { Router } from "express";
import { prisma } from "@repo/database";
import { AuthRequest } from "../../middleware/auth.middleware.js";
import { notify, getWeddingParticipants } from "../../lib/notify.js";

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
        invoices: { orderBy: { uploadedAt: "desc" } },
        wedding: { select: { id: true, name: true } },
      },
      orderBy: { name: "asc" },
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
      include: { invoices: { orderBy: { uploadedAt: "desc" } } },
      orderBy: { name: "asc" },
    });
    res.json(vendors);
  } catch (error) {
    res.status(400).json({ error: (error as any).message });
  }
});

router.post("/wedding/:weddingId", async (req: AuthRequest, res) => {
  try {
    const { name, category, email, phone } = req.body;
    const weddingId = req.params["weddingId"] as string;
    const vendor = await prisma.vendor.create({
      data: { name, category, email, phone, weddingId },
      include: { invoices: true },
    });

    // Notify everyone except the person who added the vendor
    const { plannerId, memberIds } = await getWeddingParticipants(weddingId);
    const others = [plannerId, ...memberIds].filter((id) => id && id !== req.userId) as string[];
    if (others.length > 0) {
      await notify({
        userIds: others,
        title: "New Vendor Added",
        message: `${name} (${category}) has been added to your wedding vendors.`,
        type: "vendor_update",
        weddingId,
      });
    }

    res.json(vendor);
  } catch (error) {
    res.status(400).json({ error: (error as any).message });
  }
});

router.delete("/:vendorId", async (req: AuthRequest, res) => {
  try {
    const vendor = await prisma.vendor.findUnique({
      where: { id: req.params["vendorId"] as string },
      include: { invoices: true },
    });
    if (vendor && vendor.invoices.length > 0) {
      const total = vendor.invoices.reduce((sum, inv) => sum + parseFloat(String(inv.amount)), 0);
      await prisma.wedding.update({
        where: { id: vendor.weddingId },
        data: { spentAmount: { decrement: total } },
      });
    }
    await prisma.vendor.delete({ where: { id: req.params["vendorId"] as string } });
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: (error as any).message });
  }
});

// Invoice routes
router.post("/:vendorId/invoices", async (req: AuthRequest, res) => {
  try {
    const vendorId = req.params["vendorId"] as string;
    const { amount, description } = req.body;
    const amountNum = parseFloat(String(amount));

    const vendor = await prisma.vendor.findUnique({ where: { id: vendorId } });
    if (!vendor) return res.status(404).json({ error: "Vendor not found" });

    const [invoice] = await prisma.$transaction([
      prisma.invoice.create({
        data: {
          amount: amountNum,
          description: description ?? "",
          status: "pending",
          vendorId,
          weddingId: vendor.weddingId,
        },
      }),
      prisma.wedding.update({
        where: { id: vendor.weddingId },
        data: { spentAmount: { increment: amountNum } },
      }),
    ]);

    // Notify everyone in the wedding about the new invoice
    const { plannerId, memberIds } = await getWeddingParticipants(vendor.weddingId);
    const everyone = [plannerId, ...memberIds].filter(Boolean) as string[];
    if (everyone.length > 0) {
      await notify({
        userIds: everyone,
        title: "Invoice Added",
        message: `A R${amountNum.toLocaleString()} invoice has been added for ${vendor.name}${description ? ` — ${description}` : ""}.`,
        type: "invoice",
        weddingId: vendor.weddingId,
      });
    }

    res.json(invoice);
  } catch (error) {
    res.status(400).json({ error: (error as any).message });
  }
});

router.patch("/:vendorId/invoices/:invoiceId", async (req: AuthRequest, res) => {
  try {
    const { status } = req.body;
    const invoiceId = req.params["invoiceId"] as string;
    const invoice = await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        status,
        ...(status === "approved" ? { approvedAt: new Date() } : {}),
      },
    });

    if (status === "approved") {
      const vendor = await prisma.vendor.findUnique({ where: { id: req.params["vendorId"] as string } });
      if (vendor) {
        const { plannerId, memberIds } = await getWeddingParticipants(vendor.weddingId);
        const everyone = [plannerId, ...memberIds].filter(Boolean) as string[];
        if (everyone.length > 0) {
          await notify({
            userIds: everyone,
            title: "Invoice Approved",
            message: `The R${parseFloat(String(invoice.amount)).toLocaleString()} invoice for ${vendor.name} has been approved.`,
            type: "invoice",
            weddingId: vendor.weddingId,
          });
        }
      }
    }

    res.json(invoice);
  } catch (error) {
    res.status(400).json({ error: (error as any).message });
  }
});

router.delete("/:vendorId/invoices/:invoiceId", async (req: AuthRequest, res) => {
  try {
    const invoiceId = req.params["invoiceId"] as string;
    const invoice = await prisma.invoice.findUnique({ where: { id: invoiceId } });
    if (!invoice) return res.status(404).json({ error: "Invoice not found" });

    await prisma.$transaction([
      prisma.invoice.delete({ where: { id: invoiceId } }),
      prisma.wedding.update({
        where: { id: invoice.weddingId },
        data: { spentAmount: { decrement: parseFloat(String(invoice.amount)) } },
      }),
    ]);

    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: (error as any).message });
  }
});

export default router;
