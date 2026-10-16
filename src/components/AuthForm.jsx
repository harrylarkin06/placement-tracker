   import { useState } from 'react'
   import { supabase } from '../lib/supabaseClient'

   export default function AuthForm() {
     const [mode, setMode] = useState('login') // 'login' or 'signup'
     const [email, setEmail] = useState('')
     const [password, setPassword] = useState('')
     const [error, setError] = useState(null)
     const [message, setMessage] = useState(null)
     const [submitting, setSubmitting] = useState(false)

     async function handleSubmit(e) {
       e.preventDefault() // stop the browser reloading the page
       setError(null)
       setMessage(null)
       setSubmitting(true)

       if (mode === 'signup') {
         const { data, error } = await supabase.auth.signUp({ email, password })
         if (error) {
           setError(error.message)
         } else if (!data.session) {
           // Email confirmation is on: user created, but no session yet
           setMessage('Check your email to confirm your account, then log in.')
         }
         // If data.session exists, useSession picks it up automatically
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
           <button type="submit" disabled={submitting}>
             {mode === 'login' ? 'Log in' : 'Sign up'}
           </button>
         </form>

         {error && <p>{error}</p>}
         {message && <p>{message}</p>}

         <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
           {mode === 'login' ? 'Need an account? Sign up' : 'Have an account? Log in'}
         </button>
       </div>
     )
   }