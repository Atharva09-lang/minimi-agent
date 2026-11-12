
import { getApiToken } from './authClient'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

async function apiRequest(endpoint, options = {}) {
  const token = await getApiToken()

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(data?.message || data?.error || 'Something went wrong.')
  }

  return data
}

export const getConversations = () =>
  apiRequest('/conversations')

export const createConversation = (title) =>
  apiRequest('/conversations', {
    method: 'POST',
    body: JSON.stringify({ title }),
  })

export const getMessages = (conversationId) =>
  apiRequest(`/messages/${conversationId}`)

export const sendMessageToBackend = (conversationId, content) =>
  apiRequest(`/messages/${conversationId}`, {
    method: 'POST',
    body: JSON.stringify({
      content,
      role: 'user',
      metadata: {},
    }),
  })
export const deleteConversation = (conversationId) =>
  apiRequest(`/conversations/${conversationId}`, {
    method: 'DELETE',
  })
export default apiRequest
