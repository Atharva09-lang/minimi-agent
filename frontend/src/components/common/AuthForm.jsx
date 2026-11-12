
import { useState } from 'react'
import authClient from '../../services/authClient'

function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = isSignUp
        ? await authClient.signUp.email({ name, email, password })
        : await authClient.signIn.email({ email, password })

      if (result?.error) {
        throw new Error(result.error.message || 'Authentication failed')
      }
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const toggleMode = () => {
    setIsSignUp((previous) => !previous)
    setError('')
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-logo">✦</div>
          <span>minimi<span className="brand-dot">.</span></span>
        </div>

        <div className="auth-heading">
          <h1>{isSignUp ? 'Create your account' : 'Welcome back'}</h1>
          <p>
            {isSignUp
              ? 'Get started with your personal AI assistant.'
              : 'Sign in to continue your conversations.'}
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {isSignUp && (
            <div className="auth-field">
              <label htmlFor="auth-name">Full name</label>
              <input
                id="auth-name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>
          )}

          <div className="auth-field">
            <label htmlFor="auth-email">Email address</label>
            <input
              id="auth-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="auth-password">Password</label>
            <input
              id="auth-password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={8}
              required
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button className="auth-submit" type="submit" disabled={loading}>
            {loading
              ? 'Please wait...'
              : isSignUp
                ? 'Create Account'
                : 'Sign In'}
          </button>
        </form>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <p className="auth-toggle">
          {isSignUp
            ? 'Already have an account?'
            : "Don't have an account?"}
          <button type="button" onClick={toggleMode}>
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>

        <p className="auth-footer">
          Your personal space for smarter conversations.
        </p>
      </div>
    </div>
  )
}

export default AuthForm
