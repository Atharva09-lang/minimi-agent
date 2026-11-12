import MessageBubble from './MessageBubble'
import TypingIndicator from './TypingIndicator'

function ChatWindow({ messages, isTyping }) {
  return (
    <section className="chat-content">
      {messages.length === 0 ? (
        <div className="welcome-message">
          <div className="ai-icon">M</div>
          <h1>What can I help you with?</h1>
          <p>
            Ask anything. Search the web, explore ideas,
            or get help with your tasks.
          </p>
        </div>
      ) : (
        <div className="messages-container">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}

          {isTyping && <TypingIndicator />}
        </div>
      )}
    </section>
  )
}

export default ChatWindow