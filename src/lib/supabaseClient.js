// utils/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Use the provided Supabase URL and anon key
const supabaseUrl = 'https://fxtuychhivqfhbdfcuie.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4dHV5Y2hoaXZxZmhiZGZjdWllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1MjU0NTEsImV4cCI6MjA2MDEwMTQ1MX0.EwONHwcEzYzrQAc1PjLSIN9qRyC70BrnS0MAhuWouZE';

<<<<<<< HEAD
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
=======
// Initialize the Supabase client with the provided credentials
const supabaseUrl = 'https://fxtuychhivqfhbdfcuie.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4dHV5Y2hoaXZxZmhiZGZjdWllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1MjU0NTEsImV4cCI6MjA2MDEwMTQ1MX0.EwONHwcEzYzrQAc1PjLSIN9qRyC70BrnS0MAhuWouZE'

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storage: localStorage,
    autoRefreshToken: true,
  }
})
>>>>>>> 4de6fefc674013e629bdd03a5b268b6a00bc38f3
