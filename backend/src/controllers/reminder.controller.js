
import {
  scheduleUserReminder,
  listUserReminders,
  getDueUserReminders,
  acknowledgeUserReminder,
  cancelUserReminder
} from "../services/reminder.service.js";

// Create reminder
export async function createReminderController(req, res) {
  try {
    const { message, scheduledAt, timezone, memoryId } = req.body;

    const reminder = await scheduleUserReminder(
      req.user.id,
      message,
      scheduledAt,
      timezone,
      memoryId
    );

    if (!reminder) {
      return res.status(400).json({
        success: false,
        message: "Invalid memory ID or reminder details"
      });
    }

    return res.status(201).json({
      success: true,
      reminder
    });
  } catch (error) {
    console.error("Create reminder error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to create reminder"
    });
  }
}

// Get all user reminders
export async function getRemindersController(req, res) {
  try {
    const reminders = await listUserReminders(req.user.id);

    return res.status(200).json({
      success: true,
      reminders
    });
  } catch (error) {
    console.error("Get reminders error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch reminders"
    });
  }
}

// Get due reminders
export async function getDueRemindersController(req, res) {
  try {
    const reminders = await getDueUserReminders(req.user.id);

    return res.status(200).json({
      success: true,
      reminders
    });
  } catch (error) {
    console.error("Get due reminders error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch due reminders"
    });
  }
}

// Acknowledge displayed reminder
export async function acknowledgeReminderController(req, res) {
  try {
    const reminder = await acknowledgeUserReminder(
      req.user.id,
      req.params.id
    );

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: "Pending reminder not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Reminder acknowledged",
      reminder
    });
  } catch (error) {
    console.error("Acknowledge reminder error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to acknowledge reminder"
    });
  }
}

// Cancel reminder
export async function cancelReminderController(req, res) {
  try {
    const cancelled = await cancelUserReminder(
      req.user.id,
      req.params.id
    );

    if (!cancelled) {
      return res.status(404).json({
        success: false,
        message: "Pending reminder not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Reminder cancelled successfully"
    });
  } catch (error) {
    console.error("Cancel reminder error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to cancel reminder"
    });
  }
}
