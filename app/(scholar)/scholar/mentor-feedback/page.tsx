import { PageContainer } from "@/components/layout/page-container";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, MessageSquare, Target, User } from "lucide-react";
import { mentorSessions, scholarProfile } from "@/mock-data/scholar";

const sentimentClasses = {
    Strong: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100",
    Positive: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    Watch: "bg-amber-100 text-amber-800 hover:bg-amber-100",
};

export default function MentorFeedbackPage() {
    const latestSession = mentorSessions
      .slice()
      .sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )[0];

    return (
        <PageContainer
            title="Mentor Feedback"
            description="Session notes, strengths, and action items shaping the scholar's next decisions."
        >
            <div className="space-y-6">
                <Card className="border-border/60">
                    <CardContent className="p-6">
                        <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
                            <div className="rounded-xl border bg-muted/20 p-5">
                                {latestSession ? (
                                    <>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <Badge className={sentimentClasses[latestSession.sentiment]}>
                                                {latestSession.sentiment}
                                            </Badge>
                                            <span className="text-xs text-muted-foreground">{latestSession.date}</span>
                                        </div>
                                        <h2 className="mt-3 text-xl font-semibold">{latestSession.theme}</h2>
                                        <p className="mt-3 text-sm leading-6 text-muted-foreground">{latestSession.summary}</p>
                                    </>
                                ) : (
                                    <>
                                        <Badge variant="outline">No session yet</Badge>
                                        <h2 className="mt-3 text-xl font-semibold">Mentor session pending</h2>
                                        <p className="mt-3 text-sm leading-6 text-muted-foreground">
                                            Once the first mentor session is logged, the latest summary and action items will appear here.
                                        </p>
                                    </>
                                )}
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                                <div className="rounded-xl border bg-background p-4">
                                    <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Mentor</p>
                                    <p className="mt-2 font-semibold">{scholarProfile.mentor}</p>
                                    <p className="text-sm text-muted-foreground">{scholarProfile.mentorTitle}</p>
                                </div>
                                <div className="rounded-xl border bg-background p-4">
                                    <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Next review focus</p>
                                    <p className="mt-2 font-semibold">Interview narrative and evidence storytelling</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                    <Card className="border-border/60">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MessageSquare className="h-4 w-4 text-primary" />
                                Feedback Timeline
                            </CardTitle>
                            <CardDescription>Historical mentor sessions and follow-up guidance.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            {mentorSessions.map((session, index) => (
                                <div key={session.id}>
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                        <div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <p className="font-semibold">{session.theme}</p>
                                                <Badge className={sentimentClasses[session.sentiment]}>
                                                    {session.sentiment}
                                                </Badge>
                                            </div>
                                            <p className="mt-1 text-xs text-muted-foreground">{session.date} · {session.mentor}</p>
                                        </div>
                                        <div className="rounded-full border px-3 py-1 text-xs text-muted-foreground">
                                            {index === 0 ? "Latest" : "Archived"}
                                        </div>
                                    </div>
                                    <p className="mt-3 text-sm text-muted-foreground">{session.summary}</p>
                                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                        <div className="rounded-xl border bg-muted/20 p-4">
                                            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Strengths</p>
                                            <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                                                {session.strengths.map((strength) => (
                                                    <li key={strength} className="flex gap-2">
                                                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                                                        <span>{strength}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="rounded-xl border bg-muted/20 p-4">
                                            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Action items</p>
                                            <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                                                {session.actionItems.map((item) => (
                                                    <li key={item} className="flex gap-2">
                                                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                                                        <span>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                    {index < mentorSessions.length - 1 && <Separator className="mt-5" />}
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <div className="space-y-6">
                        <Card className="border-border/60">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Target className="h-4 w-4 text-primary" />
                                    Accountability List
                                </CardTitle>
                                <CardDescription>Immediate mentor asks for the current cycle.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {latestSession ? (
                                    latestSession.actionItems.map((item) => (
                                        <div key={item} className="rounded-xl border bg-background p-4 text-sm text-muted-foreground">
                                            {item}
                                        </div>
                                    ))
                                ) : (
                                    <div className="rounded-xl border border-dashed bg-muted/20 p-4 text-sm text-muted-foreground">
                                        No mentor action items are available yet.
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="border-border/60">
                            <CardHeader>
                                <CardTitle>Mentor Rhythm</CardTitle>
                                <CardDescription>How support is being delivered around the scholar.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm text-muted-foreground">
                                <div className="flex items-start gap-3">
                                    <Calendar className="mt-0.5 h-4 w-4 text-primary" />
                                    <div>
                                        <p className="font-medium text-foreground">Bi-weekly mentor sessions</p>
                                        <p>Structured around research progress, communication, and placement preparation.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <User className="mt-0.5 h-4 w-4 text-primary" />
                                    <div>
                                        <p className="font-medium text-foreground">Quarterly programme reviews</p>
                                        <p>Scholar success staff validate outputs and intervene when momentum drops.</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </PageContainer>
    );
}
