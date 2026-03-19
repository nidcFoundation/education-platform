import Link from "next/link";
import { MetricCard } from "@/components/cards/metric-card";
import { HorizontalBarChart } from "@/components/donor/transparency-charts";
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
import { KeyRound, Shield, UserCheck, Users } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getAdminUsers } from "@/lib/supabase/actions";
import { redirect } from "next/navigation";

function getUserStatusClass(status: string) {
    if (status === "active") return "bg-emerald-100 text-emerald-800";
    if (status === "pending") return "bg-amber-100 text-amber-800";
    return "bg-red-100 text-red-800";
}

export default async function UserManagementPage() {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const allUsers = await getAdminUsers();

    const roleCounts = allUsers.reduce((acc: any, curr: any) => {
        const role = curr.role || "applicant";
        acc[role] = (acc[role] || 0) + 1;
        return acc;
    }, {});

    const userRoleBreakdown = [
        { label: "Applicants", value: roleCounts.applicant || 0, color: "#0f766e" },
        { label: "Scholars", value: roleCounts.scholar || 0, color: "#0284c7" },
        { label: "Reviewers", value: roleCounts.reviewer || 0, color: "#d97706" },
        { label: "Admins", value: roleCounts.admin || 0, color: "#dc2626" },
    ];

    const privilegedUsers = allUsers.filter((u: any) => ["admin", "reviewer", "partner"].includes(u.role));
    const pendingUsers = allUsers.filter((u: any) => u.status === "pending");

    const userMetrics = [
        { title: "Total Users", value: allUsers.length.toString(), description: "All registered accounts", icon: Users },
        { title: "Privileged Access", value: privilegedUsers.length.toString(), description: "Admins, reviewers, partners", icon: Shield },
        { title: "Pending Accounts", value: pendingUsers.length.toString(), description: "Awaiting confirmation", icon: UserCheck },
        { title: "MFA Coverage", value: "92%", description: "Estimated across staff", icon: KeyRound },
    ];

    const displayUsers = allUsers.slice(0, 10); // Show latest 10 for performance

    return (
        <PageContainer
            title="User Management"
            description="Manage platform users, operational roles, access levels, and account state."
            action={
                <Button asChild variant="outline">
                    <Link href="/admin/settings">Open System Settings</Link>
                </Button>
            }
        >
            <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {userMetrics.map((metric) => (
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
                            <CardTitle>User Role Mix</CardTitle>
                            <CardDescription>Distribution of operational access across platform teams.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <HorizontalBarChart items={userRoleBreakdown} valueSuffix="" />
                        </CardContent>
                    </Card>

                    <Card className="border-border/60">
                        <CardHeader>
                            <CardTitle>Access Overview</CardTitle>
                            <CardDescription>Role, account type, and current state for core operating accounts.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {displayUsers.map((u: any) => (
                                <div key={u.id} className="rounded-xl border bg-background p-4">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="font-medium">{u.first_name} {u.last_name}</p>
                                            <p className="mt-1 text-sm text-muted-foreground">{u.role} · {u.email}</p>
                                        </div>
                                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${getUserStatusClass(u.status)}`}>
                                            {u.status}
                                        </span>
                                    </div>
                                    <p className="mt-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                        Joined {new Date(u.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-border/60">
                    <CardHeader>
                        <CardTitle>User Directory</CardTitle>
                        <CardDescription>Admin view of account ownership, access scope, and current account status.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Joined</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {displayUsers.map((u: any) => (
                                    <TableRow key={u.id}>
                                        <TableCell className="font-medium">{u.first_name} {u.last_name}</TableCell>
                                        <TableCell className="capitalize">{u.role}</TableCell>
                                        <TableCell>{u.email}</TableCell>
                                        <TableCell>{new Date(u.created_at).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${getUserStatusClass(u.status)}`}>
                                                {u.status}
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
