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
import {
    adminUsers,
    userRoleBreakdown,
} from "@/mock-data/admin";

const userMetrics = [
    { title: "User Accounts", value: "214", description: "Staff, reviewers, and partner accounts", icon: Users },
    { title: "Privileged Access", value: "58", description: "High-access reviewer and admin accounts", icon: Shield },
    { title: "Pending Invites", value: "7", description: "Awaiting acceptance or role confirmation", icon: UserCheck },
    { title: "MFA Coverage", value: "96%", description: "Across privileged user groups", icon: KeyRound },
];

function getUserStatusClass(status: "Active" | "Pending" | "Suspended") {
    if (status === "Active") return "bg-emerald-100 text-emerald-800";
    if (status === "Pending") return "bg-amber-100 text-amber-800";
    return "bg-red-100 text-red-800";
}

export default function UserManagementPage() {
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
                            <CardDescription>Role, team, and current state for core operating accounts.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {adminUsers.map((user) => (
                                <div key={user.name} className="rounded-xl border bg-background p-4">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="font-medium">{user.name}</p>
                                            <p className="mt-1 text-sm text-muted-foreground">{user.role} · {user.team}</p>
                                        </div>
                                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${getUserStatusClass(user.status)}`}>
                                            {user.status}
                                        </span>
                                    </div>
                                    <p className="mt-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                        {user.access} · {user.lastActive}
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
                                    <TableHead>Team</TableHead>
                                    <TableHead>Access</TableHead>
                                    <TableHead>Last Active</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {adminUsers.map((user) => (
                                    <TableRow key={user.name}>
                                        <TableCell className="font-medium">{user.name}</TableCell>
                                        <TableCell>{user.role}</TableCell>
                                        <TableCell>{user.team}</TableCell>
                                        <TableCell>{user.access}</TableCell>
                                        <TableCell>{user.lastActive}</TableCell>
                                        <TableCell>
                                            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${getUserStatusClass(user.status)}`}>
                                                {user.status}
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
