import { createClient } from '@supabase/supabase-js'
import { Database } from "@/lib/database.types"

const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY as string

export const supabase = createClient<Database>(
    supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    }
})
