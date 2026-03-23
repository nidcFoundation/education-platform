import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/ui/status-badge";
import { getAdminScholars } from "@/lib/supabase/actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ScholarProfilesPage() {
    const supabase = await createSupabaseServerClient();
    const { data: { session } } = await supabase.auth.getSession();
    const sessionUser = session?.user;

    if (!sessionUser) {
        redirect("/login");
    }

    const hasAdminFlag = [sessionUser.user_metadata?.is_admin, sessionUser.app_metadata?.is_admin].some(
        (value) => value === true || (typeof value === "string" && value.toLowerCase() === "true")
    );
    const hasAdminRole = [
        sessionUser.user_metadata?.role,
        sessionUser.app_metadata?.role,
        sessionUser.user_metadata?.account_type,
        sessionUser.app_metadata?.account_type,
    ].some((value) => typeof value === "string" && value.toLowerCase() === "admin");

    if (!hasAdminFlag && !hasAdminRole) {
        redirect("/dashboard");
    }

    const scholars = await getAdminScholars();
    const featuredScholar = scholars[0];

    return (
        <PageContainer
            title="Scholar Profiles"
            description="Detailed scholar records with progress, milestones, placement readiness, and funding context."
            action={
                <Button asChild variant="outline">
                    <Link href="/admin/scholars">Back to Scholar Management</Link>
                </Button>
            }
        >
            <div className="space-y-6">
                <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
                    <Card className="border-border/60">
                        <CardHeader>
                            <CardTitle>Scholar Roster</CardTitle>
                            <CardDescription>Open detailed profiles for scholars requiring admin attention.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {scholars.length > 0 ? (
                                scholars.map((scholar: any) => (
                                    <div
                                        key={scholar.id}
                                        className="block rounded-xl border bg-background p-4 transition-colors hover:bg-muted/20 cursor-pointer"
                                    >
                                        <div className="flex items-start gap-3">
                                            <Avatar className="h-10 w-10">
                                                <AvatarFallback className="bg-primary/10 font-semibold text-primary">
                                                    {scholar.first_name?.[0]}{scholar.last_name?.[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 text-sm">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <p className="font-semibold">{scholar.first_name} {scholar.last_name}</p>
                                                    <StatusBadge status={scholar.status || "active"} />
                                                </div>
                                                <p className="mt-1 text-muted-foreground line-clamp-1">{scholar.program || "Technology Track"}</p>
                                                <p className="mt-2 text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                                                    Cohort {scholar.cohort || "2026"} · {scholar.institution || "NTDI Academy"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center py-10 text-sm text-muted-foreground italic">No scholars found in the database.</p>
                            )}
                        </CardContent>
                    </Card>

                    {featuredScholar ? (
                        <Card className="border-border/60">
                            <CardHeader>
                                <div className="flex items-center gap-4 mb-4">
                                    <Avatar className="h-14 w-14">
                                        <AvatarFallback className="bg-primary/10 font-bold text-primary text-xl">
                                            {featuredScholar.first_name?.[0]}{featuredScholar.last_name?.[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <CardTitle className="text-xl">{featuredScholar.first_name} {featuredScholar.last_name}</CardTitle>
                                            <Badge variant="outline">{featuredScholar.id?.slice(0, 8)}</Badge>
                                            <Badge variant="secondary">Featured profile</Badge>
                                        </div>
                                        <CardDescription className="text-sm mt-1">
                                            {featuredScholar.program || "Scholar"} · {featuredScholar.institution || "NTDI Academy"} · Cohort {featuredScholar.cohort || "2026"}
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6 text-sm">
                                <div>
                                    <p className="font-medium mb-2">About Scholar</p>
                                    <p className="leading-relaxed text-muted-foreground">{featuredScholar.bio || "No biography available for this scholar record. Progress remains on track across academic and development phases."}</p>
                                </div>

                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div className="rounded-xl border bg-muted/15 p-4">
                                        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Placement track</p>
                                        <p className="mt-2 font-semibold">National Infrastructure Readiness</p>
                                    </div>
                                    <div className="rounded-xl border bg-muted/15 p-4">
                                        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Mentor Assignment</p>
                                        <p className="mt-2 font-semibold">System Unassigned</p>
                                        <p className="mt-1 text-xs text-muted-foreground italic">Assign a mentor via User Management</p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {["Data Systems", "Public Policy", "Leadership"].map((item) => (
                                        <Badge key={item} variant="outline" className="px-3 py-1 bg-background">
                                            {item}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="border-border/60 flex items-center justify-center min-h-[400px]">
                            <p className="text-muted-foreground italic">Select a scholar to view their profile details.</p>
                        </Card>
                    )}
                </div>

                <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
                    <Card className="border-border/60">
                        <CardHeader>
                            <CardTitle>Milestones and Progress</CardTitle>
                            <CardDescription>Admin view of upcoming evidence, owners, and current completion state.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                { title: "Degree Verification", status: "completed" as const, impact: "Academic compliance", dueDate: "Jan 12", evidence: "official_transcript_v1.pdf" },
                                { title: "Technical Project Alpha", status: "active" as const, impact: "Skill validation", dueDate: "Mar 20", evidence: "github_repository_link" },
                                { title: "Leadership Workshop", status: "pending" as const, impact: "Soft skill development", dueDate: "Apr 15", evidence: "attendance_certification" },
                            ].map((milestone) => {
                                const progressValue =
                                    milestone.status === "completed" ? 100 : milestone.status === "active" ? 65 : 10;

                                return (
                                    <div key={milestone.title} className="rounded-xl border bg-background p-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <p className="font-semibold">{milestone.title}</p>
                                                <p className="mt-1 text-xs text-muted-foreground">{milestone.impact}</p>
                                            </div>
                                            <StatusBadge status={milestone.status} />
                                        </div>
                                        <div className="mt-4 space-y-2">
                                            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                                                <span>Target Date</span>
                                                <span>{milestone.dueDate}</span>
                                            </div>
                                            <Progress value={progressValue} className="h-1.5" />
                                        </div>
                                        <p className="mt-3 text-[10px] uppercase tracking-[0.2em] text-primary/80 font-medium">{milestone.evidence}</p>
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>

                    <div className="space-y-6">
                        <Card className="border-border/60">
                            <CardHeader>
                                <CardTitle>Funding Lines</CardTitle>
                                <CardDescription>Allocated versus used across scholar funding categories.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {[
                                    { label: "Tuition Support", utilisation: 100, note: "Full payment made for current session", allocated: "₦1.2M", used: "₦1.2M" },
                                    { label: "Standard Stipend", utilisation: 45, note: "Monthly disbursement on track", allocated: "₦600k", used: "₦270k" },
                                ].map((line) => (
                                    <div key={line.label} className="rounded-xl border bg-background p-4">
                                        <div className="flex items-center justify-between gap-4">
                                            <p className="font-medium text-sm">{line.label}</p>
                                            <span className="text-xs font-bold text-primary">{line.utilisation}% used</span>
                                        </div>
                                        <p className="mt-2 text-xs text-muted-foreground">{line.note}</p>
                                        <div className="mt-3 flex items-center justify-between text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                                            <span>Allocated: {line.allocated}</span>
                                            <span>Used: {line.used}</span>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card className="border-border/60">
                            <CardHeader>
                                <CardTitle>Placement Pipeline</CardTitle>
                                <CardDescription>Employer and readiness stages for the featured scholar.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {[
                                    { label: "Technical Screening", status: "completed" as const, detail: "Internal readiness score: 92%" },
                                    { label: "Partner Interviews", status: "active" as const, detail: "Matching with Infrastructure Development agencies" },
                                ].map((stage) => (
                                    <div key={stage.label} className="rounded-xl border bg-background p-4">
                                        <div className="flex items-center justify-between gap-3">
                                            <p className="font-medium text-sm">{stage.label}</p>
                                            <StatusBadge status={stage.status} />
                                        </div>
                                        <p className="mt-2 text-xs text-muted-foreground">{stage.detail}</p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </PageContainer >
    );
}
