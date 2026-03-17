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
import {
    adminCohortDistribution,
    adminCohorts,
} from "@/mock-data/admin";

const cohortMetrics = [
    { title: "Live Cohorts", value: "4", description: "2023 to 2026 cycle coverage", icon: GraduationCap },
    { title: "Review Completion", value: "71%", description: "For the 2026 intake queue", icon: ListChecks },
    { title: "Applicants in Cycle", value: "1,482", description: "Current 2026 cohort demand", icon: Users },
    { title: "Readiness Focus", value: "Interviews", description: "Current programme-office bottleneck", icon: Flag },
];

export default function CohortsManagementPage() {
    const totalCohortPopulation = adminCohortDistribution
        .reduce((sum, cohort) => sum + cohort.value, 0)
        .toLocaleString();

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
                                items={adminCohortDistribution}
                                totalLabel="Tracked scholars"
                                totalValue={totalCohortPopulation}
                            />
                        </CardContent>
                    </Card>

                    <Card className="border-border/60">
                        <CardHeader>
                            <CardTitle>Cohort Focus Areas</CardTitle>
                            <CardDescription>Operational focus by cohort stage, from close-out to onboarding.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {adminCohorts.map((cohort) => (
                                <div key={cohort.year} className="rounded-xl border bg-background p-4">
                                    <div className="flex items-center justify-between gap-4">
                                        <p className="font-medium">Cohort {cohort.year}</p>
                                        <span className="text-sm font-semibold">{cohort.reviewCompletion}% complete</span>
                                    </div>
                                    <p className="mt-2 text-sm text-muted-foreground">{cohort.phase}</p>
                                    <p className="mt-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">{cohort.readiness}</p>
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
                                    <TableHead>Phase</TableHead>
                                    <TableHead>Applicants</TableHead>
                                    <TableHead>Active Scholars</TableHead>
                                    <TableHead>Review Completion</TableHead>
                                    <TableHead>Funding Released</TableHead>
                                    <TableHead>Readiness</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {adminCohorts.map((cohort) => (
                                    <TableRow key={cohort.year}>
                                        <TableCell className="font-medium">{cohort.year}</TableCell>
                                        <TableCell>{cohort.phase}</TableCell>
                                        <TableCell>{cohort.applicants}</TableCell>
                                        <TableCell>{cohort.activeScholars}</TableCell>
                                        <TableCell>{cohort.reviewCompletion}%</TableCell>
                                        <TableCell>{cohort.fundingReleased}</TableCell>
                                        <TableCell>{cohort.readiness}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </PageContainer>
    );
}
