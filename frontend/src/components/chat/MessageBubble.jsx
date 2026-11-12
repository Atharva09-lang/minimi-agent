
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

function MessageBubble({ message }) {
  const isUser = message.role === 'user'

  return (
    <div className={`message-row ${isUser ? 'user-row' : 'assistant-row'}`}>
      {!isUser && <div className="message-avatar">M</div>}

      <div className={`message-bubble ${isUser ? 'user-bubble' : 'assistant-bubble'}`}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {message.content || ''}
        </ReactMarkdown>
      </div>
    </div>
  )
}

export default MessageBubble
