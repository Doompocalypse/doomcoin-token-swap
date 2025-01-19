import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ylzqjxfbtlkmlxdopita.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlsenFqeGZidGxrbWx4ZG9waXRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDU2NzY4MDAsImV4cCI6MjAyMTI1MjgwMH0.qKtfNHhL6AKqGsmDfjPi7vIOO3UEXQTJYEXTAoLkCFE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'Authorization': `Bearer ${supabaseAnonKey}`,
      'apikey': supabaseAnonKey
    }
  }
});