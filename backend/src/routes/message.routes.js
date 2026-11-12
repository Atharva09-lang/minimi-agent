
import { Router } from "express";
import { rateLimit } from "express-rate-limit";

import {
  createMessageController,
  getMessagesController
} from "../controllers/message.controller.js";

import { verifyToken } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

import {
  createMessageSchema,
  messageParamsSchema
} from "../validators/message.validator.js";

const router = Router();

const messageRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  keyGenerator: (req) => req.user.id,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many messages. Please try again later."
  }
});

router.post(
  "/:conversationId",
  verifyToken,
  messageRateLimiter,
  validate(messageParamsSchema, "params"),
  validate(createMessageSchema),
  createMessageController
);

router.get(
  "/:conversationId",
  verifyToken,
  validate(messageParamsSchema, "params"),
  getMessagesController
);

export default router;
