import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ApplicationStatusBadge } from "@/components/ui/application-status-badge";
import { PageContainer } from "@/components/layout/page-container";
import {
    ArrowRight,
    Bell,
    Calendar,
    CheckCircle2,
    Clock,
    MessageSquare,
    Pin,
    AlertTriangle,
} from "lucide-react";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getApplicantDashboardData } from "@/lib/supabase/actions";
import { buildProfileFallback } from "@/lib/auth/profile-fallback";

const applicationSteps = [
    { step: 1, label: "Personal Information" },
    { step: 2, label: "Academic Background" },
    { step: 3, label: "Essays" },
    { step: 4, label: "Documents" },
    { step: 5, label: "Review & Submit" },
];

type ApplicantDashboardData = Awaited<ReturnType<typeof getApplicantDashboardData>>;
type ApplicantAnnouncement = ApplicantDashboardData["announcements"][number];
type ApplicantNotification = ApplicantDashboardData["notifications"][number];
type ApplicantDeadline = ApplicantDashboardData["deadlines"][number];

export default async function ApplicantDashboard() {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const {
        profile,
        application,
        announcements,
        notifications,
        deadlines
    } = await getApplicantDashboardData(user.id);
    const resolvedProfile = profile ?? buildProfileFallback(user);

    // Profile completion calculation (mock logic simplified for dynamic data)
    const currentStep = application?.step || 1;
    const completionPct = Math.round((currentStep / applicationSteps.length) * 100);
    const unreadNotifs = notifications.filter((n: ApplicantNotification) => !n.is_read).length;

    return (
        <PageContainer
            title={`Welcome back, ${resolvedProfile.first_name}`}
            description={application ? `Application ID: ${application.id.slice(0, 8)}... · Status: ${application.status}` : "Start your journey today."}
            action={
                <Link href="/application">
                    <Button className="font-semibold cursor-pointer py-4">
                        {application ? "Continue Application" : "Start Application"} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </Link>
            }
        >
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-border/50">
                        <CardHeader className="pb-2 flex flex-row items-start justify-between gap-4">
                            <div>
                                <CardTitle className="text-base font-semibold">Application Progress</CardTitle>
                                <p className="text-sm text-muted-foreground mt-0.5">
                                    Step {currentStep} of {applicationSteps.length} — {applicationSteps[currentStep - 1]?.label}
                                </p>
                            </div>
                            {application && <ApplicationStatusBadge status={application.status} />}
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <Progress value={(currentStep / applicationSteps.length) * 100} className="h-2" />

                            <div className="space-y-2">
                                {applicationSteps.map((s) => {
                                    const isCompleted = s.step < currentStep;
                                    const isActive = s.step === currentStep;
                                    const isPending = s.step > currentStep;
                                    return (
                                        <div
                                            key={s.step}
                                            className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive ? "bg-primary/5 border border-primary/20" : "hover:bg-muted/30"
                                                }`}
                                        >
                                            <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${isCompleted ? "bg-primary text-primary-foreground" :
                                                isActive ? "border-2 border-primary text-primary bg-background" :
                                                    "border border-muted-foreground/30 text-muted-foreground/50 bg-muted/30"
                                                }`}>
                                                {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : s.step}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm font-medium ${isPending ? "text-muted-foreground" : ""}`}>{s.label}</p>
                                                {isActive && <p className="text-xs text-primary mt-0.5">In progress</p>}
                                                {isCompleted && <p className="text-xs text-muted-foreground mt-0.5">Completed</p>}
                                                {isPending && <p className="text-xs text-muted-foreground/60 mt-0.5">Not started</p>}
                                            </div>
                                            {isActive && (
                                                <Link href={`/application/step-${s.step}`}>
                                                    <Button size="sm" variant="outline" className="text-xs h-7 shrink-0">Continue</Button>
                                                </Link>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {application && (
                                <div className="pt-2">
                                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                                        <Clock className="h-3.5 w-3.5" />
                                        Last saved: {new Date(application.updated_at).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="border-border/50">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <MessageSquare className="h-4 w-4" />
                                Announcements
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {announcements.length > 0 ? announcements.map((ann: ApplicantAnnouncement, i: number) => (
                                <div key={ann.id}>
                                    <div className="flex items-start gap-3">
                                        {ann.is_pinned && <Pin className="h-3.5 w-3.5 text-primary mt-1 shrink-0" />}
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-start justify-between gap-2">
                                                <p className="text-sm font-semibold leading-snug">{ann.title}</p>
                                                {ann.is_pinned && <Badge variant="secondary" className="text-[10px] shrink-0">Pinned</Badge>}
                                            </div>
                                            <p className="text-xs text-muted-foreground leading-relaxed">{ann.body}</p>
                                            <p className="text-[10px] text-muted-foreground/70">Program Office · {new Date(ann.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    {i < announcements.length - 1 && <Separator className="mt-4" />}
                                </div>
                            )) : (
                                <p className="text-sm text-muted-foreground text-center py-4">No recent announcements.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="border-border/50">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-semibold">Application Completion</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-end justify-between">
                                <span className="text-3xl font-extrabold">{completionPct}%</span>
                                <span className="text-xs text-muted-foreground mb-1">of process</span>
                            </div>
                            <Progress value={completionPct} className="h-2" />
                            <ul className="space-y-2 mt-2">
                                {applicationSteps.map((item, i) => (
                                    <li key={i} className="flex items-center gap-2 text-xs">
                                        <CheckCircle2 className={`h-3.5 w-3.5 shrink-0 ${item.step < currentStep ? "text-primary" : "text-muted-foreground/30"}`} />
                                        <span className={item.step < currentStep ? "line-through text-muted-foreground" : ""}>{item.label}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Important Deadlines
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {deadlines.length > 0 ? deadlines.map((deadline: ApplicantDeadline) => (
                                <div key={deadline.id} className="flex items-start gap-3">
                                    {deadline.is_urgent ? (
                                        <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                                    ) : (
                                        <Clock className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-semibold leading-tight">{deadline.label}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">{new Date(deadline.due_date).toLocaleDateString()}</p>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className={`text-[10px] shrink-0 ${deadline.is_urgent ? "border-amber-300 text-amber-700 bg-amber-50" : ""}`}
                                    >
                                        {deadline.days_left}d left
                                    </Badge>
                                </div>
                            )) : (
                                <p className="text-sm text-muted-foreground text-center py-4">No upcoming deadlines.</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="border-border/50">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                    <Bell className="h-4 w-4" />
                                    Notifications
                                </CardTitle>
                                {unreadNotifs > 0 && (
                                    <Badge className="text-[10px] h-5">{unreadNotifs} new</Badge>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {notifications.length > 0 ? notifications.slice(0, 3).map((notif: ApplicantNotification, i: number) => (
                                <div key={notif.id}>
                                    <div className={`flex items-start gap-2 ${!notif.is_read ? "opacity-100" : "opacity-70"}`}>
                                        <div className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${notif.type === "success" ? "bg-emerald-500" :
                                            notif.type === "warning" ? "bg-amber-500" :
                                                notif.type === "error" ? "bg-red-500" :
                                                    "bg-blue-500"
                                            }`} />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-medium leading-snug">{notif.title}</p>
                                            <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">{notif.body}</p>
                                        </div>
                                    </div>
                                    {i < notifications.length - 1 && i < 2 && <Separator className="mt-3" />}
                                </div>
                            )) : (
                                <p className="text-sm text-muted-foreground text-center py-4">No new notifications.</p>
                            )}
                            <Link href="/notifications">
                                <Button variant="ghost" className="w-full text-xs h-8 mt-1 text-primary">
                                    View All Notifications
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </PageContainer>
    );
}
