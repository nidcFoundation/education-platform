import { MetricCard } from "@/components/cards/metric-card";
import { GrowthLineChart } from "@/components/donor/transparency-charts";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Target, TrendingUp } from "lucide-react";
import { donorImpactReports, impactMetrics, programGrowth } from "@/lib/constants";

export default function ImpactReportsPage() {
    return (
        <PageContainer
            title="Impact Reports"
            description="Quarterly visibility into how funding translated into scholar development, career readiness, and measurable impact."
            action={<Button>Download Q1 Transparency Packet</Button>}
        >
            <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {impactMetrics.map((metric, index) => (
                        <MetricCard
                            key={metric.label}
                            title={metric.label}
                            value={metric.value}
                            description={metric.description}
                            icon={[Target, TrendingUp, FileText, FileText][index % 4]}
                        />
                    ))}
                </div>

                <Card className="border-border/60">
                    <CardHeader>
                        <CardTitle>Impact Growth Over Time</CardTitle>
                        <CardDescription>Growth in donor-backed scholar coverage and programme reach.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <GrowthLineChart
                            data={programGrowth}
                            valueLabel="Yearly growth in donor-backed scholar coverage."
                            accent="#0284c7"
                        />
                    </CardContent>
                </Card>

                <div className="grid gap-6 xl:grid-cols-3">
                    {donorImpactReports.map((report) => (
                        <Card key={report.id} className="border-border/60">
                            <CardHeader>
                                <CardTitle>{report.period}</CardTitle>
                                <CardDescription>{report.title}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-sm text-muted-foreground">{report.summary}</p>
                                <div className="space-y-3">
                                    {report.highlights.map((highlight) => (
                                        <div key={highlight} className="rounded-xl border bg-muted/20 p-4 text-sm text-muted-foreground">
                                            {highlight}
                                        </div>
                                    ))}
                                </div>
                                <Button variant="outline" className="w-full">Open Report Notes</Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </PageContainer>
    );
}
