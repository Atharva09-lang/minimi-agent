
import { z } from "zod";

export const conversationParamsSchema = z.object({
  id: z.uuid()
});

export const createConversationSchema = z.object({
  title: z.string().trim().max(100).optional()
}).strict();

export const updateConversationSchema = z.object({
  title: z.string().trim().min(1).max(100)
}).strict();
