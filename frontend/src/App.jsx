
import './App.css'
import authClient from './services/authClient'
import ChatWindow from './components/chat/ChatWindow'
import ChatInput from './components/chat/ChatInput'
import ConversationList from './components/sidebar/ConversationList'
import useChat from './hooks/useChat'
import AuthGate from './components/common/AuthGate'
import useReminders from './hooks/useReminders'
import ReminderList from './components/reminders/ReminderList'

function ChatApp() {
  const {
    conversations,
    activeConversationId,
    messages,
    input,
    setInput,
    isTyping,
    error,
    createNewChat,
    selectConversation,
    deleteConversation,
    sendMessage,
  } = useChat()

  const {
    reminders,
    upcomingReminders,
    acknowledge,
    cancel,
    refreshReminders,
  } = useReminders()

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="brand">
          <h2>
            minimi<span>.</span>
          </h2>
        </div>

        <button className="new-chat-btn" onClick={createNewChat}>
          + New Chat
        </button>

        <div className="sidebar-section">
          <p className="section-title">YOUR CHATS</p>

          <ConversationList
            conversations={conversations}
            activeConversationId={activeConversationId}
            onSelect={selectConversation}
            onDelete={deleteConversation}
          />
        </div>

        <div className="sidebar-footer">
          <div className="user-avatar">A</div>

          <div className="user-details">
            <p className="user-name">Atharva</p>
            <p className="user-plan">Personal Account</p>
          </div>

          <button
            className="logout-btn"
            onClick={async () => {
              try {
                await authClient.signOut()
              } catch (error) {
                console.error('Logout failed:', error)
              }
            }}
            title="Sign out"
            aria-label="Sign out"
          >
            <span>↪</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <span>
            {activeConversationId ? 'Conversation' : 'New Conversation'}
          </span>

          <span className="status">✦ AI Ready</span>
        </header>

        {error && (
          <div className="error-banner" role="alert">
            {error}
          </div>
        )}

        <ReminderList
          reminders={reminders}
          upcomingReminders={upcomingReminders}
          onAcknowledge={acknowledge}
          onCancel={cancel}
        />

        <ChatWindow
          messages={messages}
          isTyping={isTyping}
        />

        <footer className="chat-footer">
          <ChatInput
            value={input}
            onChange={setInput}
            onSend={sendMessage}
            onReminderCreated={refreshReminders}
            disabled={isTyping}
          />

          <p className="disclaimer">
            Minimi AI can make mistakes. Verify important information.
          </p>
        </footer>
      </main>
    </div>
  )
}

function App() {
  return (
    <AuthGate>
      <ChatApp />
    </AuthGate>
  )
}

export default App
