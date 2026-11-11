
import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";

import {
  createMemoryController,
  getMemoriesController,
  updateMemoryController,
  deleteMemoryController
} from "../controllers/memory.controller.js";

const router = express.Router();

router.use(verifyToken);

router.post("/", createMemoryController);
router.get("/", getMemoriesController);
router.patch("/:id", updateMemoryController);
router.delete("/:id", deleteMemoryController);

export default router;
