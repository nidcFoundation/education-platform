import Link from "next/link";
import { MetricCard } from "@/components/cards/metric-card";
import {
    DonutBreakdownChart,
    HorizontalBarChart,
} from "@/components/donor/transparency-charts";
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
import {
    ArrowRight,
    Banknote,
    BarChart3,
    ClipboardList,
    Flag,
    GraduationCap,
    ShieldCheck,
    Users,
} from "lucide-react";
import { getAdminDashboardData } from "@/lib/supabase/actions";
import { adminSectionLinks } from "@/lib/constants";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { resolveUserRoleForSession } from "@/lib/auth/roles";
import { redirect } from "next/navigation";

const dashboardIcons = [
    Users,
    ClipboardList,
    GraduationCap,
    Flag,
    Banknote,
    BarChart3,
];

export default async function AdminDashboardPage() {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const role = await resolveUserRoleForSession(supabase, user);
    if (role !== "admin" && role !== "reviewer") {
        redirect("/dashboard"); // Redirect to their safe dashboard
    }

    const {
        counts,
        applicationCounts,
        averageReviewCompletion,
        totalFunding,
        fundingDistribution,
        applications,
        cohorts,
        programs,
    } = await getAdminDashboardData();

    const totalCohortPopulation = cohorts.reduce((sum: number, cohort: any) => sum + (cohort.active_scholars_count || 0), 0);

    const formatCurrency = (amount: number) => {
        if (amount >= 1e9) return `₦${(amount / 1e9).toFixed(2)}B`;
        if (amount >= 1e6) return `₦${(amount / 1e6).toFixed(1)}M`;
        return `₦${amount.toLocaleString()}`;
    };

    const adminDashboardMetrics = [
        { title: "Active Scholars", value: counts.scholars.toLocaleString(), description: "Currently enrolled", trend: { value: 12, isPositive: true } },
        { title: "Review Queue", value: (applicationCounts.reviewQueue || 0).toLocaleString(), description: "Submitted/Under-review applications", trend: { value: 0, isPositive: true } },
        { title: "Cohort Completion", value: `${averageReviewCompletion}%`, description: "Average across tracked cohorts", trend: { value: 0, isPositive: true } },
        { title: "Active Programs", value: programs.length.toString(), description: "Deployment tracks", trend: { value: 0, isPositive: true } },
        { title: "Funding Committed", value: formatCurrency(totalFunding), description: "Tracked donor commitments", trend: { value: 0, isPositive: true } },
        { title: "Total Applications", value: (applicationCounts.total || 0).toLocaleString(), description: "Incoming and active records", trend: { value: 0, isPositive: true } },
    ];

    const adminCohortDistribution = cohorts.map((c: any) => ({
        label: `Cohort ${c.year}`,
        value: c.active_scholars_count || 0,
        color: `hsl(var(--primary) / ${0.5 + Math.random() * 0.5})`
    }));

    const adminProgramPerformance = programs.slice(0, 5).map((p: any) => ({
        label: p.name,
        value: p.completion_rate || 0,
        color: "var(--primary)"
    }));

    return (
        <PageContainer
            title="Admin Dashboard"
            description="Run platform-wide operations across applications, scholars, cohorts, funding, reporting, users, and content."
            action={
                <Button asChild>
                    <Link href="/admin/applications/review">
                        Open Application Review <ArrowRight className="ml-1" />
                    </Link>
                </Button>
            }
        >
            <div className="space-y-6">
                <Card className="border-border/60 bg-[linear-gradient(135deg,rgba(15,118,110,0.12),rgba(255,255,255,0.98)_45%,rgba(226,244,250,0.95))]">
                    <CardContent className="p-6 md:p-8">
                        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
                            <div className="space-y-5">
                                <div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h2 className="text-2xl font-semibold tracking-tight">Platform Control Tower</h2>
                                        <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                                            Operations healthy
                                        </span>
                                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                                            {(cohorts[0] as any)?.year || "2026"} intake cycle
                                        </span>
                                    </div>
                                    <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
                                        Central oversight for intake, scholar delivery, funding deployment, sponsor stewardship,
                                        publishing, and platform governance.
                                    </p>
                                </div>

                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div className="rounded-xl border bg-background/85 p-4">
                                        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Current focus</p>
                                        <p className="mt-2 font-semibold">2026 application review and scholarship onboarding</p>
                                        <p className="mt-1 text-sm text-muted-foreground">Reviewer queues, interviews, and funding reservations are all active.</p>
                                    </div>
                                    <div className="rounded-xl border bg-background/85 p-4">
                                        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Control objective</p>
                                        <p className="mt-2 text-3xl font-bold tracking-tight">92%</p>
                                        <p className="mt-1 text-sm text-muted-foreground">Programme-wide performance target across completion and placement.</p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    <Button asChild variant="outline">
                                        <Link href="/admin/funding">Open Funding Management</Link>
                                    </Button>
                                    <Button asChild variant="outline">
                                        <Link href="/admin/users">Review User Access</Link>
                                    </Button>
                                </div>
                            </div>

                            <div className="rounded-2xl border bg-background/88 p-5 shadow-sm">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="h-4 w-4 text-primary" />
                                    <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Operational Pulse</p>
                                </div>
                                <div className="mt-4 space-y-4">
                                    {[
                                        { label: "Review queue", value: (applicationCounts.reviewQueue || 0).toLocaleString(), detail: "Applications pending internal reviewer action" },
                                        { label: "Active scholars", value: counts.scholars.toLocaleString(), detail: "Scholars currently tracked across all programs" },
                                        { label: "Live cohorts", value: cohorts.length.toString(), detail: "Scholar intake windows currently being managed" },
                                    ].map((item) => (
                                        <div key={item.label} className="rounded-xl border bg-muted/15 p-4">
                                            <div className="flex items-center justify-between gap-3">
                                                <p className="font-medium">{item.label}</p>
                                                <span className="text-lg font-bold tracking-tight">{item.value}</span>
                                            </div>
                                            <p className="mt-2 text-sm text-muted-foreground">{item.detail}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
                    {adminDashboardMetrics.map((metric, index) => (
                        <MetricCard
                            key={metric.title}
                            title={metric.title}
                            value={metric.value}
                            description={metric.description}
                            trend={metric.trend}
                            icon={dashboardIcons[index]}
                            className="border-border/60"
                        />
                    ))}
                </div>

                <div className="grid gap-6 xl:grid-cols-2">
                    <Card className="border-border/60">
                        <CardHeader>
                            <CardTitle>Cohort Distribution</CardTitle>
                            <CardDescription>Live population across programme years and selection windows.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <DonutBreakdownChart
                                items={adminCohortDistribution}
                                totalLabel="Scholars tracked"
                                totalValue={totalCohortPopulation.toLocaleString()}
                            />
                        </CardContent>
                    </Card>

                    <Card className="border-border/60">
                        <CardHeader>
                            <CardTitle>Program Performance</CardTitle>
                            <CardDescription>Composite completion and placement signal by programme area.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <HorizontalBarChart items={adminProgramPerformance} valueSuffix="%" />
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                    <Card className="border-border/60">
                        <CardHeader className="flex flex-row items-start justify-between gap-4">
                            <div>
                                <CardTitle>Review Queue Snapshot</CardTitle>
                                <CardDescription>Highest-priority applications currently moving through admin review.</CardDescription>
                            </div>
                            <Button asChild variant="outline" size="sm">
                                <Link href="/admin/applications">Open queue</Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Application</TableHead>
                                        <TableHead>Programme</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {applications.slice(0, 4).map((application: any) => {
                                        const firstName = typeof application.profiles?.first_name === "string"
                                            ? application.profiles.first_name.trim()
                                            : "";
                                        const lastName = typeof application.profiles?.last_name === "string"
                                            ? application.profiles.last_name.trim()
                                            : "";
                                        const emailLocalPart = typeof application.profiles?.email === "string"
                                            ? application.profiles.email.split("@")[0]
                                            : "";
                                        const displayName = [firstName, lastName].filter(Boolean).join(" ") || emailLocalPart || "Applicant";

                                        return (
                                            <TableRow key={application.id}>
                                                <TableCell>
                                                    <div>
                                                        <p className="font-medium text-sm">{displayName}</p>
                                                        <p className="text-xs text-muted-foreground">{application.id.slice(0, 8)}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-xs max-w-[150px] truncate">
                                                    {application.programs?.name || "Unassigned"}
                                                </TableCell>
                                                <TableCell>
                                                    <ApplicationStatusBadge status={application.status} />
                                                </TableCell>
                                                <TableCell className="text-xs text-muted-foreground italic">
                                                    {new Date(application.created_at).toLocaleDateString()}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                    {applications.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center text-muted-foreground py-8">No applications in queue.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <Card className="border-border/60">
                        <CardHeader>
                            <CardTitle>Funding Coverage</CardTitle>
                            <CardDescription>How programme funding is currently deployed across the platform.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {(fundingDistribution || []).map((item) => (
                                <div key={item.label} className="rounded-xl border bg-background p-4">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="font-medium">{item.label}</p>
                                            <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                                        </div>
                                        <span className="text-sm font-semibold">{item.value}%</span>
                                    </div>
                                    <p className="mt-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">{item.meta}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-border/60">
                    <CardHeader>
                        <CardTitle>Admin Workspaces</CardTitle>
                        <CardDescription>Move between the operational surfaces that run the platform.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {adminSectionLinks.map((section) => (
                            <Link key={section.href} href={section.href} className="rounded-xl border bg-background p-4 transition-colors hover:bg-muted/20">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="font-semibold">{section.title}</p>
                                        <p className="mt-2 text-sm text-muted-foreground">{section.description}</p>
                                    </div>
                                    <ArrowRight className="h-4 w-4 shrink-0 text-primary" />
                                </div>
                                <p className="mt-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">{section.meta}</p>
                            </Link>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </PageContainer>
    );
}
