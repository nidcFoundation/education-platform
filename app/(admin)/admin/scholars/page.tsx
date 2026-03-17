import Link from "next/link";
import { MetricCard } from "@/components/cards/metric-card";
import { HorizontalBarChart } from "@/components/donor/transparency-charts";
import { PageContainer } from "@/components/layout/page-container";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Banknote, Briefcase, Flag, TrendingUp } from "lucide-react";
import {
    adminScholars,
    scholarHealthBreakdown,
    scholarManagementFocus,
} from "@/mock-data/admin";

const scholarMetrics = [
    {
        title: "Active Scholars",
        value: "864",
        description: "Live across 4 cohorts",
        icon: TrendingUp,
    },
    {
        title: "Milestones Due",
        value: "143",
        description: "Need evidence or owner follow-up",
        icon: Flag,
    },
    {
        title: "Placement Watchlist",
        value: "19",
        description: "Require partner intervention",
        icon: Briefcase,
    },
    {
        title: "Funding Watchlist",
        value: "34",
        description: "Accounts needing disbursement review",
        icon: Banknote,
    },
];

export default function ScholarManagementPage() {
    return (
        <PageContainer
            title="Scholar Management"
            description="Track scholar progress, update milestones, manage placements, and monitor funding health."
            action={
                <Button asChild>
                    <Link href="/admin/scholars/profiles">Open Scholar Profiles</Link>
                </Button>
            }
        >
            <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {scholarMetrics.map((metric) => (
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

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {scholarManagementFocus.map((focus) => (
                        <Card key={focus.title} className="border-border/60">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base">{focus.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">{focus.description}</p>
                                <p className="mt-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">{focus.metric}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
                    <Card className="border-border/60">
                        <CardHeader>
                            <CardTitle>Scholar Health Overview</CardTitle>
                            <CardDescription>Platform-wide health signal spanning progression, placement, and funding risk.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <HorizontalBarChart items={scholarHealthBreakdown} valueSuffix="%" />
                        </CardContent>
                    </Card>

                    <Card className="border-border/60">
                        <CardHeader>
                            <CardTitle>Progress and Funding Watchlist</CardTitle>
                            <CardDescription>Lowest-performing or highest-risk scholars needing immediate operational action.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {adminScholars
                                .slice()
                                .sort((left, right) => left.progress - right.progress)
                                .slice(0, 3)
                                .map((scholar) => (
                                    <div key={scholar.id} className="rounded-xl border bg-background p-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <p className="font-medium">{scholar.name}</p>
                                                <p className="text-sm text-muted-foreground">{scholar.program}</p>
                                            </div>
                                            <StatusBadge status={scholar.status} />
                                        </div>
                                        <div className="mt-4 space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">Progress</span>
                                                <span className="font-semibold">{scholar.progress}%</span>
                                            </div>
                                            <Progress value={scholar.progress} className="h-2" />
                                        </div>
                                        <p className="mt-4 text-sm text-muted-foreground">
                                            Next milestone: {scholar.nextMilestone}
                                        </p>
                                    </div>
                                ))}
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-border/60">
                    <CardHeader className="flex flex-row items-start justify-between gap-4">
                        <div>
                            <CardTitle>Scholar Operations Queue</CardTitle>
                            <CardDescription>Track academic progress, milestone completion, placement status, and funding utilisation.</CardDescription>
                        </div>
                        <Button asChild variant="outline" size="sm">
                            <Link href="/admin/scholars/profiles">Open profiles</Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Scholar</TableHead>
                                    <TableHead>Cohort</TableHead>
                                    <TableHead>Progress</TableHead>
                                    <TableHead>Milestones</TableHead>
                                    <TableHead>Placement</TableHead>
                                    <TableHead>Funding</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {adminScholars.map((scholar) => (
                                    <TableRow key={scholar.id}>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">{scholar.name}</p>
                                                <p className="text-xs text-muted-foreground">{scholar.program}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>{scholar.cohort}</TableCell>
                                        <TableCell className="min-w-44">
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span>{scholar.progress}%</span>
                                                    <StatusBadge status={scholar.status} />
                                                </div>
                                                <Progress value={scholar.progress} className="h-2" />
                                            </div>
                                        </TableCell>
                                        <TableCell>{scholar.milestones}</TableCell>
                                        <TableCell>{scholar.placement}</TableCell>
                                        <TableCell>{scholar.fundingUtilisation}% utilised</TableCell>
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
