// src/lib/supabase.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js'

// DIRECT HARDCODED VALUES FOR TROUBLESHOOTING
// Remove this approach after authentication is working
const supabaseUrl = "https://dhcgrpsgvaggrtfcykyf.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoY2dycHNndmFnZ3J0ZmN5a3lmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1OTA0MTQsImV4cCI6MjA2NDE2NjQxNH0.fkcetY89lCpLbJegbKCoala2B-s_ra13WqU7SaYGI-Y";

console.log("[supabase.ts] Using hardcoded Supabase values for testing");
console.log("[supabase.ts] URL:", supabaseUrl);
console.log("[supabase.ts] Keys loaded:", !!supabaseAnonKey);

// Create and export the Supabase client instance
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true, // Automatically refresh the session token
    persistSession: true,   // Persist session in storage (localStorage by default)
    detectSessionInUrl: true, // Detect session from URL (useful for OAuth redirects)
  },
});

console.log("[supabase.ts] Supabase client instance created successfully.");

