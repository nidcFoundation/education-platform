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
import {
    academicGrowthMetrics,
    impactTracking,
    mentorSessions,
    placementStages,
    scholarAnnouncements,
    scholarDashboardStats,
    scholarMilestones,
    scholarProfile,
} from "@/mock-data/scholar";

const widgetIcons = [GraduationCap, Target, TrendingUp, Banknote, Flag];

const readinessTracks = [
    { label: "Academic growth", value: 94, detail: "CGPA and course performance remain above cohort target." },
    { label: "Career placement progress", value: 78, detail: "Partner matching is active and interview prep is underway." },
    { label: "Impact tracking", value: 86, detail: "Service outputs and peer mentoring are consistently logged." },
];

export default function ScholarDashboardPage() {
    const completedMilestones = scholarMilestones.filter((milestone) => milestone.status === "completed").length;
    const activeAnnouncements = scholarAnnouncements.slice(0, 3);
    const latestMentorNote = mentorSessions.length > 0 ? mentorSessions[0] : null;

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
                                            AO
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="space-y-2">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h2 className="text-2xl font-semibold tracking-tight">{scholarProfile.fullName}</h2>
                                            <Badge variant="secondary">Cohort {scholarProfile.cohort}</Badge>
                                            <Badge variant="outline">{scholarProfile.scholarId}</Badge>
                                        </div>
                                        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                                            {scholarProfile.bio}
                                        </p>
                                        <div className="flex flex-wrap gap-2 pt-1">
                                            {scholarProfile.focusAreas.map((area) => (
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
                                        <p className="mt-2 font-semibold">{scholarProfile.program}</p>
                                        <p className="mt-1 text-sm text-muted-foreground">{scholarProfile.institution}</p>
                                    </div>
                                    <div className="rounded-xl border bg-background/80 p-4">
                                        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Mentor</p>
                                        <p className="mt-2 font-semibold">{scholarProfile.mentor}</p>
                                        <p className="mt-1 text-sm text-muted-foreground">{scholarProfile.mentorTitle}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-2xl border bg-background/80 p-5 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Readiness Overview</p>
                                        <h3 className="mt-2 text-lg font-semibold">Scholar standing is on-track</h3>
                                    </div>
                                    <Badge className="bg-primary text-primary-foreground">84% composite</Badge>
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
                                        {completedMilestones} milestones completed, {scholarMilestones.length - completedMilestones} still in delivery.
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
                            {academicGrowthMetrics.map((metric, index) => (
                                <div key={metric.label}>
                                    <div className="flex items-end justify-between gap-4">
                                        <div>
                                            <p className="font-medium">{metric.label}</p>
                                            <p className="text-xs text-muted-foreground">{metric.change}</p>
                                        </div>
                                        <span className="text-lg font-semibold">{metric.value}</span>
                                    </div>
                                    {index < academicGrowthMetrics.length - 1 && <Separator className="mt-4" />}
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
                            {placementStages.map((stage, index) => (
                                <div key={stage.label} className="flex gap-3">
                                    <div className="mt-1 flex flex-col items-center">
                                        <div className={`h-3 w-3 rounded-full ${stage.status === "completed" ? "bg-primary" : stage.status === "active" ? "bg-amber-500" : "bg-muted-foreground/30"}`} />
                                        {index < placementStages.length - 1 && <div className="mt-2 h-10 w-px bg-border" />}
                                    </div>
                                    <div className="pb-4">
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium">{stage.label}</p>
                                            <Badge variant="outline" className="capitalize">
                                                {stage.status}
                                            </Badge>
                                        </div>
                                        <p className="mt-1 text-sm text-muted-foreground">{stage.detail}</p>
                                    </div>
                                </div>
                            ))}
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
                            {impactTracking.map((item, index) => (
                                <div key={item.label}>
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <p className="font-medium">{item.label}</p>
                                            <p className="text-xs text-muted-foreground">{item.detail}</p>
                                        </div>
                                        <span className="text-lg font-semibold">{item.value}</span>
                                    </div>
                                    {index < impactTracking.length - 1 && <Separator className="mt-4" />}
                                </div>
                            ))}
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
                            {activeAnnouncements.map((announcement, index) => (
                                <div key={announcement.id}>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Badge className={announcement.priority === "High" ? "bg-amber-100 text-amber-800 hover:bg-amber-100" : "bg-slate-100 text-slate-700 hover:bg-slate-100"}>
                                            {announcement.priority} priority
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">{announcement.date}</span>
                                    </div>
                                    <p className="mt-2 font-semibold">{announcement.title}</p>
                                    <p className="mt-1 text-sm text-muted-foreground">{announcement.summary}</p>
                                    <p className="mt-2 text-xs text-muted-foreground">{announcement.author} · {announcement.audience}</p>
                                    {index < activeAnnouncements.length - 1 && <Separator className="mt-4" />}
                                </div>
                            ))}
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
                                                <p className="text-xs text-muted-foreground">{latestMentorNote.date} · {latestMentorNote.mentor}</p>
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
                                                {latestMentorNote.strengths.map((strength) => (
                                                    <Badge key={strength} variant="outline">
                                                        {strength}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Next actions</p>
                                            <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                                                {latestMentorNote.actionItems.map((item) => (
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
