
import { createAuthClient } from '@neondatabase/auth'
import { BetterAuthReactAdapter } from '@neondatabase/auth/react/adapters'

const authUrl = import.meta.env.VITE_NEON_AUTH_URL

if (!authUrl) {
  throw new Error('VITE_NEON_AUTH_URL is missing from .env.local')
}

const authClient = createAuthClient(authUrl, {
  adapter: BetterAuthReactAdapter(),
})

export async function getApiToken() {
  const response = await fetch(`${authUrl}/token`, {
    method: 'GET',
    credentials: 'include',
  })

  const data = await response.json().catch(() => null)

  if (!response.ok || !data?.token) {
    throw new Error('Unable to retrieve authentication token. Please sign in again.')
  }

  return data.token
}

export default authClient
