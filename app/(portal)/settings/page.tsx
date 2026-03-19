import { PageContainer } from "@/components/layout/page-container";
import { ProfileForm } from "@/components/settings/profile-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { buildProfileFallback } from "@/lib/auth/profile-fallback";

export default async function ProfileSettingsPage() {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();
    const resolvedProfile = profile ?? buildProfileFallback(user);

    return (
        <PageContainer
            title="Profile & Settings"
            description="Manage your personal information, notification preferences, and account security."
        >
            <ProfileForm profile={resolvedProfile} />
        </PageContainer>
    );
}
