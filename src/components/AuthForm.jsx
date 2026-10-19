// Lets this page remember things, like what the user has typed
import { useState } from 'react'
// The shared connection to our database and login service
import { supabase } from '../lib/supabaseClient'

// The page where visitors who aren't logged in can log in or create an account
export default function AuthForm() {
  // What the page remembers: which mode we're in, what's been typed,
  // any error or info message to show, and whether we're waiting for a reply
  const [mode, setMode] = useState('login') // 'login' or 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  // Runs when the user presses the submit button
  async function handleSubmit(e) {
    e.preventDefault() // stops the browser from refreshing the page
    setError(null)
    setMessage(null)
    setSubmitting(true)

    if (mode === 'signup') {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setError(error.message)
      } else if (!data.session) {
        // No "session" (a record that the user is logged in) means
        // they need to confirm their email first
        setMessage('Check your email to confirm your account, then log in.')
      }
      // Otherwise they're logged in straight away, and another part of the app notices
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
    }

    setSubmitting(false)
  }

  return (
    <div>
      <h1>{mode === 'login' ? 'Log in' : 'Sign up'}</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />
        </div>
        {/* Disabled while waiting for a reply, so the user can't click twice */}
        <button type="submit" disabled={submitting}>
          {mode === 'login' ? 'Log in' : 'Sign up'}
        </button>
      </form>

      {error && <p>{error}</p>}
      {message && <p>{message}</p>}

      {/* Switches between the log in and sign up versions of this form */}
      <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
        {mode === 'login' ? 'Need an account? Sign up' : 'Have an account? Log in'}
      </button>
    </div>
  )
}