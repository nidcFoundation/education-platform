import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ClipboardList, FileText, TrendingUp } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getScholarProgressReports } from "@/lib/supabase/actions";
import { redirect } from "next/navigation";

export default async function ProgressReportsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const progressReports = await getScholarProgressReports(user.id);

  const latestReport = progressReports.find(
    (report: any) => report.status === "active"
  ) || progressReports[0];

  if (!latestReport) {
    return (
      <PageContainer
        title="Progress Reports"
        description="Quarterly reporting across academic delivery, placement readiness, and impact tracking."
      >
        <Card className="border-border/60">
          <CardContent className="p-6 text-sm text-muted-foreground">
            No progress reports available yet.
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Progress Reports"
      description="Quarterly reporting across academic delivery, placement readiness, and impact tracking."
      action={<Button>Create Draft Update</Button>}
    >
      <div className="space-y-6">
        <Card className="border-border/60 bg-[linear-gradient(135deg,rgba(90,200,120,0.10),rgba(255,255,255,0.96)_55%,rgba(238,250,242,0.9))]">
          <CardContent className="p-6">
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="rounded-xl border bg-background/80 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  Latest score
                </p>
                <p className="mt-3 text-3xl font-bold">{latestReport.score || "N/A"}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {latestReport.period} review cycle
                </p>
              </div>
              <div className="rounded-xl border bg-background/80 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  Reviewer
                </p>
                <p className="mt-3 font-semibold">{latestReport.reviewer || "System Review"}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Submitted on {latestReport.submitted_on ? new Date(latestReport.submitted_on).toLocaleDateString() : "Pending"}
                </p>
              </div>
              <div className="rounded-xl border bg-background/80 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  Report summary
                </p>
                <p className="mt-3 text-sm text-muted-foreground">
                  {latestReport.summary || "No summary available for this cycle."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Reporting History
              </CardTitle>
              <CardDescription>
                Submitted and upcoming scholar progress reports.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Period</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Reviewer</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {progressReports.map((report: any) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">
                        {report.period}
                      </TableCell>
                      <TableCell>{report.submitted_on ? new Date(report.submitted_on).toLocaleDateString() : "Pending"}</TableCell>
                      <TableCell>{report.reviewer || "—"}</TableCell>
                      <TableCell>{report.score || "—"}</TableCell>
                      <TableCell>
                        <StatusBadge status={report.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Current Focus
                </CardTitle>
                <CardDescription>
                  Priority items carried into the active review cycle.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {latestReport.priorities?.map((priority: string) => (
                  <div
                    key={priority}
                    className="rounded-xl border bg-muted/20 p-4 text-sm text-muted-foreground"
                  >
                    {priority}
                  </div>
                ))}
                {(!latestReport.priorities || latestReport.priorities.length === 0) && (
                  <p className="text-sm text-muted-foreground">No priority items defined for this cycle.</p>
                )}
              </CardContent>
            </Card>

            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 text-primary" />
                  Report Signals
                </CardTitle>
                <CardDescription>
                  What the latest review is saying about scholar momentum.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                {latestReport.signals?.map((signal: string) => (
                  <div key={signal} className="rounded-xl border bg-background p-4">
                    {signal}
                  </div>
                ))}
                {(!latestReport.signals || latestReport.signals.length === 0) && (
                  <p className="text-sm text-muted-foreground">No signals detected yet.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
