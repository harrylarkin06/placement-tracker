   import { useSession } from './hooks/useSession'
   import { supabase } from './lib/supabaseClient'
   import AuthForm from './components/AuthForm'

   function App() {
     const { session, loading } = useSession()

     if (loading) return <p>Loading...</p>

     if (!session) return <AuthForm />

     return (
       <div>
         <p>Logged in as {session.user.email}</p>
         <button onClick={() => supabase.auth.signOut()}>Log out</button>
       </div>
     )
   }

   export default App