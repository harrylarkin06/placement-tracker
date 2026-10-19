// Brings in a ready-made tool (from Supabase, our online database service) that lets this app connect to it
import { createClient } from '@supabase/supabase-js'

// These are the address of our database, stored in a separate private settings file instead of written here in the code
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
// This is a public access key, the real security is rules in the database that decide who can see what data
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Creates the connection once and shares it with the rest of the app, so it handles logins and saving/loading data in one place
export const supabase = createClient(supabaseUrl, supabaseAnonKey)