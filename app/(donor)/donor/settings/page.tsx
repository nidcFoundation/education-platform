import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { donorSettings } from "@/lib/constants";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getDonorDashboardData } from "@/lib/supabase/actions";
import { redirect } from "next/navigation";

function getPreferenceId(section: string, label: string) {
    return `${section}-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
}

export default async function DonorSettingsPage() {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { profile } = await getDonorDashboardData(user.id);

    return (
        <PageContainer
            title="Settings"
            description="Manage donor contacts, reporting preferences, and transparency notifications."
        >
            <div className="max-w-5xl space-y-6">
                <Card className="border-border/60">
                    <CardHeader>
                        <CardTitle>Organisation Profile</CardTitle>
                        <CardDescription>Core contact information used for reporting and donor communications.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="org-name">Organisation</Label>
                            <Input id="org-name" defaultValue={profile.organization || `${profile.first_name} ${profile.last_name}`} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="reporting-contact">Reporting Contact</Label>
                            <Input id="reporting-contact" defaultValue={donorSettings.contacts.reportingContact} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="donor-email">Email</Label>
                            <Input id="donor-email" type="email" defaultValue={profile.email} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="donor-phone">Phone</Label>
                            <Input id="donor-phone" defaultValue={donorSettings.contacts.phone} />
                        </div>
                        <div className="md:col-span-2 flex justify-end">
                            <Button disabled aria-disabled="true">Save Profile (coming soon)</Button>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-6 lg:grid-cols-2">
                    <Card className="border-border/60">
                        <CardHeader>
                            <CardTitle>Notification Preferences</CardTitle>
                            <CardDescription>Choose which donor transparency updates you want delivered automatically.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {donorSettings.notifications.map((item) => {
                                const checkboxId = getPreferenceId("notification", item.label);
                                const descriptionId = `${checkboxId}-description`;

                                return (
                                    <div key={item.label} className="flex items-start justify-between gap-4 rounded-xl border bg-muted/20 p-4">
                                        <div>
                                            <Label htmlFor={checkboxId} className="leading-normal">
                                                {item.label}
                                            </Label>
                                            <p id={descriptionId} className="text-sm text-muted-foreground">
                                                {item.description}
                                            </p>
                                        </div>
                                        <Input
                                            id={checkboxId}
                                            type="checkbox"
                                            defaultChecked={item.enabled}
                                            aria-describedby={descriptionId}
                                            className="mt-1 h-4 w-4 accent-primary"
                                        />
                                    </div>
                                );
                            })}
                            <div className="flex justify-end">
                                <Button variant="outline">Save Notifications</Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/60">
                        <CardHeader>
                            <CardTitle>Visibility & Acknowledgement</CardTitle>
                            <CardDescription>Manage how the initiative references your support in reports and donor materials.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {donorSettings.visibility.map((item) => {
                                const checkboxId = getPreferenceId("visibility", item.label);
                                const descriptionId = `${checkboxId}-description`;

                                return (
                                    <div key={item.label} className="flex items-start justify-between gap-4 rounded-xl border bg-muted/20 p-4">
                                        <div>
                                            <Label htmlFor={checkboxId} className="leading-normal">
                                                {item.label}
                                            </Label>
                                            <p id={descriptionId} className="text-sm text-muted-foreground">
                                                {item.description}
                                            </p>
                                        </div>
                                        <Input
                                            id={checkboxId}
                                            type="checkbox"
                                            defaultChecked={item.enabled}
                                            aria-describedby={descriptionId}
                                            className="mt-1 h-4 w-4 accent-primary"
                                        />
                                    </div>
                                );
                            })}
                            <div className="rounded-xl border bg-background p-4 text-sm text-muted-foreground">
                                Donor profile: {profile.organization || "Private Entity"} · Commitment window {profile.renewal_window || "Rolling"}
                            </div>
                            <div className="flex justify-end">
                                <Button variant="outline">Save Visibility</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </PageContainer>
    );
}
