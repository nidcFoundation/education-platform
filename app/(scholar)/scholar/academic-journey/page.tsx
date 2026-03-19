import { MetricCard } from "@/components/cards/metric-card";
import { PageContainer } from "@/components/layout/page-container";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { BookOpen, Briefcase, GraduationCap, Target, TrendingUp } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getScholarAcademicJourney } from "@/lib/supabase/actions";
import { redirect } from "next/navigation";

const capabilityGrowth = [
    {
        label: "Technical depth",
        value: 91,
        detail: "Applied modelling and research methods are strong.",
    },
    {
        label: "Policy communication",
        value: 82,
        detail: "Improving translation of evidence into decision-ready narratives.",
    },
    {
        label: "Placement readiness",
        value: 78,
        detail: "Portfolio is strong; interview storytelling is next.",
    },
];

export default async function AcademicJourneyPage() {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const {
        profile,
        courses,
        terms
    } = await getScholarAcademicJourney(user.id);

    const fullName = profile ? `${profile.first_name} ${profile.last_name}` : "Scholar Name";

    const academicGrowthMetrics = [
        { label: "Current CGPA", value: profile?.cgpa || "N/A", change: "Updated this term" },
        { label: "Credits Completed", value: profile?.credits_completed || 0, change: "Cumulative" },
        { label: "Courses Done", value: courses.length.toString(), change: "This academic year" },
        { label: "Terms Active", value: terms.length.toString(), change: "In-programme" },
    ];

    return (
        <PageContainer
            title="Academic Journey"
            description="A live view of academic growth, coursework, and readiness for deployment."
        >
            <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {academicGrowthMetrics.map((metric, index) => (
                        <MetricCard
                            key={metric.label}
                            title={metric.label}
                            value={metric.value}
                            description={metric.change}
                            icon={[TrendingUp, GraduationCap, BookOpen, Target][index]}
                        />
                    ))}
                </div>

                <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                    <Card className="border-border/60">
                        <CardHeader>
                            <CardTitle>Term Timeline</CardTitle>
                            <CardDescription>Performance and learning focus across the active academic cycles.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {terms.map((term: any, index: number) => (
                                <div key={term.id} className="flex gap-4">
                                    <div className="mt-1 flex flex-col items-center">
                                        <div className="h-3 w-3 rounded-full bg-primary" />
                                        {index < terms.length - 1 && <div className="mt-2 h-16 w-px bg-border" />}
                                    </div>
                                    <div className="pb-5">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <p className="font-semibold">{term.term}</p>
                                            <Badge variant="outline">GPA {term.gpa}</Badge>
                                        </div>
                                        <p className="mt-2 text-sm text-muted-foreground">{term.highlight}</p>
                                        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">{term.focus}</p>
                                    </div>
                                </div>
                            ))}
                            {terms.length === 0 && (
                                <p className="text-sm text-muted-foreground">No academic terms recorded yet.</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="border-border/60">
                        <CardHeader>
                            <CardTitle>Current Coursework</CardTitle>
                            <CardDescription>Modules shaping current academic growth and research readiness.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {courses.map((course: any, index: number) => (
                                <div key={course.id}>
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <div>
                                            <p className="font-medium">{course.title}</p>
                                            <p className="text-xs text-muted-foreground">{course.credits} credits · {course.note}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="capitalize">{course.status}</Badge>
                                            <span className="text-sm font-semibold">{course.score || "N/A"}</span>
                                        </div>
                                    </div>
                                    {index < courses.length - 1 && <Separator className="mt-4" />}
                                </div>
                            ))}
                            {courses.length === 0 && (
                                <p className="text-sm text-muted-foreground">No courses logged yet.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <Card className="border-border/60">
                        <CardHeader>
                            <CardTitle>Capability Growth</CardTitle>
                            <CardDescription>How academic development is translating into real deployment readiness.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            {capabilityGrowth.map((item) => (
                                <div key={item.label} className="space-y-2">
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <p className="font-medium">{item.label}</p>
                                            <p className="text-xs text-muted-foreground">{item.detail}</p>
                                        </div>
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
                                <Briefcase className="h-4 w-4 text-primary" />
                                Applied Learning Focus
                            </CardTitle>
                            <CardDescription>What the current academic year is preparing you to do next.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm text-muted-foreground">
                            <div className="rounded-xl border bg-muted/20 p-4">
                                <p className="font-semibold text-foreground">Research direction</p>
                                <p className="mt-2">
                                    {profile?.research_direction || "Applied research tied to national development and sector-specific performance outcomes."}
                                </p>
                            </div>
                            <div className="rounded-xl border bg-muted/20 p-4">
                                <p className="font-semibold text-foreground">Placement objective</p>
                                <p className="mt-2">
                                    {profile?.placement_objective || "Move into a high-impact role where technical depth and leadership can drive systemic change."}
                                </p>
                            </div>
                            <div className="rounded-xl border bg-muted/20 p-4">
                                <p className="font-semibold text-foreground">Scholarship expectation</p>
                                <p className="mt-2">
                                    {profile?.scholarship_expectation || "Maintain excellent academic standing while documenting visible national service outputs each cycle."}
                                </p>
                            </div>
                            <p className="text-xs">
                                Current scholar: {fullName} · {profile?.level || "Scholar"}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </PageContainer>
    );
}
