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
import { FileText, Shield, Upload } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getScholarDocuments } from "@/lib/supabase/actions";
import { redirect } from "next/navigation";

export default async function DocumentsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const scholarDocuments = await getScholarDocuments(user.id);

  return (
    <PageContainer
      title="Documents & Compliance"
      description="Manage your scholarship records, identity verification, and programme compliance documents."
      action={
        <Button className="gap-2">
          <Upload className="h-4 w-4" />
          Upload Document
        </Button>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-border/60">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div className="space-y-1.5">
                <CardTitle className="text-base">Identity & Profile</CardTitle>
                <CardDescription>
                  Verified records for account standing.
                </CardDescription>
              </div>
              <Shield className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                {scholarDocuments
                  .filter((doc: any) => doc.type === "Identity" || doc.type === "Compliance")
                  .map((doc: any) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between rounded-xl border bg-muted/20 p-3"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">{doc.name}</span>
                      </div>
                      <StatusBadge status={doc.status} />
                    </div>
                  ))}
                {scholarDocuments.filter((doc: any) => doc.type === "Identity" || doc.type === "Compliance").length === 0 && (
                  <p className="text-sm text-muted-foreground italic">No identity documents found.</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div className="space-y-1.5">
                <CardTitle className="text-base">Academic Records</CardTitle>
                <CardDescription>Official transcripts and enrollment proofs.</CardDescription>
              </div>
              <FileText className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                {scholarDocuments
                  .filter((doc: any) => doc.type === "Academic")
                  .map((doc: any) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between rounded-xl border bg-muted/20 p-3"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">{doc.name}</span>
                      </div>
                      <StatusBadge status={doc.status} />
                    </div>
                  ))}
                {scholarDocuments.filter((doc: any) => doc.type === "Academic").length === 0 && (
                  <p className="text-sm text-muted-foreground italic">No academic records found.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>Document Ledger</CardTitle>
            <CardDescription>
              Full register of all uploaded files and verification status.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Updated On</TableHead>
                  <TableHead>Expires On</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scholarDocuments.map((doc: any) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">{doc.name}</TableCell>
                    <TableCell>{doc.type}</TableCell>
                    <TableCell>{new Date(doc.updated_on).toLocaleDateString()}</TableCell>
                    <TableCell>{doc.expires_on ? new Date(doc.expires_on).toLocaleDateString() : "—"}</TableCell>
                    <TableCell>{doc.owner}</TableCell>
                    <TableCell>
                      <StatusBadge status={doc.status} />
                    </TableCell>
                  </TableRow>
                ))}
                {scholarDocuments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground text-sm">
                      No documents recorded in the ledger.
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
