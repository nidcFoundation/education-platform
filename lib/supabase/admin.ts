import { createClient } from "@supabase/supabase-js";
import { getSupabaseServiceRoleConfig } from "@/lib/supabase/config";

export function createSupabaseAdminClient() {
    const { url, serviceRoleKey } = getSupabaseServiceRoleConfig();

    return createClient(url, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
}
