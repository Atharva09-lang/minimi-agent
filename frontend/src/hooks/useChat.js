
import { useEffect, useState } from 'react'
import {
  getConversations,
  createConversation,
  getMessages,
  sendMessageToBackend,
  deleteConversation as deleteConversationRequest,
} from '../services/chatApi'

function useChat() {
  const [conversations, setConversations] = useState([])
  const [activeConversationId, setActiveConversationId] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadConversations = async () => {
      try {
        const result = await getConversations()
        setConversations(result.conversations || [])
      } catch (err) {
        setError(err.message)
      }
    }

    loadConversations()
  }, [])

  const createNewChat = () => {
    setActiveConversationId(null)
    setMessages([])
    setInput('')
    setError('')
  }

  const selectConversation = async (conversationId) => {
    if (isTyping) return

    setActiveConversationId(conversationId)
    setMessages([])
    setInput('')
    setError('')

    try {
      const result = await getMessages(conversationId)
      setMessages(result.data || [])
    } catch (err) {
      setError(err.message)
    }
  }

  const deleteConversation = async (conversationId) => {
    if (isTyping) return

    setError('')

    try {
      await deleteConversationRequest(conversationId)

      setConversations((previous) =>
        previous.filter((conversation) => conversation.id !== conversationId)
      )

      if (activeConversationId === conversationId) {
        setActiveConversationId(null)
        setMessages([])
        setInput('')
      }
    } catch (err) {
      setError(err.message || 'Failed to delete conversation.')
    }
  }

  const sendMessage = async () => {
    const content = input.trim()

    if (!content || isTyping) return

    setInput('')
    setError('')
    setIsTyping(true)

    const temporaryMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
    }

    setMessages((previous) => [...previous, temporaryMessage])

    try {
      let conversationId = activeConversationId

      if (!conversationId) {
        const result = await createConversation(content.slice(0, 100))
        const conversation = result.conversation

        conversationId = conversation?.id || conversation?.conversation_id

        if (!conversationId) {
          throw new Error('Conversation ID was not returned by the server.')
        }

        setActiveConversationId(conversationId)
        setConversations((previous) => [conversation, ...previous])
      }

      const result = await sendMessageToBackend(conversationId, content)

      const userMessage = result.data?.userMessage
      const assistantMessage = result.data?.assistantMessage

      if (!assistantMessage) {
        throw new Error('The server did not return an AI response.')
      }

      setMessages((previous) => [
        ...previous.filter((message) => message.id !== temporaryMessage.id),
        userMessage || temporaryMessage,
        assistantMessage,
      ])
    } catch (err) {
      setError(err.message || 'Failed to send message.')
    } finally {
      setIsTyping(false)
    }
  }

  return {
    conversations,
    setConversations,
    activeConversationId,
    messages,
    input,
    setInput,
    isTyping,
    setIsTyping,
    error,
    createNewChat,
    selectConversation,
    deleteConversation,
    sendMessage,
  }
}

export default useChat
