import { PageContainer } from "@/components/layout/page-container";
import { ApplicationReview } from "@/components/forms/application-review";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getApplicantDashboardData } from "@/lib/supabase/actions";
import { buildProfileFallback } from "@/lib/auth/profile-fallback";

export default async function Step5Review() {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { profile, application, documents } = await getApplicantDashboardData(user.id);
    const resolvedProfile = profile ?? buildProfileFallback(user);

    return (
        <PageContainer
            title="Step 5: Review & Submit"
            description="Review all sections carefully before final submission. Once submitted, no changes can be made."
        >
            <ApplicationReview profile={resolvedProfile} application={application} documents={documents} />
        </PageContainer>
    );
}
