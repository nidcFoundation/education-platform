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
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getAdminPrograms } from "@/lib/supabase/actions";
import { redirect } from "next/navigation";
import { AddProgramDialog } from "@/components/admin/add-program-dialog";

export default async function ProgramsManagementPage() {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const programs = await getAdminPrograms();

    const totalBudget = programs.reduce((acc: number, p: any) => acc + (p.total_budget || 0), 0);
    const totalApplicants = programs.reduce((acc: number, p: any) => acc + (p.applicants_count || 0), 0);
    const avgPlacement = programs.length > 0
        ? (programs.reduce((acc: number, p: any) => acc + (p.placement_rate || 0), 0) / programs.length).toFixed(0)
        : "0";

    const programMetrics = [
        { title: "Live Programmes", value: programs.length.toString(), description: "Active or launch-stage tracks", icon: GraduationCap },
        { title: "Programme Demand", value: totalApplicants.toLocaleString(), description: "Applicants across 2026 intake", icon: BookOpen },
        { title: "Average Placement", value: `${avgPlacement}%`, description: "Across established programmes", icon: BadgeCheck },
        { title: "Budget Coverage", value: `N${(totalBudget / 1000000000).toFixed(2)}B`, description: "Tracked across programme portfolios", icon: Wallet },
    ];

    const performanceItems = programs.map((p: any) => ({
        label: p.name,
        value: p.placement_rate || 0,
        color: p.placement_rate > 90 ? "#0f766e" : p.placement_rate > 85 ? "#0284c7" : "#d97706",
    }));

    return (
        <PageContainer
            title="Programs Management"
            description="Manage programme capacity, performance, regional delivery, and budget allocation."
            action={
                <div className="flex gap-3">
                    <Button variant="outline" asChild>
                        <Link href="/admin/cohorts">Manage Cohorts</Link>
                    </Button>
                    <AddProgramDialog />
                </div>
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
                            <HorizontalBarChart items={performanceItems} valueSuffix="%" />
                        </CardContent>
                    </Card>

                    <Card className="border-border/60">
                        <CardHeader>
                            <CardTitle>Programme Cards</CardTitle>
                            <CardDescription>Each programme’s capacity, lead, demand, and operating footprint.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {programs.map((program: any) => (
                                <div key={program.id} className="rounded-xl border bg-background p-4">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="font-medium">{program.name}</p>
                                            <p className="mt-1 text-sm text-muted-foreground">{program.campuses?.join(", ") || "No campuses listed"}</p>
                                        </div>
                                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${program.status === "active" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                                            {program.status}
                                        </span>
                                    </div>
                                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                        <div className="rounded-lg bg-muted/20 p-3">
                                            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Lead</p>
                                            <p className="mt-2 font-semibold">{program.program_lead || "Unassigned"}</p>
                                        </div>
                                        <div className="rounded-lg bg-muted/20 p-3">
                                            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Budget</p>
                                            <p className="mt-2 font-semibold">N{(program.total_budget / 1000000).toFixed(0)}M</p>
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
                                    <TableHead>Completion</TableHead>
                                    <TableHead>Placement</TableHead>
                                    <TableHead>Budget</TableHead>
                                    <TableHead>Demand (Applicants)</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {programs.map((program: any) => (
                                    <TableRow key={program.id}>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">{program.name}</p>
                                                <p className="text-xs text-muted-foreground">{program.campuses?.join(", ")}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>{program.program_lead || "—"}</TableCell>
                                        <TableCell>{program.completion_rate || 0}%</TableCell>
                                        <TableCell>{program.placement_rate || 0}%</TableCell>
                                        <TableCell>N{(program.total_budget / 1000000).toFixed(0)}M</TableCell>
                                        <TableCell>{program.applicants_count || 0}</TableCell>
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
