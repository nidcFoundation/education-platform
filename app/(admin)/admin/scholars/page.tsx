import Link from "next/link";
import { MetricCard } from "@/components/cards/metric-card";
import { HorizontalBarChart } from "@/components/donor/transparency-charts";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Banknote, Briefcase, Flag, TrendingUp } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getDefaultRedirectPath, resolveUserRoleForSession } from "@/lib/auth/roles";
import { getAdminScholarManagementData } from "@/lib/supabase/actions";
import { redirect } from "next/navigation";

export default async function ScholarManagementPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const role = await resolveUserRoleForSession(supabase, user);
  if (role !== "admin") {
    redirect(getDefaultRedirectPath(role));
  }

  const { scholars, metrics, healthPercentages } = await getAdminScholarManagementData();

  const formatCurrency = (amount: number) => {
    if (amount >= 1e9) return `₦${(amount / 1e9).toFixed(2)}B`;
    if (amount >= 1e6) return `₦${(amount / 1e6).toFixed(1)}M`;
    return `₦${amount.toLocaleString()}`;
  };

  const scholarMetrics = [
    {
      title: "Active Scholars",
      value: metrics.activeScholars.toString(),
      description: "Total scholars in system",
      icon: TrendingUp,
    },
    {
      title: "Milestones Due",
      value: metrics.milestonesDue.toString(),
      description: "Need evidence or owner follow-up",
      icon: Flag,
    },
    {
      title: "Placement Watchlist",
      value: metrics.placementWatchlist.toString(),
      description: "Require partner intervention",
      icon: Briefcase,
    },
    {
      title: "Funding Watchlist",
      value: metrics.fundingWatchlist.toString(),
      description: "Accounts needing disbursement review",
      icon: Banknote,
    },
  ];

  const scholarManagementFocus = [
    { title: "Academic Progression", description: "Monitoring credits and CGPA for all active cohorts.", metric: "8 cohort-cycles active" },
    { title: "Industry Placements", description: "Coordinating with partners for summer and final-year internships.", metric: "Matches pending tracking" },
    { title: "Funding Health", description: "Reviewing stipend disbursement and tuition commitments.", metric: `${formatCurrency(metrics.totalDisbursed)} disbursed` },
    { title: "Impact Verification", description: "Checking evidence for service and public value milestones.", metric: `${metrics.milestonesDue} unverified entries` },
  ];

  return (
    <PageContainer
      title="Scholar Management"
      description="Track scholar progress, update milestones, manage placements, and monitor funding health."
      action={
        <Button asChild>
          <Link href="/admin/scholars/profiles">Open Scholar Profiles</Link>
        </Button>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {scholarMetrics.map((metric) => (
            <MetricCard
              key={metric.title}
              title={metric.title}
              value={metric.value}
              description={metric.description}
              icon={metric.icon}
              className="border-border/60"
            />
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {scholarManagementFocus.map((focus) => (
            <Card key={focus.title} className="border-border/60">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{focus.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {focus.description}
                </p>
                <p className="mt-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {focus.metric}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle>Scholar Health Overview</CardTitle>
              <CardDescription>
                Platform-wide health signal spanning progression, placement, and
                funding risk.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <HorizontalBarChart
                items={healthPercentages}
                valueSuffix="%"
              />
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader>
              <CardTitle>Progress and Funding Watchlist</CardTitle>
              <CardDescription>
                Lowest-performing or highest-risk scholars needing immediate
                operational action.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {scholars.slice(0, 3).map((scholar) => (
                <div
                  key={scholar.id}
                  className="rounded-xl border bg-background p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <Link href={`/admin/scholars/profiles/${scholar.id}`} className="hover:underline">
                      <div>
                        <p className="font-medium text-primary">{scholar.first_name} {scholar.last_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {scholar.program || "No program assigned"}
                        </p>
                      </div>
                    </Link>
                    <Badge variant="outline">{scholar.status || "active"}</Badge>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold">
                        {scholar.progress_score || 0}%
                      </span>
                    </div>
                    <Progress value={scholar.progress_score || 0} className="h-2" />
                  </div>
                </div>
              ))}
              {scholars.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No active scholars found.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>Scholar Operations Queue</CardTitle>
              <CardDescription>
                Track academic progress, milestone completion, placement status,
                and funding utilisation.
              </CardDescription>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/scholars/profiles">Open profiles</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Scholar</TableHead>
                  <TableHead>Cohort</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Milestones</TableHead>
                  <TableHead>Placement</TableHead>
                  <TableHead>Funding</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scholars.map((scholar) => (
                  <TableRow key={scholar.id}>
                    <TableCell>
                      <Link href={`/admin/scholars/profiles/${scholar.id}`} className="hover:underline">
                        <div>
                          <p className="font-medium text-primary">{scholar.first_name} {scholar.last_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {scholar.program || "General"}
                          </p>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell>Cohort {scholar.cohort || "2024"}</TableCell>
                    <TableCell className="min-w-44">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>{scholar.progress_score || 0}%</span>
                          <Badge variant="outline">{scholar.status || "active"}</Badge>
                        </div>
                        <Progress value={scholar.progress_score || 0} className="h-2" />
                      </div>
                    </TableCell>
                    <TableCell>—</TableCell>
                    <TableCell>—</TableCell>
                    <TableCell>
                      —
                    </TableCell>
                  </TableRow>
                ))}
                {scholars.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                      No scholars found in the system.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
