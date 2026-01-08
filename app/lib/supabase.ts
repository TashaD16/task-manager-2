import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Создаем клиент (даже с placeholder значениями для успешной сборки)
// В runtime приложение проверит наличие реальных значений
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
