
import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

import {
  createReminderController,
  getRemindersController,
  getDueRemindersController,
  acknowledgeReminderController,
  cancelReminderController
} from "../controllers/reminder.controller.js";

import {
  createReminderSchema,
  reminderParamsSchema
} from "../validators/reminder.validator.js";

const router = express.Router();

router.use(verifyToken);

router.post(
  "/",
  validate(createReminderSchema),
  createReminderController
);

router.get("/", getRemindersController);

router.get("/due", getDueRemindersController);

router.post(
  "/:id/acknowledge",
  validate(reminderParamsSchema, "params"),
  acknowledgeReminderController
);

router.delete(
  "/:id",
  validate(reminderParamsSchema, "params"),
  cancelReminderController
);

export default router;
