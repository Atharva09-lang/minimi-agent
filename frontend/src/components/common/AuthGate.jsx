import authClient from '../../services/authClient'
import AuthForm from './AuthForm'

function AuthGate({ children }) {
  const { data: session, isPending } = authClient.useSession()

  if (isPending) {
    return <div className="auth-loading">Loading Minimi...</div>
  }

  if (!session?.user) {
    return <AuthForm />
  }

  return children
}

export default AuthGate