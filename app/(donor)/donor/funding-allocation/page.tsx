"use client";

import { useState } from "react";
import {
    DonutBreakdownChart,
    HorizontalBarChart,
} from "@/components/donor/transparency-charts";
import { PageContainer } from "@/components/layout/page-container";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { AlertCircle, Banknote, Target } from "lucide-react";
import {
    cohortSuccessRates,
    fundDistribution,
    impactMetrics,
    scholarFundingBreakdown,
    sectorPlacementBreakdown,
    sponsoredScholars,
} from "@/mock-data/donor";

function getFilenameFromDisposition(contentDisposition: string | null) {
    const match = contentDisposition?.match(/filename="?([^"]+)"?/i);
    return match?.[1] ?? "allocation-summary.txt";
}

export default function FundingAllocationPage() {
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadError, setDownloadError] = useState<string | null>(null);

    async function downloadAllocationSummary() {
        setIsDownloading(true);
        setDownloadError(null);

        try {
            const response = await fetch("/api/donor/allocation-summary");

            if (!response.ok) {
                throw new Error("Unable to download the allocation summary right now.");
            }

            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.href = downloadUrl;
            link.download = getFilenameFromDisposition(response.headers.get("content-disposition"));
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            setDownloadError(error instanceof Error ? error.message : "Unable to download the allocation summary right now.");
        } finally {
            setIsDownloading(false);
        }
    }

    return (
        <PageContainer
            title="Funding Allocation"
            description="A transparent view of allocation tracking, scholar support, and the outcomes your funding is enabling."
            action={
                <Button onClick={downloadAllocationSummary} disabled={isDownloading} aria-busy={isDownloading}>
                    Download Allocation Summary
                </Button>
            }
        >
            <div className="space-y-6">
                {downloadError && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Download failed</AlertTitle>
                        <AlertDescription>{downloadError}</AlertDescription>
                    </Alert>
                )}

                <div className="grid gap-6 xl:grid-cols-2">
                    <Card className="border-border/60">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Banknote className="h-4 w-4 text-primary" />
                                Fund Allocation Tracking
                            </CardTitle>
                            <CardDescription>Where donor resources are being deployed across the scholar journey.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <DonutBreakdownChart items={fundDistribution} totalLabel="Allocated" totalValue="₦18.5M" />
                        </CardContent>
                    </Card>

                    <Card className="border-border/60">
                        <CardHeader>
                            <CardTitle>Scholar Funding Breakdown</CardTitle>
                            <CardDescription>Coverage quality across tuition, stipends, research, and leadership support.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <HorizontalBarChart items={scholarFundingBreakdown} valueSuffix="%" />
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                    <Card className="border-border/60">
                        <CardHeader>
                            <CardTitle>Scholar Support Ledger</CardTitle>
                            <CardDescription>How sponsored scholars are consuming their funding allocations.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Scholar</TableHead>
                                        <TableHead>Program</TableHead>
                                        <TableHead>Allocated</TableHead>
                                        <TableHead>Used</TableHead>
                                        <TableHead>Progress</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {sponsoredScholars.map((scholar) => (
                                        <TableRow key={scholar.id}>
                                            <TableCell className="font-medium">{scholar.name}</TableCell>
                                            <TableCell>{scholar.program}</TableCell>
                                            <TableCell>{scholar.allocation}</TableCell>
                                            <TableCell>{scholar.used}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{scholar.progressScore}%</Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <Card className="border-border/60">
                        <CardHeader>
                            <CardTitle>Impact Metrics</CardTitle>
                            <CardDescription>Key performance and development outcomes tied to the funding portfolio.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                            {impactMetrics.map((metric) => (
                                <div key={metric.label} className="rounded-xl border bg-muted/20 p-4">
                                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{metric.label}</p>
                                    <p className="mt-2 text-2xl font-bold tracking-tight">{metric.value}</p>
                                    <p className="mt-1 text-sm text-muted-foreground">{metric.description}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
                    <Card className="border-border/60">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Target className="h-4 w-4 text-primary" />
                                Sector Placements
                            </CardTitle>
                            <CardDescription>Where scholars are moving after the programme and why it matters.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <HorizontalBarChart items={sectorPlacementBreakdown} valueSuffix="%" />
                        </CardContent>
                    </Card>

                    <Card className="border-border/60">
                        <CardHeader>
                            <CardTitle>Cohort Success Rates</CardTitle>
                            <CardDescription>Retention, graduation, and placement visibility by cohort.</CardDescription>
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
