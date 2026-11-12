
import { useState } from 'react'
import { createReminder } from '../../services/reminderApi'

function ReminderForm({ onClose, onCreated }) {
  const [message, setMessage] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    const scheduledDate = new Date(`${date}T${time}`)

    if (!message.trim()) {
      setError('Enter a reminder message.')
      return
    }

    if (
      !date ||
      !time ||
      Number.isNaN(scheduledDate.getTime()) ||
      scheduledDate <= new Date()
    ) {
      setError('Please select a valid future date and time.')
      return
    }

    try {
      setLoading(true)

      await createReminder({
        message: message.trim(),
        scheduledAt: scheduledDate.toISOString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      })

      onCreated?.()
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to create reminder.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="reminder-form" onSubmit={handleSubmit}>
      <div className="reminder-form-header">
        <h3>Set a Reminder</h3>

        <button
          type="button"
          className="reminder-close-btn"
          onClick={onClose}
          disabled={loading}
          aria-label="Close reminder form"
        >
          ×
        </button>
      </div>

      <input
        type="text"
        placeholder="What should Minimi remind you about?"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        maxLength={2000}
        required
      />

      <label>
        Date
        <input
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
          min={new Date().toLocaleDateString('en-CA')}
          required
        />
      </label>

      <label>
        Time
        <input
          type="time"
          value={time}
          onChange={(event) => setTime(event.target.value)}
          required
        />
      </label>

      {error && <p role="alert">{error}</p>}

      <div className="reminder-form-actions">
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </button>

        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Reminder'}
        </button>
      </div>
    </form>
  )
}

export default ReminderForm
