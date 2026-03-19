import { PageContainer } from "@/components/layout/page-container";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mail, MapPin, Phone, Target, User } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getScholarDashboardData } from "@/lib/supabase/actions";
import { redirect } from "next/navigation";

const recognitionMoments = [
    "Presented a policy memo to the programme advisory board.",
    "Led three community data-literacy clinics across Lagos LGAs.",
    "Shortlisted for the 2026 scholars summit spotlight session.",
];

export default async function ScholarProfilePage() {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const {
        profile,
        mentorSessions
    } = await getScholarDashboardData(user.id);

    const fullName = profile ? `${profile.first_name} ${profile.last_name}` : "Scholar Name";
    const initials = profile ? `${profile.first_name[0]}${profile.last_name[0]}` : "SN";
    const mentorName = mentorSessions[0]?.mentor_name || "Assigned Mentor";
    const mentorTitle = mentorSessions[0]?.mentor_title || "Program Mentor";

    return (
        <PageContainer
            title="Scholar Profile"
            description="Your scholar identity, support network, and long-range development goals."
            action={<Button>Update Profile</Button>}
        >
            <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
                <Card className="border-border/60">
                    <CardContent className="p-6">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                            <Avatar className="h-20 w-20 ring-4 ring-background shadow-sm" size="lg">
                                <AvatarFallback className="bg-primary/12 text-primary text-2xl font-semibold">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 space-y-4">
                                <div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h2 className="text-2xl font-semibold">{fullName}</h2>
                                        <Badge variant="secondary">Scholar</Badge>
                                        <Badge variant="outline">{profile?.scholar_id || "SCH-Pending"}</Badge>
                                    </div>
                                    <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                                        {profile?.bio || "No bio available."}
                                    </p>
                                </div>

                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div className="rounded-xl border bg-muted/20 p-4">
                                        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Programme</p>
                                        <p className="mt-2 font-semibold">{profile?.program || "Program Pending"}</p>
                                        <p className="mt-1 text-sm text-muted-foreground">{profile?.institution || "Institution Pending"}</p>
                                    </div>
                                    <div className="rounded-xl border bg-muted/20 p-4">
                                        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Placement Track</p>
                                        <p className="mt-2 font-semibold">Public-sector analytics track</p>
                                        <p className="mt-1 text-sm text-muted-foreground">Career deployment goal</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Focus Areas</p>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {(profile?.focus_areas || ["General Analytics"]).map((area: string) => (
                                            <Badge key={area} variant="outline">
                                                {area}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/60">
                    <CardHeader>
                        <CardTitle>Profile Details</CardTitle>
                        <CardDescription>Identity and programme details shared across scholar services.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[
                            { label: "Email address", value: profile?.email || user.email, icon: Mail },
                            { label: "Phone number", value: profile?.phone || "Not provided", icon: Phone },
                            { label: "Location", value: "Nigeria", icon: MapPin },
                            { label: "State of origin", value: profile?.state_of_origin || "Not provided", icon: User },
                        ].map((item, index) => (
                            <div key={item.label}>
                                <div className="flex items-start gap-3">
                                    <item.icon className="mt-0.5 h-4 w-4 text-primary" />
                                    <div>
                                        <p className="text-sm font-medium">{item.label}</p>
                                        <p className="text-sm text-muted-foreground">{item.value}</p>
                                    </div>
                                </div>
                                {index < 3 && <Separator className="mt-4" />}
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="border-border/60">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Target className="h-4 w-4 text-primary" />
                            Development Goals
                        </CardTitle>
                        <CardDescription>What success should look like over the next year.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {(profile?.goals || ["Graduate with honors", "Secure industry placement"]).map((goal: string, index: number) => (
                            <div key={goal} className="rounded-xl border bg-background p-4">
                                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Goal {index + 1}</p>
                                <p className="mt-2 font-medium">{goal}</p>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card className="border-border/60">
                        <CardHeader>
                            <CardTitle>Support Network</CardTitle>
                            <CardDescription>People and services supporting your scholar journey.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="rounded-xl border bg-muted/20 p-4">
                                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Primary mentor</p>
                                <p className="mt-2 font-semibold">{mentorName}</p>
                                <p className="text-sm text-muted-foreground">{mentorTitle}</p>
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Current support needs</p>
                                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                                    {(profile?.support_needs || ["Research supervision", "Career advice"]).map((need: string) => (
                                        <li key={need} className="flex gap-2">
                                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                                            <span>{need}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/60">
                        <CardHeader>
                            <CardTitle>Recognition & Contributions</CardTitle>
                            <CardDescription>Recent achievements shaping your scholar portfolio.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {recognitionMoments.map((item) => (
                                <div key={item} className="rounded-xl border bg-background p-4 text-sm text-muted-foreground">
                                    {item}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </PageContainer>
    );
}
