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
import {
    adminApplications,
    applicationPipeline,
    reviewerWorkloads,
} from "@/mock-data/admin";

const applicationMetrics = [
    {
        title: "Total Applicants",
        value: "1,482",
        description: "Across open application windows",
        icon: Users,
    },
    {
        title: "Pending Review",
        value: "346",
        description: "Need reviewer assignment or decision",
        icon: ClipboardCheck,
    },
    {
        title: "Interviews Scheduled",
        value: "74",
        description: "Confirmed panel interviews next 10 days",
        icon: Clock3,
    },
    {
        title: "Decision Ready",
        value: "128",
        description: "Awaiting final approval or rejection",
        icon: FileCheck2,
    },
];

function getPriorityClass(priority: "High" | "Medium" | "Low") {
    if (priority === "High") return "bg-red-100 text-red-800";
    if (priority === "Medium") return "bg-amber-100 text-amber-800";
    return "bg-slate-100 text-slate-800";
}

export default function ApplicationsManagementPage() {
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
                            <HorizontalBarChart items={applicationPipeline} valueSuffix="%" />
                        </CardContent>
                    </Card>

                    <Card className="border-border/60">
                        <CardHeader>
                            <CardTitle>Reviewer Load</CardTitle>
                            <CardDescription>Current reviewer queues, specialisations, and average turnaround.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {reviewerWorkloads.map((reviewer) => (
                                <div key={reviewer.name} className="rounded-xl border bg-background p-4">
                                    <div className="flex items-center justify-between gap-4">
                                        <p className="font-medium">{reviewer.name}</p>
                                        <span className="text-sm font-semibold">{reviewer.queue} in queue</span>
                                    </div>
                                    <p className="mt-2 text-sm text-muted-foreground">{reviewer.specialty}</p>
                                    <p className="mt-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">{reviewer.sla}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-border/60">
                    <CardHeader className="flex flex-row items-start justify-between gap-4">
                        <div>
                            <CardTitle>Applications Queue</CardTitle>
                            <CardDescription>Live sample queue for reviewer assignment, scoring, and interview coordination.</CardDescription>
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
                                    <TableHead>Programme</TableHead>
                                    <TableHead>Priority</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Reviewer</TableHead>
                                    <TableHead>Interview</TableHead>
                                    <TableHead>Score</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {adminApplications.map((application) => (
                                    <TableRow key={application.id}>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">{application.applicant}</p>
                                                <p className="text-xs text-muted-foreground">{application.id} · {application.state}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <p>{application.program}</p>
                                                <p className="text-xs text-muted-foreground">Cohort {application.cohort}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${getPriorityClass(application.priority)}`}>
                                                {application.priority}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <ApplicationStatusBadge status={application.status} />
                                        </TableCell>
                                        <TableCell>{application.reviewer}</TableCell>
                                        <TableCell>{application.interviewWindow}</TableCell>
                                        <TableCell>{application.score === null ? "Awaiting" : `${application.score}/100`}</TableCell>
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
