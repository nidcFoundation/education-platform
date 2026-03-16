import { MetricCard } from "@/components/cards/metric-card";
import { PageContainer } from "@/components/layout/page-container";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Award, BookOpen, Briefcase, Users } from "lucide-react";
import { sponsoredScholars } from "@/mock-data/donor";

export default function SponsoredScholarsPage() {
    const averageProgress = Math.round(
        sponsoredScholars.reduce((sum, scholar) => sum + scholar.progressScore, 0) / Math.max(sponsoredScholars.length, 1)
    );
    const strongPerformers = sponsoredScholars.filter((scholar) => scholar.progressScore >= 85).length;

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
                    <MetricCard title="High Performers" value={strongPerformers} description="Scholars at or above 85% progress" icon={BookOpen} />
                </div>

                <div className="grid gap-4 xl:grid-cols-2">
                    {sponsoredScholars.map((scholar) => (
                        <Card key={scholar.id} className="border-border/60">
                            <CardContent className="p-5">
                                <div className="flex items-start gap-4">
                                    <Avatar size="lg" className="h-14 w-14">
                                        <AvatarFallback className="bg-primary/12 font-semibold text-primary">
                                            {scholar.initials}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 space-y-3">
                                        <div className="flex flex-wrap items-start justify-between gap-3">
                                            <div>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h2 className="font-semibold">{scholar.name}</h2>
                                                    <Badge variant="outline">Cohort {scholar.cohort}</Badge>
                                                </div>
                                                <p className="mt-1 text-sm text-muted-foreground">{scholar.program}</p>
                                                <p className="text-sm text-muted-foreground">{scholar.institution}</p>
                                            </div>
                                            <Badge className={scholar.progressScore >= 85 ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100" : "bg-blue-100 text-blue-800 hover:bg-blue-100"}>
                                                {scholar.performance}
                                            </Badge>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">Development progress</span>
                                                <span className="font-semibold">{scholar.progressScore}%</span>
                                            </div>
                                            <Progress value={scholar.progressScore} className="h-2" />
                                        </div>

                                        <div className="grid gap-3 sm:grid-cols-2">
                                            <div className="rounded-xl border bg-muted/20 p-4">
                                                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Funding</p>
                                                <p className="mt-2 font-semibold">{scholar.used} used</p>
                                                <p className="text-xs text-muted-foreground">of {scholar.allocation} allocated</p>
                                            </div>
                                            <div className="rounded-xl border bg-muted/20 p-4">
                                                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Placement Track</p>
                                                <p className="mt-2 font-semibold">{scholar.placementTrack}</p>
                                            </div>
                                        </div>

                                        <div className="rounded-xl border bg-background p-4">
                                            <p className="flex items-center gap-2 text-sm font-medium">
                                                <Briefcase className="h-4 w-4 text-primary" />
                                                Funding contribution to development
                                            </p>
                                            <p className="mt-2 text-sm text-muted-foreground">{scholar.impact}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </PageContainer>
    );
}
