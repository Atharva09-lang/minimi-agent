
import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";

import {
  createMessageController,
  getMessagesController
} from "../controllers/message.controller.js";

const router = express.Router();

router.use(authenticate);

router.post("/:conversationId", createMessageController);
router.get("/:conversationId", getMessagesController);

export default router;
