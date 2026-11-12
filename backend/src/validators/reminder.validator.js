
import { z } from "zod";

export const createReminderSchema = z.object({
  message: z.string().trim().min(1).max(2000),

  scheduledAt: z.iso.datetime({ offset: true }),

  timezone: z.string().trim().min(1).max(100).optional().default("UTC"),

  memoryId: z.uuid().nullable().optional()
}).strict();

export const reminderParamsSchema = z.object({
  id: z.uuid()
});
