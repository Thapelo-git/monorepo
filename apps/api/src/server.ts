import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./modules/auth/auth.routes.js";
import weddingRoutes from "./modules/weddings/weddings.routes.js";
import taskRoutes from "./modules/tasks/tasks.routes.js";
import vendorRoutes from "./modules/vendors/vendors.routes.js";
import notificationRoutes from "./modules/notifications/notifications.routes.js";
import chatRoutes from "./modules/chat/chat.routes.js";
import { verifyToken } from "./middleware/auth.middleware.js";

const app = express();
const isProduction = process.env.NODE_ENV === "production";

app.use(helmet());
app.use(morgan(isProduction ? "combined" : "dev"));
app.use(cors({ origin: [process.env.FRONTEND_URL, "http://localhost:3001"] }));
app.use(express.json());

const API_PREFIX = "/api";
app.use(API_PREFIX + "/auth", authRoutes);
app.use(API_PREFIX + "/weddings", verifyToken, weddingRoutes);
app.use(API_PREFIX + "/tasks", verifyToken, taskRoutes);
app.use(API_PREFIX + "/vendors", verifyToken, vendorRoutes);
app.use(API_PREFIX + "/notifications", verifyToken, notificationRoutes);
app.use(API_PREFIX + "/chat", verifyToken, chatRoutes);
 
app.get(API_PREFIX + "/health", (_req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("API running on http://localhost:" + PORT);
});

export default app;
