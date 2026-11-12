
import { z } from "zod";

export const createMemorySchema = z.object({
  memoryType: z.enum([
    "fact",
    "preference",
    "commitment",
    "goal",
    "other"
  ]),
  content: z.string().trim().min(1).max(5000),
  confidence: z.number().min(0).max(1).optional().default(1),
  importance: z.number().int().min(1).max(5).optional().default(3),
  sourceMessageId: z.uuid().nullable().optional(),
  expiresAt: z.iso.datetime({ offset: true }).nullable().optional()
}).strict();

export const updateMemorySchema = z.object({
  content: z.string().trim().min(1).max(5000)
}).strict();

export const memoryParamsSchema = z.object({
  id: z.uuid()
});
