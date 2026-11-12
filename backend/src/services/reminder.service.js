
import {
  createReminder,
  getUserReminders,
  getDueRemindersForUser,
  cancelReminder,
  markReminderAsSent
} from "../repositories/reminder.repository.js";

//create reminder
export async function scheduleUserReminder(
  userId,
  message,
  scheduledAt,
  timezone = "UTC",
  memoryId = null
) {
  return await createReminder(
    userId,
    message,
    scheduledAt,
    timezone,
    memoryId
  );
}

//get all reminders
export async function listUserReminders(userId) {
  return await getUserReminders(userId);
}

//get reminders ready for display
export async function getDueUserReminders(userId) {
  return await getDueRemindersForUser(userId);
}

//displayed reminder
export async function acknowledgeUserReminder(userId, reminderId) {
  return await markReminderAsSent(userId, reminderId);
}

//cancel reminder
export async function cancelUserReminder(userId, reminderId) {
  return await cancelReminder(userId, reminderId);
}
