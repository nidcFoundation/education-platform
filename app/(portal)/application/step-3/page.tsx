import { PageContainer } from "@/components/layout/page-container";
import { EssayForm } from "@/components/forms/essay-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getApplicantDashboardData } from "@/lib/supabase/actions";

export default async function Step3Essays() {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { application } = await getApplicantDashboardData(user.id);

    return (
        <PageContainer title="Step 3: Essays" description="Four structured essay responses are required. Answer each question with honesty and precision.">
            <EssayForm application={application} />
        </PageContainer>
    );
}
