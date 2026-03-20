import { MetricCard } from "@/components/cards/metric-card";
import { PageContainer } from "@/components/layout/page-container";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Award, BookOpen, Briefcase, Users } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getDonorDashboardData } from "@/lib/supabase/actions";
import { redirect } from "next/navigation";

export default async function SponsoredScholarsPage() {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { sponsoredScholars } = await getDonorDashboardData(user.id);

    const averageProgress = sponsoredScholars.length > 0
        ? Math.round(sponsoredScholars.reduce((sum: number, scholar: any) => sum + (scholar.progress_score || 0), 0) / sponsoredScholars.length)
        : 0;

    const strongPerformers = sponsoredScholars.filter((scholar: any) => (scholar.progress_score || 0) >= 80).length;

    return (
        <PageContainer
            title="Sponsored Scholars"
            description="Track scholar progress, funding usage, and development outcomes for the scholars supported by your contribution."
            action={<Button>Export Scholar Summary</Button>}
        >
            <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                    <MetricCard title="Sponsored Scholars" value={sponsoredScholars.length} description="Currently covered by your funding" icon={Users} />
                    <MetricCard title="Average Progress" value={`${averageProgress}%`} description="Combined academic and development score" icon={Award} />
                    <MetricCard title="Strong Performers" value={strongPerformers} description="Scholars at or above 80% progress" icon={BookOpen} />
                </div>

                <div className="grid gap-4 xl:grid-cols-2">
                    {sponsoredScholars.map((scholar: any) => (
                        <Card key={scholar.id} className="border-border/60">
                            <CardContent className="p-5">
                                <div className="flex items-start gap-4">
                                    <Avatar className="h-14 w-14">
                                        <AvatarFallback className="bg-primary/10 font-semibold text-primary">
                                            {scholar.first_name?.[0] ?? ''}{scholar.last_name?.[0] ?? ''}
                                            {!scholar.first_name && !scholar.last_name ? '?' : ''}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 space-y-3">
                                        <div className="flex flex-wrap items-start justify-between gap-3">
                                            <div>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h2 className="font-semibold">
                                                        {scholar.first_name || scholar.last_name
                                                            ? `${scholar.first_name ?? ''} ${scholar.last_name ?? ''}`.trim()
                                                            : "Name unavailable"}
                                                    </h2>
                                                    <Badge variant="outline">Cohort {scholar.cohort || "Unknown"}</Badge>
                                                </div>
                                                <p className="mt-1 text-sm text-muted-foreground">{scholar.program || "Not provided"}</p>
                                                <p className="text-sm text-muted-foreground">{scholar.institution || "Not provided"}</p>
                                            </div>
                                            <Badge className={(scholar.progress_score || 0) >= 80 ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100" : "bg-blue-100 text-blue-800 hover:bg-blue-100"}>
                                                {(scholar.progress_score || 0) >= 80 ? "Excellent" : "On Track"}
                                            </Badge>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">Development progress</span>
                                                <span className="font-semibold">{scholar.progress_score || 0}%</span>
                                            </div>
                                            <Progress value={scholar.progress_score || 0} className="h-2" />
                                        </div>

                                        <div className="grid gap-3 sm:grid-cols-2">
                                            <div className="rounded-xl border bg-muted/20 p-4">
                                                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Funding</p>
                                                <p className="mt-2 font-semibold">Allocated</p>
                                                <p className="text-xs text-muted-foreground">Direct scholar support</p>
                                            </div>
                                            <div className="rounded-xl border bg-muted/20 p-4">
                                                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Placement Track</p>
                                                <p className="mt-2 font-semibold">{scholar.placement_status === "placed" ? "Deployment Ready" : "In Selection"}</p>
                                            </div>
                                        </div>

                                        <div className="rounded-xl border bg-background p-4">
                                            <p className="flex items-center gap-2 text-sm font-medium">
                                                <Briefcase className="h-4 w-4 text-primary" />
                                                Impact Narrative
                                            </p>
                                            <p className="mt-2 text-sm text-muted-foreground">
                                                {scholar.bio || "No impact narrative available."}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {sponsoredScholars.length === 0 && (
                        <div className="col-span-full py-20 text-center border-2 border-dashed rounded-2xl">
                            <Users className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">No sponsored scholars currently assigned to your portfolio.</p>
                        </div>
                    )}
                </div>
            </div>
        </PageContainer>
    );
}
