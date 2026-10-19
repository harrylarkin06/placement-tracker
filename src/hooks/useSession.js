// Lets this file remember the login state, and run code when the app starts
import { useState, useEffect } from 'react'
// The shared connection to our database and login service
import { supabase } from '../lib/supabaseClient'

// A reusable helper that tells any page whether someone is logged in.
// A "session" is a record that the user is logged in; it is empty if nobody is.
export function useSession() {
  const [session, setSession] = useState(null)
  // True until we've checked for an existing login, so the app doesn't
  // briefly show the login page to someone who is already logged in
  const [loading, setLoading] = useState(true)

  // Runs once when the app first loads (the empty [] at the bottom means "only once")
  useEffect(() => {
    // 1. Check whether the user was already logged in from a previous visit
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // 2. Keep watching for changes, such as the user logging in or out
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
      }
    )

    // 3. Stop watching when this is no longer needed, to avoid wasting memory
    return () => subscription.unsubscribe()
  }, [])

  // Hand the login state back to whichever page asked for it
  return { session, loading }
}