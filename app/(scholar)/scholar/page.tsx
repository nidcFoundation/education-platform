import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
    ArrowRight,
    Banknote,
    Briefcase,
    Flag,
    GraduationCap,
    Megaphone,
    MessageSquare,
    Target,
    TrendingUp,
} from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getScholarDashboardData } from "@/lib/supabase/actions";
import { redirect } from "next/navigation";

const widgetIcons = [GraduationCap, Target, TrendingUp, Banknote, Flag];

export default async function ScholarDashboardPage() {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const {
        profile,
        milestones,
        announcements,
        impactMetrics,
        fundingRecords,
        mentorSessions
    } = await getScholarDashboardData(user.id);

    // Fallback to sensible defaults or parts of mock data if new fields are empty
    const fullName = profile ? `${profile.first_name} ${profile.last_name}` : "Scholar Name";
    const cohort = profile?.cohort || "2024";
    const scholarId = profile?.scholar_id || "SCH-Pending";
    const bio = profile?.bio || "No bio available.";
    const focusAreas = profile?.focus_areas || [];
    const program = profile?.program || "Program Pending";
    const institution = profile?.institution || "Institution Pending";
    const mentorName = mentorSessions[0]?.mentor_name || "Assigned Mentor";
    const mentorTitle = mentorSessions[0]?.mentor_title || "Program Mentor";

    const completedMilestones = milestones.filter((m: any) => m.status === "completed").length;
    const totalMilestones = milestones.length;
    const activeAnnouncements = announcements.slice(0, 3);
    const latestMentorNote = mentorSessions.length > 0 ? mentorSessions[0] : null;

    const totalFunding = fundingRecords.reduce((acc: number, curr: any) => acc + Number(curr.amount), 0);
    const formattedFunding = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(totalFunding);

    const scholarDashboardStats = [
        { title: "Program Enrolled", value: program, description: institution },
        { title: "Cohort", value: cohort, description: profile?.level || "Scholar" },
        { title: "Progress Score", value: `${profile?.progress_score || 0}%`, description: "Academic and impact score" },
        { title: "Funding Support", value: formattedFunding, description: "Total disbursed support" },
        { title: "Milestones", value: `${completedMilestones} / ${totalMilestones}`, description: "Completed or on-track" },
    ];

    const readinessTracks = [
        { label: "Academic growth", value: profile?.academic_score || 0, detail: "Current academic standing." },
        { label: "Career placement progress", value: profile?.placement_score || 0, detail: "Deployment readiness." },
        { label: "Impact tracking", value: profile?.impact_score || 0, detail: "Service and community output." },
    ];

    return (
        <PageContainer
            title="Scholar Dashboard"
            description="Track academic growth, career placement progress, funding support, and national impact from one workspace."
            action={
                <Button asChild className="font-semibold">
                    <Link href="/scholar/progress-reports">
                        Review Latest Report <ArrowRight className="ml-1" />
                    </Link>
                </Button>
            }
        >
            <div className="space-y-6">
                <Card className="border-border/60 bg-[linear-gradient(135deg,rgba(90,200,120,0.12),rgba(255,255,255,0.96)_48%,rgba(211,240,224,0.75))]">
                    <CardContent className="p-6 md:p-8">
                        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                            <div className="space-y-5">
                                <div className="flex items-start gap-4">
                                    <Avatar size="lg" className="h-16 w-16 ring-4 ring-background shadow-sm">
                                        <AvatarFallback className="bg-primary/12 text-primary text-lg font-semibold">
                                            {fullName.split(" ").map(n => n[0]).join("")}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="space-y-2">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h2 className="text-2xl font-semibold tracking-tight">{fullName}</h2>
                                            <Badge variant="secondary">Cohort {cohort}</Badge>
                                            <Badge variant="outline">{scholarId}</Badge>
                                        </div>
                                        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                                            {bio}
                                        </p>
                                        <div className="flex flex-wrap gap-2 pt-1">
                                            {focusAreas.map((area: string) => (
                                                <Badge key={area} variant="outline" className="bg-background/70">
                                                    {area}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div className="rounded-xl border bg-background/80 p-4">
                                        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Current Track</p>
                                        <p className="mt-2 font-semibold">{program}</p>
                                        <p className="mt-1 text-sm text-muted-foreground">{institution}</p>
                                    </div>
                                    <div className="rounded-xl border bg-background/80 p-4">
                                        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Mentor</p>
                                        <p className="mt-2 font-semibold">{mentorName}</p>
                                        <p className="mt-1 text-sm text-muted-foreground">{mentorTitle}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-2xl border bg-background/80 p-5 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Readiness Overview</p>
                                        <h3 className="mt-2 text-lg font-semibold">Scholar standing is on-track</h3>
                                    </div>
                                    <Badge className="bg-primary text-primary-foreground">{profile?.composite_score || 0}% composite</Badge>
                                </div>

                                <div className="mt-5 space-y-4">
                                    {readinessTracks.map((track) => (
                                        <div key={track.label} className="space-y-2">
                                            <div className="flex items-center justify-between gap-4">
                                                <div>
                                                    <p className="font-medium">{track.label}</p>
                                                    <p className="text-xs text-muted-foreground">{track.detail}</p>
                                                </div>
                                                <span className="text-sm font-semibold">{track.value}%</span>
                                            </div>
                                            <Progress value={track.value} className="h-2" />
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-5 rounded-xl border border-primary/20 bg-primary/5 p-4">
                                    <p className="text-sm font-semibold">Milestone momentum</p>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {completedMilestones} milestones completed, {totalMilestones - completedMilestones} still in delivery.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                    {scholarDashboardStats.map((stat, index) => {
                        const Icon = widgetIcons[index];
                        const isLongValue = stat.title === "Program Enrolled";

                        return (
                            <Card key={stat.title} className="border-border/60">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between gap-3">
                                        <CardTitle className="text-sm text-muted-foreground">{stat.title}</CardTitle>
                                        <Icon className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className={isLongValue ? "text-lg font-semibold leading-snug" : "text-3xl font-bold tracking-tight"}>
                                        {stat.value}
                                    </div>
                                    <p className="mt-2 text-xs text-muted-foreground">{stat.description}</p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                <div className="grid gap-6 xl:grid-cols-3">
                    <Card className="border-border/60">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-primary" />
                                Academic Growth
                            </CardTitle>
                            <CardDescription>Current performance signals across academic delivery and leadership.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                { label: "Current CGPA", value: profile?.cgpa || "N/A", change: "Updated this term" },
                                { label: "Credits Completed", value: profile?.credits_completed || 0, change: "Cumulative" },
                                { label: "Research Hours", value: profile?.research_hours || 0, change: "Logged this month" },
                            ].map((metric, index, arr) => (
                                <div key={metric.label}>
                                    <div className="flex items-end justify-between gap-4">
                                        <div>
                                            <p className="font-medium">{metric.label}</p>
                                            <p className="text-xs text-muted-foreground">{metric.change}</p>
                                        </div>
                                        <span className="text-lg font-semibold">{metric.value}</span>
                                    </div>
                                    {index < arr.length - 1 && <Separator className="mt-4" />}
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="border-border/60">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Briefcase className="h-4 w-4 text-primary" />
                                Career Placement Progress
                            </CardTitle>
                            <CardDescription>Partner matching, interviews, and deployment readiness.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {milestones.filter((m: any) => m.category === 'internships' || m.category === 'industry placements').map((stage: any, index: number, arr: any[]) => (
                                <div key={stage.id} className="flex gap-3">
                                    <div className="mt-1 flex flex-col items-center">
                                        <div className={`h-3 w-3 rounded-full ${stage.status === "completed" ? "bg-primary" : stage.status === "active" ? "bg-amber-500" : "bg-muted-foreground/30"}`} />
                                        {index < arr.length - 1 && <div className="mt-2 h-10 w-px bg-border" />}
                                    </div>
                                    <div className="pb-4">
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium">{stage.title}</p>
                                            <Badge variant="outline" className="capitalize">
                                                {stage.status}
                                            </Badge>
                                        </div>
                                        <p className="mt-1 text-sm text-muted-foreground">{stage.impact_description}</p>
                                    </div>
                                </div>
                            ))}
                            {milestones.filter((m: any) => m.category === 'internships' || m.category === 'industry placements').length === 0 && (
                                <p className="text-sm text-muted-foreground">No placement milestones scheduled.</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="border-border/60">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Target className="h-4 w-4 text-primary" />
                                Impact Tracking
                            </CardTitle>
                            <CardDescription>Outputs that show public value beyond classroom performance.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {impactMetrics.map((item: any, indexValue: number) => (
                                <div key={item.id}>
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <p className="font-medium">{item.label}</p>
                                            <p className="text-xs text-muted-foreground">{item.description}</p>
                                        </div>
                                        <span className="text-lg font-semibold">{item.value} {item.unit}</span>
                                    </div>
                                    {indexValue < impactMetrics.length - 1 && <Separator className="mt-4" />}
                                </div>
                            ))}
                            {impactMetrics.length === 0 && (
                                <p className="text-sm text-muted-foreground">No impact metrics logged yet.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                    <Card className="border-border/60">
                        <CardHeader className="flex flex-row items-start justify-between gap-4">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Megaphone className="h-4 w-4 text-primary" />
                                    Latest Announcements
                                </CardTitle>
                                <CardDescription>Programme office, research desk, and placement updates.</CardDescription>
                            </div>
                            <Button asChild variant="outline" size="sm">
                                <Link href="/scholar/announcements">View all</Link>
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {activeAnnouncements.map((announcement: any, indexVal: number) => (
                                <div key={announcement.id}>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Badge className={announcement.priority === "High" ? "bg-amber-100 text-amber-800 hover:bg-amber-100" : "bg-slate-100 text-slate-700 hover:bg-slate-100"}>
                                            {announcement.priority} priority
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">{new Date(announcement.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <p className="mt-2 font-semibold">{announcement.title}</p>
                                    <p className="mt-1 text-sm text-muted-foreground">{announcement.summary}</p>
                                    {indexVal < activeAnnouncements.length - 1 && <Separator className="mt-4" />}
                                </div>
                            ))}
                            {activeAnnouncements.length === 0 && (
                                <p className="text-sm text-muted-foreground">No recent announcements.</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="border-border/60">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MessageSquare className="h-4 w-4 text-primary" />
                                Mentor Feedback
                            </CardTitle>
                            <CardDescription>The latest view from your assigned mentor and support team.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {latestMentorNote ? (
                                <>
                                    <div className="rounded-xl border bg-muted/30 p-4">
                                        <div className="flex items-center justify-between gap-3">
                                            <div>
                                                <p className="font-semibold">{latestMentorNote.theme}</p>
                                                <p className="text-xs text-muted-foreground">{new Date(latestMentorNote.date).toLocaleDateString()} · {mentorName}</p>
                                            </div>
                                            <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                                                {latestMentorNote.sentiment}
                                            </Badge>
                                        </div>
                                        <p className="mt-3 text-sm leading-6 text-muted-foreground">{latestMentorNote.summary}</p>
                                    </div>

                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Key strengths</p>
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {latestMentorNote.strengths?.map((strength: string) => (
                                                    <Badge key={strength} variant="outline">
                                                        {strength}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Next actions</p>
                                            <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                                                {latestMentorNote.action_items?.map((item: string) => (
                                                    <li key={item} className="flex gap-2">
                                                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                                                        <span>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="rounded-xl border border-dashed bg-muted/20 p-4 text-sm text-muted-foreground">
                                    No mentor feedback has been posted yet. Check back after your next mentor session.
                                </div>
                            )}

                            <Button asChild variant="outline" className="w-full">
                                <Link href="/scholar/mentor-feedback">Open Mentor Timeline</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </PageContainer>
    );
}
