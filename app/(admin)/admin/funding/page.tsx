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
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getAdminFundingLedger } from "@/lib/supabase/actions";
import { redirect } from "next/navigation";

function getFundingStatusClass(status: string) {
    if (status === "completed" || status === "Disbursed") return "bg-emerald-100 text-emerald-800";
    if (status === "pending" || status === "Committed") return "bg-blue-100 text-blue-800";
    return "bg-red-100 text-red-800";
}

export default async function FundingManagementPage() {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const ledger = await getAdminFundingLedger();

    const committed = ledger.filter((l: any) => l.status === "pending" || l.status === "Committed").reduce((acc: number, l: any) => acc + Number(l.amount), 0);
    const disbursed = ledger.filter((l: any) => l.status === "completed" || l.status === "Disbursed").reduce((acc: number, l: any) => acc + Number(l.amount), 0);
    const flagged = ledger.filter((l: any) => l.status === "flagged" || l.status === "Flagged").reduce((acc: number, l: any) => acc + Number(l.amount), 0);
    const reserved = 640000000; // Mock or future: fetch from treasury table

    const fundingMetrics = [
        { title: "Committed", value: `N${(committed / 1000000000).toFixed(2)}B`, description: "Approved sponsor funding", icon: WalletCards },
        { title: "Disbursed", value: `N${(disbursed / 1000000000).toFixed(2)}B`, description: "Released across active lines", icon: Banknote },
        { title: "Reserved", value: `N${(reserved / 1000000).toFixed(0)}M`, description: "Held for future releases", icon: Briefcase },
        { title: "Flagged", value: `N${(flagged / 1000000).toFixed(0)}M`, description: "Needs compliance follow-up", icon: AlertCircle },
    ];

    const programDistribution = ledger.reduce((acc: any, curr: any) => {
        const progName = curr.programs?.name || "Other";
        acc[progName] = (acc[progName] || 0) + Number(curr.amount);
        return acc;
    }, {});

    const distributionItems = Object.entries(programDistribution).map(([label, value]: [string, any], index) => ({
        label,
        value: Number(value),
        color: ["#0f766e", "#0284c7", "#d97706", "#dc2626", "#475569"][index % 5],
        description: `Total funding for ${label}`,
        meta: `N${(Number(value) / 1000000).toFixed(0)}M`
    }));

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

                <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
                    <Card className="border-border/60">
                        <CardHeader>
                            <CardTitle>Programme Funding Mix</CardTitle>
                            <CardDescription>How committed funding is split across active programme lines.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <DonutBreakdownChart
                                items={distributionItems}
                                totalLabel="Committed"
                                totalValue={`N${(committed / 1000000000).toFixed(2)}B`}
                            />
                        </CardContent>
                    </Card>

                    <Card className="border-border/60">
                        <CardHeader>
                            <CardTitle>Sponsor Contribution Status</CardTitle>
                            <CardDescription>Capital concentration by major donor categories.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <HorizontalBarChart
                                items={distributionItems.slice(0, 4)}
                                valueSuffix="M"
                            />
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
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {ledger.map((entry: any) => (
                                    <TableRow key={entry.id}>
                                        <TableCell>{entry.programs?.name || "—"}</TableCell>
                                        <TableCell>
                                            {entry.profiles?.first_name} {entry.profiles?.last_name}
                                        </TableCell>
                                        <TableCell>N{Number(entry.amount).toLocaleString()}</TableCell>
                                        <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${getFundingStatusClass(entry.status)}`}>
                                                {entry.status}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {ledger.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-6 text-muted-foreground text-sm">
                                            No funding records found in the ledger.
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
