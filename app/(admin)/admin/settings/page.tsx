import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getAdminSettings, getOperationalDefaults } from "./actions";
import { SettingsClient } from "./settings-client";
import { redirect } from "next/navigation";

export default async function SystemSettingsPage() {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const [settingsList, defaults] = await Promise.all([
        getAdminSettings(),
        getOperationalDefaults()
    ]);

    // Map fetched array to dictionary by ID
    const booleanToggles: Record<string, boolean> = (settingsList || []).reduce((acc: Record<string, boolean>, item: any) => {
        acc[item.id] = item.enabled;
        return acc;
    }, {});

    return <SettingsClient initialToggles={booleanToggles} initialDefaults={defaults} />;
}
