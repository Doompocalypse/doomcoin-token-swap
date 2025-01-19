import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ylzqjxfbtlkmlxdopita.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlsenFqeGZidGxrbWx4ZG9waXRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQxODg4NzMsImV4cCI6MjA0OTc2NDg3M30.wss0yUIXvDlDTx4EEB3C-RAGvKoqbSUOFOXM-bMupnQ";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    global: {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
    },
  }
);