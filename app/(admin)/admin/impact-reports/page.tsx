import Link from "next/link";
import { MetricCard } from "@/components/cards/metric-card";
import { HorizontalBarChart } from "@/components/donor/transparency-charts";
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
import { BookMarked, ChartColumn, FileCheck2, FileText } from "lucide-react";
import {
    adminImpactReports,
    reportCoverageBreakdown,
} from "@/mock-data/impact-reports";

const impactMetrics = [
    { title: "Active Reports", value: "4", description: "In production, review, or published", icon: FileText },
    { title: "Ready to Send", value: "1", description: "Prepared for stakeholder distribution", icon: FileCheck2 },
    { title: "Data Confidence", value: "90%", description: "Average confidence across the current pack", icon: ChartColumn },
    { title: "Audiences", value: "4", description: "Board, sponsors, public, and directors", icon: BookMarked },
];

function getReportStatusClass(status: "Draft" | "In review" | "Ready" | "Published") {
    if (status === "Published") return "bg-emerald-100 text-emerald-800";
    if (status === "Ready") return "bg-blue-100 text-blue-800";
    if (status === "In review") return "bg-amber-100 text-amber-800";
    return "bg-slate-100 text-slate-800";
}

export default function ImpactReportsPage() {
    return (
        <PageContainer
            title="Impact Reports"
            description="Coordinate operational, sponsor, and public impact reporting across the platform."
            action={
                <Button asChild variant="outline">
                    <Link href="/admin/content">Open Content Management</Link>
                </Button>
            }
        >
            <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {impactMetrics.map((metric) => (
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
                            <CardTitle>Report Coverage</CardTitle>
                            <CardDescription>Coverage health for board, sponsor, and public reporting outputs.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <HorizontalBarChart items={reportCoverageBreakdown} valueSuffix="%" />
                        </CardContent>
                    </Card>

                    <Card className="border-border/60">
                        <CardHeader>
                            <CardTitle>Reporting Priorities</CardTitle>
                            <CardDescription>Current report pipeline with due dates and data readiness.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {adminImpactReports.map((report) => (
                                <div key={report.title} className="rounded-xl border bg-background p-4">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="font-medium">{report.title}</p>
                                            <p className="mt-1 text-sm text-muted-foreground">{report.period} · {report.audience}</p>
                                        </div>
                                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${getReportStatusClass(report.status)}`}>
                                            {report.status}
                                        </span>
                                    </div>
                                    <p className="mt-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                        Due {report.dueDate} · {report.confidence}
                                    </p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-border/60">
                    <CardHeader>
                        <CardTitle>Impact Report Register</CardTitle>
                        <CardDescription>Report ownership, audiences, timelines, and readiness across the current reporting cycle.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Report</TableHead>
                                    <TableHead>Period</TableHead>
                                    <TableHead>Owner</TableHead>
                                    <TableHead>Audience</TableHead>
                                    <TableHead>Due Date</TableHead>
                                    <TableHead>Confidence</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {adminImpactReports.map((report) => (
                                    <TableRow key={report.title}>
                                        <TableCell className="font-medium">{report.title}</TableCell>
                                        <TableCell>{report.period}</TableCell>
                                        <TableCell>{report.owner}</TableCell>
                                        <TableCell>{report.audience}</TableCell>
                                        <TableCell>{report.dueDate}</TableCell>
                                        <TableCell>{report.confidence}</TableCell>
                                        <TableCell>
                                            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${getReportStatusClass(report.status)}`}>
                                                {report.status}
                                            </span>
                                        </TableCell>
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
