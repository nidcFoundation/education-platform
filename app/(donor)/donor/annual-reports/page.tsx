import { GrowthLineChart } from "@/components/donor/transparency-charts";
import { PageContainer } from "@/components/layout/page-container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { annualReports, programGrowth } from "@/lib/constants";

export default function AnnualReportsPage() {
  return (
    <PageContainer
      title="Annual Reports"
      description="Archived yearly transparency reports covering financial deployment, scholar outcomes, and programme growth."
      action={<Button disabled>Download Latest Annual Report</Button>}
    >
      <div className="space-y-6">
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>Portfolio Growth Context</CardTitle>
            <CardDescription>
              Use the archive alongside growth data to see how donor support
              scaled over time.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GrowthLineChart
              data={programGrowth}
              valueLabel="Donor-backed scholar coverage by year."
              accent="#d97706"
            />
          </CardContent>
        </Card>

        <div className="grid gap-6 xl:grid-cols-3">
          {annualReports.map((report) => (
            <Card key={report.year} className="border-border/60">
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <CardTitle>{report.year}</CardTitle>
                  <Badge variant="outline">{report.fileSize}</Badge>
                </div>
                <CardDescription>{report.title}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {report.summary}
                </p>
                <div className="space-y-3">
                  {report.highlights.map((highlight) => (
                    <div
                      key={highlight}
                      className="rounded-xl border bg-muted/20 p-4 text-sm text-muted-foreground"
                    >
                      {highlight}
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <Button className="flex-1" disabled>
                    Download
                  </Button>
                  +{" "}
                  <Button variant="outline" className="flex-1" disabled>
                    View Summary
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
