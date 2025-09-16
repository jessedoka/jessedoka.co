import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { publicEnv } from "../env.mjs";

export function createSupabaseServer() {
    const cookieStore = cookies();
    return createServerClient(
        publicEnv.NEXT_PUBLIC_SUPABASE_URL!,
        publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {cookies: {
            getAll() {return cookieStore.getAll()},
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        }
    );
}
