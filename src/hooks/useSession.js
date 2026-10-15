import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useSession() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 1. Check for an existing session when the app first loads
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // 2. Listen for future log-ins, log-outs and token refreshes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
      }
    )

    // 3. Clean up the listener when the component unmounts
    return () => subscription.unsubscribe()
  }, [])

  return { session, loading }
}