import { createClient } from '@supabase/supabase-js'
const url = import.meta.env.VITE_SUPABASE_URL?.trim()
const key = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY)?.trim()
export const configError = !url || !key ? 'Trūksta Supabase konfigūracijos. Nustatykite VITE_SUPABASE_URL ir VITE_SUPABASE_PUBLISHABLE_KEY arba VITE_SUPABASE_ANON_KEY faile .env.local.' : null
export const supabase = configError ? null : createClient(url, key, { auth:{ persistSession:true, autoRefreshToken:true, detectSessionInUrl:true } })
