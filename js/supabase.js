const SUPABASE_URL = "https://tppjsgqrcnmsocbthlbp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwcGpzZ3FyY25tc29jYnRobGJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM0NDgwMDgsImV4cCI6MjA5OTAyNDAwOH0.6Ay-cbnkBu4dMhAMGvpL1_35C6B41L6ypLsWxotnXJc";

// Initialize the Supabase client
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);