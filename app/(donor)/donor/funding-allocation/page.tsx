import {
    DonutBreakdownChart,
    HorizontalBarChart,
} from "@/components/donor/transparency-charts";
import { PageContainer } from "@/components/layout/page-container";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Banknote, Target } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getDonorDashboardData } from "@/lib/supabase/actions";
import { redirect } from "next/navigation";
import { sectorPlacementBreakdown } from "@/lib/constants";
import { DownloadButton } from "@/components/donor/download-button";

export default async function FundingAllocationPage() {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { profile, fundingRecords, sponsoredScholars, impactMetrics } = await getDonorDashboardData(user.id);

    const totalAllocated = fundingRecords.reduce((acc, curr) => acc + (curr.amount || 0), 0);

    const fundDistribution = fundingRecords.map((r, i) => ({
        label: r.programs?.name || "Support Line",
        value: r.amount || 0,
        color: ["#0f766e", "#0284c7", "#d97706", "#dc2626"][i % 4]
    }));

    const scholarFundingBreakdown = [
        { label: "Tuition & Fees", value: 65, color: "var(--primary)" },
        { label: "Monthly Stipend", value: 20, color: "#0284c7" },
        { label: "Research Lab Access", value: 10, color: "#d97706" },
        { label: "Career Mentorship", value: 5, color: "#475569" },
    ];

    const cohortSuccessRates = [
        { cohort: "2023", retention: 98, graduation: 96, placement: 92 },
        { cohort: "2024", retention: 100, graduation: 0, placement: 0 },
        { cohort: "2025", retention: 100, graduation: 0, placement: 0 },
    ];

    return (
        <PageContainer
            title="Funding Allocation"
            description="A transparent view of allocation tracking, scholar support, and the outcomes your funding is enabling."
            action={<DownloadButton />}
        >
            <div className="space-y-6">
                <div className="grid gap-6 xl:grid-cols-2">
                    <Card className="border-border/60">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Banknote className="h-4 w-4 text-primary" />
                                Fund Allocation Tracking
                            </CardTitle>
                            <CardDescription>Where donor resources are being deployed across the scholar journey.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <DonutBreakdownChart
                                items={fundDistribution}
                                totalLabel="Allocated"
                                totalValue={`₦${(totalAllocated / 1000000).toFixed(1)}M`}
                            />
                        </CardContent>
                    </Card>

                    <Card className="border-border/60">
                        <CardHeader>
                            <CardTitle>Scholar Funding Breakdown</CardTitle>
                            <CardDescription>Coverage quality across tuition, stipends, research, and leadership support.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <HorizontalBarChart items={scholarFundingBreakdown} valueSuffix="%" />
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                    <Card className="border-border/60">
                        <CardHeader>
                            <CardTitle>Scholar Support Ledger</CardTitle>
                            <CardDescription>How sponsored scholars are consuming their funding allocations.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Scholar</TableHead>
                                        <TableHead>Program</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Progress</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {sponsoredScholars.map((scholar: any) => (
                                        <TableRow key={scholar.id}>
                                            <TableCell className="font-medium">{scholar.first_name} {scholar.last_name}</TableCell>
                                            <TableCell>{scholar.program || "Tech Track"}</TableCell>
                                            <TableCell className="capitalize">{scholar.status || "active"}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{scholar.progress_score || 0}%</Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {sponsoredScholars.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-6 text-muted-foreground text-sm">
                                                No sponsored scholars assigned.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <Card className="border-border/60">
                        <CardHeader>
                            <CardTitle>Impact Metrics</CardTitle>
                            <CardDescription>Key performance and development outcomes tied to the funding portfolio.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                            {impactMetrics.map((metric: any) => (
                                <div key={metric.id} className="rounded-xl border bg-muted/20 p-4">
                                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{metric.label}</p>
                                    <p className="mt-2 text-2xl font-bold tracking-tight">{metric.value}</p>
                                    <p className="mt-1 text-sm text-muted-foreground">{metric.description}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
                    <Card className="border-border/60">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Target className="h-4 w-4 text-primary" />
                                Sector Placements
                            </CardTitle>
                            <CardDescription>Where scholars are moving after the programme and why it matters.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <HorizontalBarChart items={sectorPlacementBreakdown} valueSuffix="%" />
                        </CardContent>
                    </Card>

                    <Card className="border-border/60">
                        <CardHeader>
                            <CardTitle>Cohort Success Rates</CardTitle>
                            <CardDescription>Retention, graduation, and placement visibility by cohort.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Cohort</TableHead>
                                        <TableHead>Retention</TableHead>
                                        <TableHead>Graduation</TableHead>
                                        <TableHead>Placement</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {cohortSuccessRates.map((cohort) => (
                                        <TableRow key={cohort.cohort}>
                                            <TableCell className="font-medium">{cohort.cohort}</TableCell>
                                            <TableCell>{cohort.retention}%</TableCell>
                                            <TableCell>{cohort.graduation}%</TableCell>
                                            <TableCell>{cohort.placement}%</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </PageContainer>
    );
}
