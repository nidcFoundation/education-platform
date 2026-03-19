import Link from "next/link";
import { MetricCard } from "@/components/cards/metric-card";
import { HorizontalBarChart } from "@/components/donor/transparency-charts";
import { PageContainer } from "@/components/layout/page-container";
import { ApplicationStatusBadge } from "@/components/ui/application-status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ClipboardCheck, Clock3, FileCheck2, Users } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getAdminApplications } from "@/lib/supabase/actions";
import { redirect } from "next/navigation";

function getPriorityClass(priority: string) {
    if (priority === "High") return "bg-red-100 text-red-800";
    if (priority === "Medium") return "bg-amber-100 text-amber-800";
    return "bg-slate-100 text-slate-800";
}

export default async function ApplicationsManagementPage() {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const applications = await getAdminApplications();

    const totalApplicants = applications.length;
    const pendingReview = applications.filter((a: any) => a.status === "pending").length;
    const interviewStage = applications.filter((a: any) => a.status === "interviewing").length;
    const decisionReady = applications.filter((a: any) => a.status === "shortlisted").length;

    const applicationMetrics = [
        { title: "Total Applicants", value: totalApplicants.toLocaleString(), description: "Across open application windows", icon: Users },
        { title: "Pending Review", value: pendingReview.toString(), description: "Need reviewer assignment", icon: ClipboardCheck },
        { title: "Interviews Active", value: interviewStage.toString(), description: "Currently in interview cycle", icon: Clock3 },
        { title: "Decision Ready", value: decisionReady.toString(), description: "Awaiting final approval", icon: FileCheck2 },
    ];

    const pipelineData = [
        { label: "Intake", value: 100, color: "#475569" },
        { label: "Screening", value: Math.round((applications.filter((a: any) => a.status !== "pending").length / (totalApplicants || 1)) * 100), color: "#0284c7" },
        { label: "Interview", value: Math.round((applications.filter((a: any) => ["interviewing", "shortlisted", "accepted"].includes(a.status)).length / (totalApplicants || 1)) * 100), color: "#d97706" },
        { label: "Offer", value: Math.round((applications.filter((a: any) => a.status === "accepted").length / (totalApplicants || 1)) * 100), color: "#0f766e" },
    ];

    return (
        <PageContainer
            title="Applications Management"
            description="Monitor intake volume, reviewer queues, scoring progress, interviews, and final decisions."
            action={
                <Button asChild>
                    <Link href="/admin/applications/review">Open Application Review</Link>
                </Button>
            }
        >
            <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {applicationMetrics.map((metric) => (
                        <MetricCard
                            key={metric.title}
                            title={metric.title}
                            value={metric.value}
                            description={metric.description}
                            icon={metric.icon}
                            className="border-border/60"
                        />
                    ))}
                </div>

                <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
                    <Card className="border-border/60">
                        <CardHeader>
                            <CardTitle>Application Pipeline</CardTitle>
                            <CardDescription>Conversion from intake through final decision issuance.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <HorizontalBarChart items={pipelineData} valueSuffix="%" />
                        </CardContent>
                    </Card>

                    <Card className="border-border/60">
                        <CardHeader>
                            <CardTitle>Reviewer Load</CardTitle>
                            <CardDescription>Current reviewer queues, specialisations, and turnaround.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="rounded-xl border bg-background p-4">
                                <div className="flex items-center justify-between gap-4">
                                    <p className="font-medium">System Auto-Review</p>
                                    <span className="text-sm font-semibold">{pendingReview} in queue</span>
                                </div>
                                <p className="mt-2 text-sm text-muted-foreground">Initial screening and scoring</p>
                                <p className="mt-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">SLA: 24 Hours</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-border/60">
                    <CardHeader className="flex flex-row items-start justify-between gap-4">
                        <div>
                            <CardTitle>Applications Queue</CardTitle>
                            <CardDescription>Live queue for reviewer assignment, scoring, and interview coordination.</CardDescription>
                        </div>
                        <Button asChild variant="outline" size="sm">
                            <Link href="/admin/applications/review">Review featured application</Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Applicant</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Cohort</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Score</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {applications.map((application: any) => (
                                    <TableRow key={application.id}>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">
                                                    {application.profiles?.first_name} {application.profiles?.last_name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">{application.id.slice(0, 8)}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>{application.profiles?.email}</TableCell>
                                        <TableCell>
                                            <div>
                                                <p>Cohort {application.cohort_year}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <ApplicationStatusBadge status={application.status} />
                                        </TableCell>
                                        <TableCell>{application.score === null ? "Awaiting" : `${application.score}/100`}</TableCell>
                                    </TableRow>
                                ))}
                                {applications.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-6 text-muted-foreground text-sm">
                                            No applications submitted yet.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </PageContainer>
    );
}
