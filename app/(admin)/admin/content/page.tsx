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
import { CalendarRange, FilePenLine, LayoutTemplate, Send } from "lucide-react";
import {
    adminContentItems,
    contentStatusBreakdown,
} from "@/lib/constants";
import { getAdminContent } from "@/lib/supabase/actions";

const contentMetrics = [
    { title: "Content Assets", value: "258", description: "Live, scheduled, and draft assets tracked", icon: LayoutTemplate },
    { title: "Awaiting Approval", value: "54", description: "Need brand, programme, or legal sign-off", icon: FilePenLine },
    { title: "Scheduled", value: "44", description: "Queued for future publication", icon: CalendarRange },
    { title: "Campaign Sends", value: "12", description: "Current reporting and stewardship outputs", icon: Send },
];

function getContentStatusClass(status: "Draft" | "In review" | "Scheduled" | "Live") {
    if (status === "Live") return "bg-emerald-100 text-emerald-800";
    if (status === "Scheduled") return "bg-blue-100 text-blue-800";
    if (status === "In review") return "bg-amber-100 text-amber-800";
    return "bg-slate-100 text-slate-800";
}

export default async function ContentManagementPage() {
    const dbContent = await getAdminContent();
    const displayItems = dbContent.length > 0
        ? dbContent.map((c: any) => ({
            title: c.title,
            type: c.type,
            audience: "Platform",
            owner: c.author || "Admin",
            updatedAt: new Date(c.published_date || c.created_at || new Date()).toLocaleDateString(),
            status: (c.status?.charAt(0).toUpperCase() + c.status?.slice(1)) as any || "Draft"
        }))
        : adminContentItems;

    return (
        <PageContainer
            title="Content Management"
            description="Manage platform content, review status, scheduling, and audience-specific publishing outputs."
            action={
                <Button asChild variant="outline">
                    <Link href="/admin/impact-reports">Back to Impact Reports</Link>
                </Button>
            }
        >
            <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {contentMetrics.map((metric) => (
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

                <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
                    <Card className="border-border/60">
                        <CardHeader>
                            <CardTitle>Content Status Mix</CardTitle>
                            <CardDescription>Current distribution of content assets across the editorial workflow.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <DonutBreakdownChart
                                items={contentStatusBreakdown}
                                totalLabel="Tracked assets"
                                totalValue="258"
                            />
                        </CardContent>
                    </Card>

                    <Card className="border-border/60">
                        <CardHeader>
                            <CardTitle>Workflow Breakdown</CardTitle>
                            <CardDescription>Approval and publishing flow by status category.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <HorizontalBarChart items={contentStatusBreakdown} valueSuffix="%" />
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-border/60">
                    <CardHeader>
                        <CardTitle>Content Register</CardTitle>
                        <CardDescription>Audience, ownership, updated time, and status across content currently tracked by admin.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Audience</TableHead>
                                    <TableHead>Owner</TableHead>
                                    <TableHead>Updated</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {displayItems.map((item: any) => (
                                    <TableRow key={item.title}>
                                        <TableCell className="font-medium">{item.title}</TableCell>
                                        <TableCell>{item.type}</TableCell>
                                        <TableCell>{item.audience}</TableCell>
                                        <TableCell>{item.owner}</TableCell>
                                        <TableCell>{item.updatedAt}</TableCell>
                                        <TableCell>
                                            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${getContentStatusClass(item.status)}`}>
                                                {item.status}
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
