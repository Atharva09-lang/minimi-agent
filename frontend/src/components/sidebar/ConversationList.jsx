
import { useState } from 'react'

function ConversationList({
  conversations,
  activeConversationId,
  onSelect,
  onDelete,
}) {
  const [openMenuId, setOpenMenuId] = useState(null)

  if (conversations.length === 0) {
    return (
      <div className="empty-conversations">
        Your conversations will appear here.
      </div>
    )
  }

  return (
    <div className="conversation-list">
      {conversations.map((conversation) => (
        <div
          key={conversation.id}
          className={`conversation-item ${
            activeConversationId === conversation.id ? 'active' : ''
          }`}
        >
          <button
            type="button"
            className="conversation-select"
            onClick={() => {
              setOpenMenuId(null)
              onSelect(conversation.id)
            }}
          >
            <span className="conversation-title">
              {conversation.title || 'New Conversation'}
            </span>
          </button>

          <div className="conversation-actions">
            <button
              type="button"
              className="conversation-menu-btn"
              title="More options"
              aria-label="More options"
              aria-expanded={openMenuId === conversation.id}
              onClick={() =>
                setOpenMenuId((current) =>
                  current === conversation.id ? null : conversation.id
                )
              }
            >
              ⋯
            </button>

            {openMenuId === conversation.id && (
              <div className="conversation-menu">
                <button
                  type="button"
                  className="delete-chat-btn"
                  onClick={() => {
                    setOpenMenuId(null)
                    onDelete(conversation.id)
                  }}
                >
                  <span>⌫</span>
                  Delete chat
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default ConversationList
