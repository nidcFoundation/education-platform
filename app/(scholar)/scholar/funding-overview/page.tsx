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
import { disbursements, fundingBreakdown, fundingSnapshot } from "@/mock-data/scholar";

export default function FundingOverviewPage() {
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
              value={fundingSnapshot.approved}
              description="Full scholarship commitment"
              icon={Landmark}
            />
            <MetricCard
              title="Disbursed"
              value={fundingSnapshot.disbursed}
              description="Released to date"
              icon={Banknote}
            />
            <MetricCard
              title="Next Stipend"
              value="₦350,000"
              description={fundingSnapshot.nextStipend}
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
                {fundingBreakdown.map((line) => (
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
                  "Living stipend releases are on schedule with one pending March payout.",
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
                  {disbursements.map((disbursement) => (
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
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    );
}
