import Link from "next/link";
import { MetricCard } from "@/components/cards/metric-card";
import { DonutBreakdownChart } from "@/components/donor/transparency-charts";
import { PageContainer } from "@/components/layout/page-container";
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
import { Flag, GraduationCap, ListChecks, Users } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getAdminCohorts } from "@/lib/supabase/actions";
import { redirect } from "next/navigation";
import { AdminCohort } from "@/types";



export default async function CohortsManagementPage() {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }
    
    const cohorts = await getAdminCohorts();

    const totalScholars = cohorts.reduce((acc: number, c: AdminCohort) => acc + (c.active_scholars_count || 0), 0);
    const avgReviewCompletion = cohorts.length > 0
        ? (cohorts.reduce((acc: number, c: AdminCohort) => acc + (c.review_completion_percentage || 0), 0) / cohorts.length).toFixed(0)
        : "0";
    const totalApplicants = cohorts.reduce((acc: number, c: AdminCohort) => acc + (c.applicants_count || 0), 0);

    const cohortMetrics = [
        { title: "Live Cohorts", value: cohorts.length.toString(), description: "Active cycle coverage", icon: GraduationCap },
        { title: "Review Completion", value: `${avgReviewCompletion}%`, description: "Average across active cycles", icon: ListChecks },
        { title: "Applicants in Cycle", value: totalApplicants.toLocaleString(), description: "Total cohort demand", icon: Users },
        { title: "Readiness Focus", value: "Interviews", description: "Current programme bottleneck", icon: Flag },
    ];

    const cohortDistribution = cohorts.map((c: AdminCohort) => ({
        label: c.year.toString(),
        value: c.active_scholars_count || 0,
        color: c.year === 2026 ? "#dc2626" : c.year === 2025 ? "#d97706" : c.year === 2024 ? "#0284c7" : "#0f766e",
        description: c.phase || "Cohort phase",
        meta: `${c.readiness_status || "Ready"}`
    }));

    return (
        <PageContainer
            title="Cohorts Management"
            description="Oversee cohort readiness, phase transitions, review completion, and funding release by year."
            action={
                <Button asChild>
                    <Link href="/admin/applications">Back to Applications</Link>
                </Button>
            }
        >
            <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {cohortMetrics.map((metric) => (
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

                <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
                    <Card className="border-border/60">
                        <CardHeader>
                            <CardTitle>Cohort Distribution</CardTitle>
                            <CardDescription>Population spread across active and onboarding cohorts.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <DonutBreakdownChart
                                items={cohortDistribution}
                                totalLabel="Tracked scholars"
                                totalValue={totalScholars.toLocaleString()}
                            />
                        </CardContent>
                    </Card>

                    <Card className="border-border/60">
                        <CardHeader>
                            <CardTitle>Cohort Focus Areas</CardTitle>
                            <CardDescription>Operational focus by cohort stage, from close-out to onboarding.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {cohorts.map((cohort: AdminCohort) => (
                                <div key={cohort.id} className="rounded-xl border bg-background p-4">
                                    <div className="flex items-center justify-between gap-4">
                                        <p className="font-medium">Cohort {cohort.year} ({cohort.programs?.name || "Program unassigned"})</p>
                                        <span className="text-sm font-semibold">{cohort.review_completion_percentage || 0}% complete</span>
                                    </div>
                                    <p className="mt-2 text-sm text-muted-foreground">{cohort.phase || "—"}</p>
                                    <p className="mt-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">{cohort.readiness_status || "—"}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-border/60">
                    <CardHeader>
                        <CardTitle>Cohort Register</CardTitle>
                        <CardDescription>Applicant counts, active scholars, funding release, and phase status by cohort.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Cohort</TableHead>
                                    <TableHead>Program</TableHead>
                                    <TableHead>Phase</TableHead>
                                    <TableHead>Applicants</TableHead>
                                    <TableHead>Active Scholars</TableHead>
                                    <TableHead>Completion</TableHead>
                                    <TableHead>Funding Released</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {cohorts.map((cohort: AdminCohort) => (
                                    <TableRow key={cohort.id}>
                                        <TableCell className="font-medium">{cohort.year}</TableCell>
                                        <TableCell>{cohort.programs?.name || "Program unassigned"}</TableCell>
                                        <TableCell>{cohort.phase}</TableCell>
                                        <TableCell>{cohort.applicants_count}</TableCell>
                                        <TableCell>{cohort.active_scholars_count}</TableCell>
                                        <TableCell>{cohort.review_completion_percentage}%</TableCell>
                                        <TableCell>N{(cohort.funding_released / 1000000).toFixed(0)}M</TableCell>
                                    </TableRow>
                                ))}
                                {cohorts.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-6 text-muted-foreground text-sm">
                                            No cohorts recorded yet.
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
