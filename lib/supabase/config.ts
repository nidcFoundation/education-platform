export function getSupabaseBrowserConfig() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (!url) {
        throw new Error("Missing required environment variable: NEXT_PUBLIC_SUPABASE_URL");
    }

    if (!publishableKey) {
        throw new Error("Missing required environment variable: NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
    }

    return {
        url,
        publishableKey,
    };
}

export function getSupabaseServiceRoleConfig() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url) {
        throw new Error("Missing required environment variable: NEXT_PUBLIC_SUPABASE_URL");
    }

    if (!serviceRoleKey) {
        throw new Error("Missing required environment variable: SUPABASE_SERVICE_ROLE_KEY");
    }

    return {
        url,
        serviceRoleKey,
    };
}
