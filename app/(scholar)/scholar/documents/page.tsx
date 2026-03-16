import { PageContainer } from "@/components/layout/page-container";
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
import { FileText, ShieldCheck } from "lucide-react";
import { scholarDocuments } from "@/mock-data/scholar";

const documentStatusClasses = {
    verified: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100",
    pending: "bg-amber-100 text-amber-800 hover:bg-amber-100",
    expiring: "bg-red-100 text-red-800 hover:bg-red-100",
};

export default function DocumentsPage() {
    return (
      <PageContainer
        title="Documents"
        description="Manage programme, academic, and placement documents tied to your scholar record."
        action={<Button>Upload New Document</Button>}
      >
        <div className="space-y-6">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Document Register
              </CardTitle>
              <CardDescription>
                Verification status, ownership, and expiry tracking for all
                uploaded records.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scholarDocuments.map((document) => (
                    <TableRow key={document.id}>
                      <TableCell className="font-medium">
                        {document.name}
                      </TableCell>
                      <TableCell>{document.type}</TableCell>
                      <TableCell>{document.updatedOn}</TableCell>
                      <TableCell>{document.expiresOn}</TableCell>
                      <TableCell>{document.owner}</TableCell>
                      <TableCell>
                        <Badge
                          className={documentStatusClasses[document.status]}
                        >
                          {document.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Compliance Notes
                </CardTitle>
                <CardDescription>
                  What needs attention to keep your scholar record healthy.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  "Renew the national ID before April 21, 2026 to avoid placement verification delays.",
                  "Placement letter is still pending internal validation from the placement office.",
                  "Transcript and award letter are verified and available for partner review.",
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

            <Card className="border-border/60">
              <CardHeader>
                <CardTitle>Required Package</CardTitle>
                <CardDescription>
                  Core records typically reviewed before placement matching.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  "Scholarship award letter",
                  "Latest university transcript",
                  "National ID",
                  "Placement or internship letter",
                  "Quarterly impact evidence pack",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-xl border bg-background p-4 text-sm text-muted-foreground"
                  >
                    {item}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-border/60">
              <CardHeader>
                <CardTitle>Required Package</CardTitle>
                <CardDescription>
                  Core records typically reviewed before placement matching.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  "Scholarship award letter",
                  "Latest university transcript",
                  "National ID",
                  "Placement or internship letter",
                  "Quarterly impact evidence pack",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-xl border bg-background p-4 text-sm text-muted-foreground"
                  >
                    {item}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </PageContainer>
    );
}
