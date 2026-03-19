import { MetricCard } from "@/components/cards/metric-card";
import { PageContainer } from "@/components/layout/page-container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Banknote, Briefcase, Landmark, Wallet } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getScholarDashboardData } from "@/lib/supabase/actions";
import { redirect } from "next/navigation";

const fundingBreakdownArr = [
  { label: "Tuition & academic fees", note: "Covers core fees, lab access, and project supervision.", allocated: "₦2.9M", used: "₦2.2M", utilisation: 76 },
  { label: "Living stipend", note: "Monthly stipends are on schedule with one pending cycle.", allocated: "₦1.1M", used: "₦800k", utilisation: 73 },
  { label: "Research support", note: "Includes dataset access and field transport.", allocated: "₦500k", used: "₦280k", utilisation: 56 },
];

export default async function FundingOverviewPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const {
    profile,
    fundingRecords
  } = await getScholarDashboardData(user.id);

  const ledger = fundingRecords.map((r: any) => ({
    id: r.id,
    date: new Date(r.disbursement_date || r.created_at).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' }),
    category: r.category,
    amount: new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(r.amount),
    reference: r.reference_number || `REF-${r.id.slice(0, 8)}`,
    status: r.status
  }));

  const totalApproved = profile?.approved_funding || 4800000;
  const totalDisbursed = fundingRecords.reduce((acc: number, curr: any) => acc + (curr.status === 'completed' ? Number(curr.amount) : 0), 0);
  const nextStipend = fundingRecords.find((r: any) => r.status === 'pending')?.amount || 350000;

  const formattedApproved = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(totalApproved);
  const formattedDisbursed = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(totalDisbursed);
  const formattedNext = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(nextStipend);

  return (
    <PageContainer
      title="Funding Overview"
      description="See scholarship disbursements, support categories, and the current funding runway."
      action={<Button>Download Funding Statement</Button>}
    >
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Approved Support"
            value={formattedApproved}
            description="Full scholarship commitment"
            icon={Landmark}
          />
          <MetricCard
            title="Disbursed"
            value={formattedDisbursed}
            description="Released to date"
            icon={Banknote}
          />
          <MetricCard
            title="Next Stipend"
            value={formattedNext}
            description={nextStipend > 0 ? "Upcoming release" : "No pending stipends"}
            icon={Wallet}
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle>Funding Breakdown</CardTitle>
              <CardDescription>
                How approved support is allocated across the scholar
                experience.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {fundingBreakdownArr.map((line) => (
                <div key={line.label} className="space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium">{line.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {line.note}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{line.used}</p>
                      <p className="text-xs text-muted-foreground">
                        of {line.allocated}
                      </p>
                    </div>
                  </div>
                  <Progress value={line.utilisation} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader>
              <CardTitle>Funding Health</CardTitle>
              <CardDescription>
                Compliance and release signals for the current cycle.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                "Tuition obligations are current and institution invoices are reconciled.",
                "Living stipend releases are on schedule with one pending payout cycle.",
                "Research support remains available for approved fieldwork and conference needs.",
                "Impact evidence and report submission are current, keeping funding status healthy.",
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

        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>Disbursement Ledger</CardTitle>
            <CardDescription>
              Chronological record of approved funding support.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ledger.map((disbursement: any) => (
                  <TableRow key={disbursement.id}>
                    <TableCell className="font-medium">
                      {disbursement.date}
                    </TableCell>
                    <TableCell>{disbursement.category}</TableCell>
                    <TableCell>{disbursement.amount}</TableCell>
                    <TableCell>{disbursement.reference}</TableCell>
                    <TableCell>
                      <StatusBadge status={disbursement.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {ledger.length === 0 && (
              <div className="text-sm text-muted-foreground text-center py-12 border border-dashed rounded-xl mt-4">
                No disbursement records found.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
