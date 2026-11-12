
import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

import {
  createConversationController,
  getConversationsController,
  getConversationController,
  updateConversationController,
  deleteConversationController
} from "../controllers/conversation.controller.js";

import {
  conversationParamsSchema,
  createConversationSchema,
  updateConversationSchema
} from "../validators/conversation.validator.js";

const router = express.Router();

router.use(verifyToken);

router.post(
  "/",
  validate(createConversationSchema),
  createConversationController
);

router.get("/", getConversationsController);

router.get(
  "/:id",
  validate(conversationParamsSchema, "params"),
  getConversationController
);

router.patch(
  "/:id",
  validate(conversationParamsSchema, "params"),
  validate(updateConversationSchema),
  updateConversationController
);

router.delete(
  "/:id",
  validate(conversationParamsSchema, "params"),
  deleteConversationController
);

export default router;
