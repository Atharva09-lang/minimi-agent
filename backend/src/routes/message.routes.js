
import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";

import {
  createMessageController,
  getMessagesController
} from "../controllers/message.controller.js";

const router = express.Router();

router.use(verifyToken);

router.post("/:conversationId", createMessageController);
router.get("/:conversationId", getMessagesController);

export default router;
