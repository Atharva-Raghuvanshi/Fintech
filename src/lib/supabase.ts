/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Sanitize URL to ensure it does not contain /rest/v1 or trailing slashes
const sanitizedUrl = (supabaseUrl || 'https://placeholder.supabase.co')
  .replace(/\/rest\/v1\/?$/, '')
  .replace(/\/+$/, '');

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL and Anon Key must be provided in environment variables.');
}

export const supabase = createClient(
  sanitizedUrl,
  supabaseAnonKey || 'placeholder'
);
