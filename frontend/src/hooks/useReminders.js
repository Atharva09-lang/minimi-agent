
import { useCallback, useEffect, useState } from 'react'
import {
  getAllReminders,
  acknowledgeReminder,
  cancelReminder,
} from '../services/reminderApi'

function useReminders() {
  const [reminders, setReminders] = useState([])

  const refreshReminders = useCallback(async () => {
    try {
      const result = await getAllReminders()
      setReminders(result.reminders || [])
    } catch (err) {
      console.warn('Reminder service unavailable:', err.message)
    }
  }, [])

  useEffect(() => {
    refreshReminders()

    const intervalId = setInterval(refreshReminders, 30000)

    return () => clearInterval(intervalId)
  }, [refreshReminders])

  const acknowledge = async (reminderId) => {
    try {
      await acknowledgeReminder(reminderId)
      await refreshReminders()
    } catch (err) {
      console.error('Reminder acknowledgement failed:', err)
    }
  }

  const cancel = async (reminderId) => {
    try {
      await cancelReminder(reminderId)
      await refreshReminders()
    } catch (err) {
      console.error('Reminder cancellation failed:', err)
    }
  }

  const now = Date.now()

  const dueReminders = reminders.filter(
    (reminder) =>
      reminder.status === 'pending' &&
      new Date(reminder.scheduled_at).getTime() <= now
  )

  const upcomingReminders = reminders.filter(
    (reminder) =>
      reminder.status === 'pending' &&
      new Date(reminder.scheduled_at).getTime() > now
  )

  return {
    reminders: dueReminders,
    upcomingReminders,
    acknowledge,
    cancel,
    refreshReminders,
  }
}

export default useReminders
