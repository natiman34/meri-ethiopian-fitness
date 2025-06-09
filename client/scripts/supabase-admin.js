import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://dhcgrpsgvaggrtfcykyf.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoY2dycHNndmFnZ3J0ZmN5a3lmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1OTA0MTQsImV4cCI6MjA2NDE2NjQxNH0.fkcetY89lCpLbJegbKCoala2B-s_ra13WqU7SaYGI-Y";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
