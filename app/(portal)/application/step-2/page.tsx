import { PageContainer } from "@/components/layout/page-container";
import { AcademicBackgroundForm } from "@/components/forms/academic-background-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getApplicantDashboardData } from "@/lib/supabase/actions";

export default async function Step2AcademicBackground() {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { application } = await getApplicantDashboardData(user.id);

    return (
        <PageContainer title="Step 2: Academic Background" description="Provide your secondary school results, JAMB scores, and current academic enrolment.">
            <AcademicBackgroundForm application={application} />
        </PageContainer>
    );
}
