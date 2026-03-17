import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/ui/status-badge";
import { scholarMilestones, scholarProfile, fundingBreakdown, mentorSessions, placementStages } from "@/mock-data/scholar";
import { adminScholars } from "@/mock-data/admin";

export default function ScholarProfilesPage() {
    return (
        <PageContainer
            title="Scholar Profiles"
            description="Detailed scholar records with progress, milestones, placement readiness, and funding context."
            action={
                <Button asChild variant="outline">
                    <Link href="/admin/scholars">Back to Scholar Management</Link>
                </Button>
            }
        >
            <div className="space-y-6">
                <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
                    <Card className="border-border/60">
                        <CardHeader>
                            <CardTitle>Scholar Roster</CardTitle>
                            <CardDescription>Open detailed profiles for scholars requiring admin attention.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {adminScholars.map((scholar) => (
                                <Link
                                    key={scholar.id}
                                    href={`/admin/scholars/profiles`}
                                    className="block rounded-xl border bg-background p-4 transition-colors hover:bg-muted/20"
                                >
                                    <div className="flex items-start gap-3">
                                        <Avatar size="lg">
                                            <AvatarFallback className="bg-primary/10 font-semibold text-primary">
                                                {scholar.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <p className="font-semibold">{scholar.name}</p>
                                                <StatusBadge status={scholar.status} />
                                            </div>
                                            <p className="mt-1 text-sm text-muted-foreground">{scholar.program}</p>
                                            <p className="mt-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                                Cohort {scholar.cohort} · {scholar.placement}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="border-border/60">
                        <CardHeader>
                            <div className="flex flex-wrap items-center gap-2">
                                <CardTitle>{scholarProfile.fullName}</CardTitle>
                                <Badge variant="outline">{scholarProfile.scholarId}</Badge>
                                <Badge variant="secondary">Featured profile</Badge>
                            </div>
                            <CardDescription>
                                {scholarProfile.program} · {scholarProfile.institution} · Cohort {scholarProfile.cohort}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <p className="text-sm leading-6 text-muted-foreground">{scholarProfile.bio}</p>

                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="rounded-xl border bg-muted/15 p-4">
                                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Placement track</p>
                                    <p className="mt-2 font-semibold">{scholarProfile.placementTrack}</p>
                                </div>
                                <div className="rounded-xl border bg-muted/15 p-4">
                                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Mentor</p>
                                    <p className="mt-2 font-semibold">{scholarProfile.mentor}</p>
                                    <p className="mt-1 text-sm text-muted-foreground">{scholarProfile.mentorTitle}</p>
                                </div>
                            </div>

                            <div className="grid gap-3 md:grid-cols-3">
                                {scholarProfile.focusAreas.map((item) => (
                                    <div key={item} className="rounded-xl border bg-background p-4 text-sm text-muted-foreground">
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
                    <Card className="border-border/60">
                        <CardHeader>
                            <CardTitle>Milestones and Progress</CardTitle>
                            <CardDescription>Admin view of upcoming evidence, owners, and current completion state.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {scholarMilestones.map((milestone) => {
                                const progressValue =
                                    milestone.status === "completed" ? 100 : milestone.status === "active" ? 65 : 20;

                                return (
                                    <div key={milestone.id} className="rounded-xl border bg-background p-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <p className="font-medium">{milestone.title}</p>
                                                <p className="mt-1 text-sm text-muted-foreground">{milestone.impact}</p>
                                            </div>
                                            <StatusBadge status={milestone.status} />
                                        </div>
                                        <div className="mt-4 space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">{milestone.owner}</span>
                                                <span>{milestone.dueDate}</span>
                                            </div>
                                            <Progress value={progressValue} className="h-2" />
                                        </div>
                                        <p className="mt-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">{milestone.evidence}</p>
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>

                    <div className="space-y-6">
                        <Card className="border-border/60">
                            <CardHeader>
                                <CardTitle>Funding Lines</CardTitle>
                                <CardDescription>Allocated versus used across scholar funding categories.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {fundingBreakdown.map((line) => (
                                    <div key={line.label} className="rounded-xl border bg-background p-4">
                                        <div className="flex items-center justify-between gap-4">
                                            <p className="font-medium">{line.label}</p>
                                            <span className="text-sm font-semibold">{line.utilisation}%</span>
                                        </div>
                                        <p className="mt-2 text-sm text-muted-foreground">{line.note}</p>
                                        <div className="mt-3 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                            <span>Allocated {line.allocated}</span>
                                            <span>Used {line.used}</span>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card className="border-border/60">
                            <CardHeader>
                                <CardTitle>Placement Pipeline</CardTitle>
                                <CardDescription>Employer and readiness stages for the featured scholar.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {placementStages.map((stage) => (
                                    <div key={stage.label} className="rounded-xl border bg-background p-4">
                                        <div className="flex items-center justify-between gap-3">
                                            <p className="font-medium">{stage.label}</p>
                                            <StatusBadge status={stage.status} />
                                        </div>
                                        <p className="mt-2 text-sm text-muted-foreground">{stage.detail}</p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card className="border-border/60">
                            <CardHeader>
                                <CardTitle>Mentor Signals</CardTitle>
                                <CardDescription>Latest mentor session summaries surfaced for admin review.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {mentorSessions.slice(0, 2).map((session) => (
                                    <div key={session.id} className="rounded-xl border bg-background p-4">
                                        <p className="font-medium">{session.theme}</p>
                                        <p className="mt-1 text-sm text-muted-foreground">{session.summary}</p>
                                        <p className="mt-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                            {session.date} · {session.sentiment}
                                        </p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </PageContainer>
    );
}
