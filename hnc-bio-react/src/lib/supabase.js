import { createClient } from '@supabase/supabase-js';

// Jika di Vercel env variable belum terbaca, berikan string kosong agar aplikasi tidak crash seketika (blankscreen)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://missing-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'missing-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
