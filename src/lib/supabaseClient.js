
import { createClient } from '@supabase/supabase-js'

// Initialize the Supabase client
// Replace these with your actual Supabase URL and anon key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
