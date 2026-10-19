import { useEffect, useState } from 'react'
import { supabase } from './lib/supabaseClient'
import AuthForm from './components/AuthForm' 
import ApplicationsPage from './components/ApplicationsPage'

// The top-level component: shows the login form or the app depending on
// whether someone is logged in. A "session" is the record that they are.
export default function App() {
  const [session, setSession] = useState(null)

  // On first load, check for an existing login, then keep watching for logins
  // and logouts. The returned function stops the watching when no longer needed.
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  // Logged out: show the login form
  if (!session) return <AuthForm />

  // Logged in: everything below only renders for a logged-in user
  return (
    <div>
      <button onClick={() => supabase.auth.signOut()}>Log out</button>
      <h1>My applications</h1>
      <ApplicationsPage />
    </div>
  )
}