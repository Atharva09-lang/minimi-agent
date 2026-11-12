
import { z } from "zod";

export const messageParamsSchema = z.object({
  conversationId: z.uuid()
});

export const createMessageSchema = z.object({
  content: z.string().trim().min(1).max(10000),
  role: z.literal("user").optional(),
  metadata: z.record(z.string(), z.unknown()).optional().default({})
}).strict();
