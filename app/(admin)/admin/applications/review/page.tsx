import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminApplications, getAdminApplicationById, getAvailableCohorts } from "@/lib/supabase/actions";
import { ReviewWorkspace } from "@/components/admin/review-workspace";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { resolveUserRoleForSession } from "@/lib/auth/roles";

export default async function ApplicationReviewPage({
    searchParams,
}: {
    searchParams: Promise<{ id?: string }>;
}) {
    const { id } = await searchParams;
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const role = await resolveUserRoleForSession(supabase, user);
    if (role !== "admin" && role !== "reviewer") {
        redirect("/admin");
    }

    let application = null;
    const cohorts = await getAvailableCohorts();

    if (id) {
        application = await getAdminApplicationById(id);
    } else {
        // Fetch the first available application as a fallback for "featured"
        const allApplications = await getAdminApplications();
        const prioritizedApplication = allApplications.find((candidate) => candidate.status !== "draft");
        if (prioritizedApplication) {
            application = prioritizedApplication;
        } else if (allApplications.length > 0) {
            application = allApplications[0];
        }
    }

    if (!application) {
        return (
            <PageContainer
                title="Application Review"
                description="No application selected for review."
                action={
                    <Button asChild variant="outline">
                        <Link href="/admin/applications">Back to Applications</Link>
                    </Button>
                }
            >
                <Card className="border-border/60">
                    <CardHeader>
                        <CardTitle>No Application Found</CardTitle>
                        <CardDescription>
                            Please select an application from the queue to start a review.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild>
                            <Link href="/admin/applications">Go to Application Queue</Link>
                        </Button>
                    </CardContent>
                </Card>
            </PageContainer>
        );
    }

    return (
        <PageContainer
            title="Application Review"
            description="Assign reviewers, score the application, and issue a decision."
            action={
                <Button asChild variant="outline">
                    <Link href="/admin/applications">Back to Applications</Link>
                </Button>
            }
        >
            <ReviewWorkspace application={application} cohorts={cohorts} />
        </PageContainer>
    );
}
