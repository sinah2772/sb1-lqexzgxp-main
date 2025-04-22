import { createClient } from '@supabase/supabase-js';
import { Database } from './supabase-types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug logs
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key exists:', !!supabaseAnonKey);

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Test connection
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error('Supabase connection error:', error);
  } else {
    console.log('Supabase connection successful');
  }
});