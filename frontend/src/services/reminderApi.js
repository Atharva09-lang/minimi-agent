
import apiRequest from './chatApi'

export const getDueReminders = () =>
  apiRequest('/reminders/due')

export const getAllReminders = () =>
  apiRequest('/reminders')

export const acknowledgeReminder = (reminderId) =>
  apiRequest(`/reminders/${reminderId}/acknowledge`, {
    method: 'POST',
  })

export const cancelReminder = (reminderId) =>
  apiRequest(`/reminders/${reminderId}`, {
    method: 'DELETE',
  })

export const createReminder = (reminderData) =>
  apiRequest('/reminders', {
    method: 'POST',
    body: JSON.stringify(reminderData),
  })
