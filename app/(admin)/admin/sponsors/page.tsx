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
import { Plus, Download, Search, Filter } from "lucide-react";
import { mockSponsors as adminSponsors } from "@/mock-data/funding-sponsors";

function getSponsorStatusClass(status: "Active" | "Renewal due" | "At risk") {
    if (status === "Active") return "bg-emerald-100 text-emerald-800";
    if (status === "Renewal due") return "bg-amber-100 text-amber-800";
    return "bg-red-100 text-red-800";
}

export default function SponsorsPage() {
    return (
        <PageContainer
            title="Sponsors Management"
            description="Manage corporate sponsors, foundations, and institutional donors fueling the platform."
            action={
                <div className="flex gap-3">
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" /> Export
                    </Button>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add Sponsor
                    </Button>
                </div>
            }
        >
            <div className="space-y-6">
                <Card className="border-border/60">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Sponsor Roster</CardTitle>
                                <CardDescription>Overview of active commitments and reporting statuses.</CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="icon"><Search className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="icon"><Filter className="h-4 w-4" /></Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Sponsor</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Commitment</TableHead>
                                    <TableHead>Focus Area</TableHead>
                                    <TableHead>Renewal</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {adminSponsors.map((sponsor) => (
                                    <TableRow key={sponsor.name}>
                                        <TableCell className="font-medium">{sponsor.name}</TableCell>
                                        <TableCell>{sponsor.category}</TableCell>
                                        <TableCell>{sponsor.commitment}</TableCell>
                                        <TableCell>{sponsor.focus}</TableCell>
                                        <TableCell>{sponsor.renewalWindow}</TableCell>
                                        <TableCell>
                                            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${getSponsorStatusClass(sponsor.status)}`}>
                                                {sponsor.status}
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
