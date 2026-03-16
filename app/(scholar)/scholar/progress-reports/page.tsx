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
import { progressReports } from "@/mock-data/scholar";

export default function ProgressReportsPage() {
  const latestReport = progressReports.find(
    (report) => report.status === "active"
  );

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
                <p className="mt-3 text-3xl font-bold">{latestReport.score}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {latestReport.period} review cycle
                </p>
              </div>
              <div className="rounded-xl border bg-background/80 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  Reviewer
                </p>
                <p className="mt-3 font-semibold">{latestReport.reviewer}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Submitted on {latestReport.submittedOn}
                </p>
              </div>
              <div className="rounded-xl border bg-background/80 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  Report summary
                </p>
                <p className="mt-3 text-sm text-muted-foreground">
                  {latestReport.summary}
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
                  {progressReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">
                        {report.period}
                      </TableCell>
                      <TableCell>{report.submittedOn}</TableCell>
                      <TableCell>{report.reviewer}</TableCell>
                      <TableCell>{report.score}</TableCell>
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
                {latestReport.priorities.map((priority) => (
                  <div
                    key={priority}
                    className="rounded-xl border bg-muted/20 p-4 text-sm text-muted-foreground"
                  >
                    {priority}
                  </div>
                ))}
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
                <div className="rounded-xl border bg-background p-4">
                  Academic growth is exceeding expectation, particularly where
                  coursework is tied to applied outputs.
                </div>
                <div className="rounded-xl border bg-background p-4">
                  Placement readiness is improving, but interview storytelling
                  and concise positioning still need work.
                </div>
                <div className="rounded-xl border bg-background p-4">
                  Impact tracking is credible and consistent, with strong
                  evidence attached to service contributions.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
