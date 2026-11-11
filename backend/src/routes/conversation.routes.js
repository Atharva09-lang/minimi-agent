
import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";

import {
  createConversationController,
  getConversationsController,
  getConversationController,
  updateConversationController,
  deleteConversationController
} from "../controllers/conversation.controller.js";

const router = express.Router();

router.use(verifyToken);

router.post("/", createConversationController);
router.get("/", getConversationsController);
router.get("/:id", getConversationController);
router.patch("/:id", updateConversationController);
router.delete("/:id", deleteConversationController);

export default router;
