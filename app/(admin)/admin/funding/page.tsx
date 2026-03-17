import Link from "next/link";
import { MetricCard } from "@/components/cards/metric-card";
import {
    DonutBreakdownChart,
    HorizontalBarChart,
} from "@/components/donor/transparency-charts";
import { PageContainer } from "@/components/layout/page-container";
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
import { AlertCircle, Banknote, Briefcase, WalletCards } from "lucide-react";
import {
    adminFundingDistribution,
    adminFundingLedger,
    adminFundingTotals,
    sponsorFocusMix,
} from "@/mock-data/admin";

const fundingMetrics = [
    { title: "Committed", value: adminFundingTotals.committed, description: "Approved programme and sponsor funding", icon: WalletCards },
    { title: "Disbursed", value: adminFundingTotals.disbursed, description: "Released across active programme lines", icon: Banknote },
    { title: "Reserved", value: adminFundingTotals.reserved, description: "Held for onboarding and future releases", icon: Briefcase },
    { title: "Flagged", value: adminFundingTotals.flagged, description: "Needs compliance or sponsor follow-up", icon: AlertCircle },
];

function getFundingStatusClass(status: "Committed" | "Disbursed" | "Flagged") {
    if (status === "Disbursed") return "bg-emerald-100 text-emerald-800";
    if (status === "Committed") return "bg-blue-100 text-blue-800";
    return "bg-red-100 text-red-800";
}

export default function FundingManagementPage() {
    return (
        <PageContainer
            title="Funding Management"
            description="Manage allocations, disbursements, sponsor coverage, and funding watchlists across the platform."
            action={
                <Button asChild>
                    <Link href="/admin/sponsors">Open Sponsors</Link>
                </Button>
            }
        >
            <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {fundingMetrics.map((metric) => (
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

                <div className="grid gap-6 xl:grid-cols-2">
                    <Card className="border-border/60">
                        <CardHeader>
                            <CardTitle>Funding Distribution</CardTitle>
                            <CardDescription>How committed funding is split across scholarships, operations, and delivery support.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <DonutBreakdownChart
                                items={adminFundingDistribution}
                                totalLabel="Committed"
                                totalValue={adminFundingTotals.committed}
                            />
                        </CardContent>
                    </Card>

                    <Card className="border-border/60">
                        <CardHeader>
                            <CardTitle>Sponsor Focus Mix</CardTitle>
                            <CardDescription>Where sponsor capital is currently concentrated across the platform.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <HorizontalBarChart items={sponsorFocusMix} valueSuffix="%" />
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-border/60">
                    <CardHeader>
                        <CardTitle>Funding Ledger</CardTitle>
                        <CardDescription>Current commitments, disbursements, and flagged funding lines by programme and sponsor.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Programme</TableHead>
                                    <TableHead>Sponsor</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Window</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {adminFundingLedger.map((entry) => (
                                    <TableRow key={`${entry.programme}-${entry.sponsor}`}>
                                        <TableCell>{entry.programme}</TableCell>
                                        <TableCell>{entry.sponsor}</TableCell>
                                        <TableCell>{entry.amount}</TableCell>
                                        <TableCell>{entry.window}</TableCell>
                                        <TableCell>
                                            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${getFundingStatusClass(entry.status)}`}>
                                                {entry.status}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </PageContainer>
    );
}
