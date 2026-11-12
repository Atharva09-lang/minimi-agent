
function ReminderList({
  reminders,
  upcomingReminders = [],
  onAcknowledge,
  onCancel,
}) {
  if (reminders.length === 0 && upcomingReminders.length === 0) {
    return null
  }

  return (
    <div className="reminders-container">
      {reminders.length > 0 && (
        <section className="reminder-section">
          <h3>Due Reminders</h3>

          {reminders.map((reminder) => (
            <div className="reminder-card" key={reminder.id}>
              <div className="reminder-info">
                <p>{reminder.message}</p>
                <small>
                  {new Date(reminder.scheduled_at).toLocaleString()}
                </small>
              </div>

              <button onClick={() => onAcknowledge(reminder.id)}>
                Done
              </button>
            </div>
          ))}
        </section>
      )}

      {upcomingReminders.length > 0 && (
        <section className="reminder-section">
          <h3>Upcoming Reminders</h3>

          {upcomingReminders.map((reminder) => (
            <div className="reminder-card" key={reminder.id}>
              <div className="reminder-info">
                <p>{reminder.message}</p>
                <small>
                  {new Date(reminder.scheduled_at).toLocaleString()}
                </small>
              </div>

              <button
                className="reminder-cancel-btn"
                onClick={() => onCancel(reminder.id)}
              >
                Cancel
              </button>
            </div>
          ))}
        </section>
      )}
    </div>
  )
}

export default ReminderList
