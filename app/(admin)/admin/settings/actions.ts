"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function saveAdminSettings(settings: { id: string; enabled: boolean }[]) {
    const supabase = await createSupabaseServerClient();

    const { error } = await supabase
        .from("admin_settings")
        .upsert(settings, { onConflict: "id" });

    if (error) {
        return { error: error.message };
    }
    return { success: true };
}

export async function getAdminSettings() {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.from("admin_settings").select("*");
    return data || [];
}

export async function saveOperationalDefaults(defaults: any) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
        .from("admin_operational_defaults")
        .upsert({ id: 1, ...defaults }, { onConflict: "id" });

    if (error) {
        return { error: error.message };
    }
    return { success: true };
}

export async function getOperationalDefaults() {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.from("admin_operational_defaults").select("*").eq("id", 1).maybeSingle();
    return data || null;
}
