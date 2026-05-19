import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

export function initSupabase() {
  const supabaseUrl = process.env.SUPABASE_URL || '';
  const supabaseKey = process.env.SUPABASE_KEY || '';
  return createClient(supabaseUrl, supabaseKey);
}
