import { prisma } from "../index.js";
import * as bcryptjs from "bcryptjs";

async function seed() {
  const hashedPassword = await bcryptjs.hash("password123", 10);

  await prisma.user.create({
    data: {
      name: "Test Planner",
      email: "planner@test.com",
      password: hashedPassword,
      role: "planner",
    },
  });

  console.log("Seed completed");
}

seed().catch(console.error);
