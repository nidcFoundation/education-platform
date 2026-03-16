import { PageContainer } from "@/components/layout/page-container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/ui/status-badge";
import { ArrowRight, Briefcase, Compass, Target } from "lucide-react";
import { opportunities, placementStages, scholarProfile } from "@/mock-data/scholar";

export default function OpportunitiesPage() {
    return (
      <PageContainer
        title="Opportunities & Placements"
        description="Track internships, placement matches, and deployment opportunities aligned to your scholar pathway."
        action={
          <Button>
            Update Opportunity Preferences <ArrowRight className="ml-1" />
          </Button>
        }
      >
        <div className="space-y-6">
          <Card className="border-border/60 bg-[linear-gradient(135deg,rgba(90,200,120,0.08),rgba(255,255,255,0.98)_52%,rgba(239,248,244,0.86))]">
            <CardContent className="p-6">
              <div className="grid gap-4 lg:grid-cols-3">
                <div className="rounded-xl border bg-background/80 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                    Placement track
                  </p>
                  <p className="mt-3 font-semibold">
                    {scholarProfile.placementTrack}
                  </p>
                </div>
                <div className="rounded-xl border bg-background/80 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                    Readiness score
                  </p>
                  <p className="mt-3 text-3xl font-bold">78%</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Interview prep underway
                  </p>
                </div>
                <div className="rounded-xl border bg-background/80 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                    Active matches
                  </p>
                  <p className="mt-3 text-3xl font-bold">3</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Across public analytics and health-tech
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  Placement Pipeline
                </CardTitle>
                <CardDescription>
                  Current step-by-step path toward industry placement.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {placementStages.map((stage, index) => (
                  <div key={stage.label} className="flex gap-3">
                    <div className="mt-1 flex flex-col items-center">
                      <div
                        className={`h-3 w-3 rounded-full ${
                          stage.status === "completed"
                            ? "bg-primary"
                            : stage.status === "active"
                            ? "bg-amber-500"
                            : "bg-muted-foreground/30"
                        }`}
                      />
                      {index < placementStages.length - 1 && (
                        <div className="mt-2 h-12 w-px bg-border" />
                      )}
                    </div>
                    <div className="pb-5">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{stage.label}</p>
                        <StatusBadge status={stage.status} />
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {stage.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-primary" />
                  Live Opportunities
                </CardTitle>
                <CardDescription>
                  Open roles and programmes currently matched to your profile.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {opportunities.map((opportunity) => (
                  <div
                    key={opportunity.id}
                    className="rounded-xl border bg-background p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold">{opportunity.title}</p>
                          <Badge variant="outline">{opportunity.type}</Badge>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {opportunity.organisation} · {opportunity.location}
                        </p>
                      </div>
                      <StatusBadge status={opportunity.status} />
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">
                      {opportunity.summary}
                    </p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      <div className="rounded-lg bg-muted/20 p-3">
                        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                          Deadline
                        </p>
                        <p className="mt-2 font-medium text-foreground">
                          {opportunity.deadline}
                        </p>
                      </div>
                      <div className="rounded-lg bg-muted/20 p-3">
                        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                          Fit
                        </p>
                        <p className="mt-2 font-medium text-foreground">
                          {opportunity.fit}
                        </p>
                      </div>
                      <div className="rounded-lg bg-muted/20 p-3">
                        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                          Readiness
                        </p>
                        <Progress
                          value={
                            opportunity.status === "active"
                              ? 78
                              : opportunity.status === "completed"
                              ? 100
                              : 56
                          }
                          className="mt-3 h-2"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Compass className="h-4 w-4 text-primary" />
                Career Direction
              </CardTitle>
              <CardDescription>
                What the current opportunity mix is building toward.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 lg:grid-cols-3">
              {[
                "Public-sector analytics roles where modelling directly informs delivery teams.",
                "Health-tech teams that need data translation between product, research, and policy.",
                "Leadership tracks that prepare scholars for visible deployment after graduation.",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-xl border bg-muted/20 p-4 text-sm text-muted-foreground"
                >
                  {item}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    );
}
