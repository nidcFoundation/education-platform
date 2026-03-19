import { PageContainer } from "@/components/layout/page-container";
import { DocumentUploadForm } from "@/components/forms/document-upload-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getApplicantDashboardData } from "@/lib/supabase/actions";

export default async function Step4Documents() {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { documents } = await getApplicantDashboardData(user.id);

    return (
        <PageContainer title="Step 4: Document Upload" description="Upload all required supporting documents. Files must be clear, legible, and in PDF or image format.">
            <DocumentUploadForm documents={documents} />
        </PageContainer>
    );
}
