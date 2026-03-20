import {
    GrowthLineChart,
    HorizontalBarChart,
} from "@/components/donor/transparency-charts";
import { PageContainer } from "@/components/layout/page-container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { GraduationCap, Target } from "lucide-react";
import {
    programGrowth,
    programOutcomeHighlights,
    scholarOutcomeBreakdown,
    sectorPlacementBreakdown,
} from "@/lib/constants";

const cohortSuccessRates = [
    { cohort: "2023", retention: 98, graduation: 96, placement: 92 },
    { cohort: "2024", retention: 100, graduation: 0, placement: 0 },
    { cohort: "2025", retention: 100, graduation: 0, placement: 0 },
];

export default function ProgramOutcomesPage() {
    return (
        <PageContainer
            title="Program Outcomes"
            description="See how funding contributes to scholar performance, sector placement, and long-term programme success."
        >
            <div className="space-y-6">
                <div className="grid gap-6 xl:grid-cols-3">
                    {programOutcomeHighlights.map((highlight) => (
                        <Card key={highlight.title} className="border-border/60">
                            <CardHeader>
                                <CardTitle>{highlight.title}</CardTitle>
                                <CardDescription>{highlight.metric}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">{highlight.summary}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid gap-6 xl:grid-cols-2">
                    <Card className="border-border/60">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <GraduationCap className="h-4 w-4 text-primary" />
                                Scholar Outcomes
                            </CardTitle>
                            <CardDescription>Outcome mix across donor-backed scholars.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <HorizontalBarChart items={scholarOutcomeBreakdown} valueSuffix="%" />
                        </CardContent>
                    </Card>

                    <Card className="border-border/60">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Target className="h-4 w-4 text-primary" />
                                Sector Placements
                            </CardTitle>
                            <CardDescription>Where programme outcomes are materialising in the economy.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <HorizontalBarChart items={sectorPlacementBreakdown} valueSuffix="%" />
                        </CardContent>
                    </Card>

                    <Card className="border-border/60">
                        <CardHeader>
                            <CardTitle>Program Growth</CardTitle>
                            <CardDescription>Growth in the size of the donor-backed scholar portfolio.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <GrowthLineChart
                                data={programGrowth}
                                valueLabel="Supported scholars per year."
                                accent="#7c3aed"
                            />
                        </CardContent>
                    </Card>

                    <Card className="border-border/60">
                        <CardHeader>
                            <CardTitle>Cohort Success Rates</CardTitle>
                            <CardDescription>Success signals across recent cohorts.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Cohort</TableHead>
                                        <TableHead>Retention</TableHead>
                                        <TableHead>Graduation</TableHead>
                                        <TableHead>Placement</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {cohortSuccessRates.map((cohort) => (
                                        <TableRow key={cohort.cohort}>
                                            <TableCell className="font-medium">{cohort.cohort}</TableCell>
                                            <TableCell>{cohort.retention}%</TableCell>
                                            <TableCell>{cohort.graduation}%</TableCell>
                                            <TableCell>{cohort.placement}%</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </PageContainer>
    );
}
