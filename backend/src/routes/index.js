
import express from "express";

import protectedRoutes from "./protected.routes.js";
import conversationRoutes from "./conversation.routes.js";
import messageRoutes from "./message.routes.js";
import memoryRoutes from "./memory.routes.js";

const router = express.Router();

router.use("/protected", protectedRoutes);
router.use("/conversations", conversationRoutes);
router.use("/messages", messageRoutes);
router.use("/memories", memoryRoutes);

export default router;
