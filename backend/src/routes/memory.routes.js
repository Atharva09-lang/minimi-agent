
import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";

import {
  createMemoryController,
  getMemoriesController,
  updateMemoryController,
  deleteMemoryController
} from "../controllers/memory.controller.js";

const router = express.Router();

router.use(authenticate);

router.post("/", createMemoryController);
router.get("/", getMemoriesController);
router.patch("/:id", updateMemoryController);
router.delete("/:id", deleteMemoryController);

export default router;
