
import { useState } from 'react'
import ReminderForm from '../reminders/ReminderForm'

function ChatInput({
  value,
  onChange,
  onSend,
  onReminderCreated,
  disabled = false,
}) {
  const [showReminderForm, setShowReminderForm] = useState(false)

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      onSend()
    }
  }

  return (
    <>
      <div className="input-container">
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message Minimi..."
          rows="1"
          disabled={disabled}
        />

        <button
          type="button"
          className="reminder-btn"
          onClick={() => setShowReminderForm(true)}
          disabled={disabled}
          title="Set a reminder"
          aria-label="Set a reminder"
        >
          ⏰
        </button>

        <button
          type="button"
          className="send-btn"
          onClick={onSend}
          disabled={disabled || !value.trim()}
          aria-label="Send message"
        >
          ↑
        </button>
      </div>

      {showReminderForm && (
        <div className="reminder-modal-overlay">
          <ReminderForm
            onClose={() => setShowReminderForm(false)}
            onCreated={onReminderCreated}
          />
        </div>
      )}
    </>
  )
}

export default ChatInput
