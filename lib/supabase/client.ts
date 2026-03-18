import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseBrowserConfig } from "@/lib/supabase/config";

let browserClient: ReturnType<typeof createBrowserClient> | undefined;

export function getSupabaseBrowserClient() {
    if (!browserClient) {
        const { url, publishableKey } = getSupabaseBrowserConfig();
        browserClient = createBrowserClient(url, publishableKey);
    }

    return browserClient;
}
