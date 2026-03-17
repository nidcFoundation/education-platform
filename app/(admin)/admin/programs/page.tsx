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
import { BadgeCheck, BookOpen, GraduationCap, Wallet } from "lucide-react";
import {
    adminProgramPerformance,
    adminPrograms,
} from "@/mock-data/admin";

const programMetrics = [
    { title: "Live Programmes", value: "4", description: "Active or launch-stage tracks", icon: GraduationCap },
    { title: "Programme Demand", value: "1,482", description: "Applicants across 2026 intake", icon: BookOpen },
    { title: "Average Placement", value: "91%", description: "Across established programmes", icon: BadgeCheck },
    { title: "Budget Coverage", value: "N4.26B", description: "Tracked across programme portfolios", icon: Wallet },
];

export default function ProgramsManagementPage() {
    return (
        <PageContainer
            title="Programs Management"
            description="Manage programme capacity, performance, regional delivery, and budget allocation."
            action={
                <Button asChild>
                    <Link href="/admin/cohorts">Open Cohorts Management</Link>
                </Button>
            }
        >
            <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {programMetrics.map((metric) => (
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
                            <CardTitle>Program Performance</CardTitle>
                            <CardDescription>Composite score across completion quality and placement outcomes.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <HorizontalBarChart items={adminProgramPerformance} valueSuffix="%" />
                        </CardContent>
                    </Card>

                    <Card className="border-border/60">
                        <CardHeader>
                            <CardTitle>Programme Cards</CardTitle>
                            <CardDescription>Each programme’s capacity, lead, demand, and operating footprint.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {adminPrograms.map((program) => (
                                <div key={program.id} className="rounded-xl border bg-background p-4">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="font-medium">{program.name}</p>
                                            <p className="mt-1 text-sm text-muted-foreground">{program.campuses}</p>
                                        </div>
                                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${program.status === "active" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                                            {program.status}
                                        </span>
                                    </div>
                                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                        <div className="rounded-lg bg-muted/20 p-3">
                                            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Lead</p>
                                            <p className="mt-2 font-semibold">{program.lead}</p>
                                        </div>
                                        <div className="rounded-lg bg-muted/20 p-3">
                                            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Budget</p>
                                            <p className="mt-2 font-semibold">{program.budget}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-border/60">
                    <CardHeader>
                        <CardTitle>Programme Operations Table</CardTitle>
                        <CardDescription>Delivery coverage, applicant demand, and outcomes across the active programme set.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Programme</TableHead>
                                    <TableHead>Lead</TableHead>
                                    <TableHead>Applicants</TableHead>
                                    <TableHead>Active Scholars</TableHead>
                                    <TableHead>Completion</TableHead>
                                    <TableHead>Placement</TableHead>
                                    <TableHead>Budget</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {adminPrograms.map((program) => (
                                    <TableRow key={program.id}>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">{program.name}</p>
                                                <p className="text-xs text-muted-foreground">{program.campuses}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>{program.lead}</TableCell>
                                        <TableCell>{program.applicants}</TableCell>
                                        <TableCell>{program.activeScholars}</TableCell>
                                        <TableCell>{program.completionRate}%</TableCell>
                                        <TableCell>{program.placementRate}%</TableCell>
                                        <TableCell>{program.budget}</TableCell>
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
