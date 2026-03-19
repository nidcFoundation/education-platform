import { PageContainer } from "@/components/layout/page-container";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/ui/status-badge";
import { Calendar, Flag, Target } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getScholarDashboardData } from "@/lib/supabase/actions";
import { redirect } from "next/navigation";

const categoryCompletion = [
    { label: "Course completion", value: 100 },
    { label: "Internships", value: 65 },
    { label: "Research", value: 72 },
    { label: "National service contributions", value: 92 },
    { label: "Industry placements", value: 40 },
];

export default async function MilestonesPage() {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const {
        milestones
    } = await getScholarDashboardData(user.id);

    const milestonesList = milestones.map((m: any) => ({
        id: m.id,
        title: m.title,
        category: m.category,
        status: m.status,
        dueDate: new Date(m.due_date).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' }),
        owner: m.owner || "Program Office",
        impact: m.impact_description || "Public-sector and research impact",
        evidence: m.evidence_link || "Pending upload"
    }));

    const completed = milestonesList.filter((m: any) => m.status === "completed").length;
    const active = milestonesList.filter((m: any) => m.status === "active").length;
    const upcoming = milestonesList.filter((m: any) => m.status === "upcoming").length;

    return (
        <PageContainer
            title="Milestones"
            description="Track course completion, internships, research, national service contributions, and industry placements."
        >
            <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                    {[
                        { label: "Completed", value: completed, detail: "Milestones already delivered" },
                        { label: "In progress", value: active, detail: "Current milestones under execution" },
                        { label: "Upcoming", value: upcoming, detail: "Milestones queued for the next cycle" },
                    ].map((item) => (
                        <Card key={item.label} className="border-border/60">
                            <CardContent className="p-5">
                                <p className="text-sm text-muted-foreground">{item.label}</p>
                                <p className="mt-2 text-3xl font-bold">{item.value}</p>
                                <p className="mt-1 text-xs text-muted-foreground">{item.detail}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
                    <Card className="border-border/60">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Target className="h-4 w-4 text-primary" />
                                Category Completion
                            </CardTitle>
                            <CardDescription>Required milestone areas across the scholar journey.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            {categoryCompletion.map((item) => (
                                <div key={item.label} className="space-y-2">
                                    <div className="flex items-center justify-between gap-4">
                                        <p className="font-medium">{item.label}</p>
                                        <span className="text-sm font-semibold">{item.value}%</span>
                                    </div>
                                    <Progress value={item.value} className="h-2" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="border-border/60">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Flag className="h-4 w-4 text-primary" />
                                Milestone Board
                            </CardTitle>
                            <CardDescription>Delivery detail, evidence, and impact for each core milestone.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {milestonesList.map((milestone: any) => (
                                <div key={milestone.id} className="rounded-xl border bg-background p-4">
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                        <div className="space-y-2">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <p className="font-semibold">{milestone.title}</p>
                                                <Badge variant="outline" className="capitalize">
                                                    {milestone.category}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{milestone.impact}</p>
                                        </div>
                                        <StatusBadge status={milestone.status} />
                                    </div>
                                    <div className="mt-4 grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
                                        <div className="rounded-lg bg-muted/20 p-3">
                                            <p className="text-xs uppercase tracking-[0.2em]">Due date</p>
                                            <p className="mt-2 flex items-center gap-2 text-foreground">
                                                <Calendar className="h-4 w-4 text-primary" />
                                                {milestone.dueDate}
                                            </p>
                                        </div>
                                        <div className="rounded-lg bg-muted/20 p-3">
                                            <p className="text-xs uppercase tracking-[0.2em]">Owner</p>
                                            <p className="mt-2 text-foreground">{milestone.owner}</p>
                                        </div>
                                        <div className="rounded-lg bg-muted/20 p-3">
                                            <p className="text-xs uppercase tracking-[0.2em]">Evidence</p>
                                            <p className="mt-2 text-foreground">{milestone.evidence}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {milestonesList.length === 0 && (
                                <div className="text-sm text-muted-foreground text-center py-12 border border-dashed rounded-xl">
                                    No milestones found.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </PageContainer>
    );
}
