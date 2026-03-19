import { PageContainer } from "@/components/layout/page-container";
import { PersonalInfoForm } from "@/components/forms/personal-info-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getApplicantDashboardData } from "@/lib/supabase/actions";
import { buildProfileFallback } from "@/lib/auth/profile-fallback";

export default async function Step1PersonalInfo() {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { profile, application } = await getApplicantDashboardData(user.id);
    const resolvedProfile = profile ?? buildProfileFallback(user);

    return (
        <PageContainer title="Step 1: Personal Information" description="Provide your accurate personal, contact, and identification details.">
            <PersonalInfoForm application={application} profile={resolvedProfile} />
        </PageContainer>
    );
}
