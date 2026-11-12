
import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

import {
  createMemoryController,
  getMemoriesController,
  updateMemoryController,
  deleteMemoryController
} from "../controllers/memory.controller.js";

import {
  createMemorySchema,
  updateMemorySchema,
  memoryParamsSchema
} from "../validators/memory.validator.js";

const router = express.Router();

router.use(verifyToken);

router.post(
  "/",
  validate(createMemorySchema),
  createMemoryController
);

router.get("/", getMemoriesController);

router.patch(
  "/:id",
  validate(memoryParamsSchema, "params"),
  validate(updateMemorySchema),
  updateMemoryController
);

router.delete(
  "/:id",
  validate(memoryParamsSchema, "params"),
  deleteMemoryController
);

export default router;
