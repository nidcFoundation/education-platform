"use client";

import { useState, type Dispatch, type SetStateAction } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    adminSystemSettings,
    type SettingToggle,
} from "@/mock-data/admin";
import { Settings2 } from "lucide-react";

function ToggleGroup({
    title,
    description,
    items,
    onToggle,
}: {
    title: string;
    description: string;
    items: SettingToggle[];
    onToggle: (id: string, checked: boolean) => void;
}) {
    return (
        <Card className="border-border/60">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {items.map((item) => {
                    const checkboxId = `setting-${item.id}`;

                    return (
                        <div key={item.id} className="flex items-start justify-between gap-4 rounded-xl border bg-background p-4">
                            <div className="space-y-1">
                                <Label htmlFor={checkboxId} className="leading-normal">
                                    {item.label}
                                </Label>
                                <p className="text-sm text-muted-foreground">{item.description}</p>
                            </div>
                            <Checkbox
                                id={checkboxId}
                                checked={item.enabled}
                                onCheckedChange={(checked) => onToggle(item.id, checked === true)}
                                aria-label={item.label}
                            />
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
}

export default function SystemSettingsPage() {
    const [automation, setAutomation] = useState<SettingToggle[]>([...adminSystemSettings.automation]);
    const [access, setAccess] = useState<SettingToggle[]>([...adminSystemSettings.access]);
    const [communications, setCommunications] = useState<SettingToggle[]>([...adminSystemSettings.communications]);
    const [feedback, setFeedback] = useState<string | null>(null);

    function updateToggle(
        setter: Dispatch<SetStateAction<SettingToggle[]>>,
        label: string
    ) {
        return (id: string, checked: boolean) => {
            setter((current) =>
                current.map((item) => (item.id === id ? { ...item, enabled: checked } : item))
            );
            setFeedback(`${label} settings updated locally.`);
        };
    }

    function saveSettings() {
        setFeedback("System settings saved locally. Connect this page to your admin backend when ready.");
    }

    return (
        <PageContainer
            title="System Settings"
            description="Configure automation, access control, communications, and operating defaults for the admin platform."
            action={<Button onClick={saveSettings}>Save Settings</Button>}
        >
            <div className="space-y-6">
                {feedback && (
                    <Alert>
                        <Settings2 className="h-4 w-4" />
                        <AlertTitle>Settings workspace updated</AlertTitle>
                        <AlertDescription>{feedback}</AlertDescription>
                    </Alert>
                )}

                <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                    <div className="space-y-6">
                        <ToggleGroup
                            title="Automation"
                            description="Control routing, reminders, and anomaly detection across the platform."
                            items={automation}
                            onToggle={updateToggle(setAutomation, "Automation")}
                        />
                        <ToggleGroup
                            title="Access Control"
                            description="Set baseline security and export permissions for platform users."
                            items={access}
                            onToggle={updateToggle(setAccess, "Access control")}
                        />
                        <ToggleGroup
                            title="Communications"
                            description="Manage operational digests, sponsor alerts, and approval notifications."
                            items={communications}
                            onToggle={updateToggle(setCommunications, "Communication")}
                        />
                    </div>

                    <Card className="border-border/60">
                        <CardHeader>
                            <CardTitle>Operational Defaults</CardTitle>
                            <CardDescription>Core timing and support settings used by the admin platform.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="reporting-window">Reporting window</Label>
                                <Input id="reporting-window" defaultValue={adminSystemSettings.operations.reportingWindow} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="review-sla">Review SLA</Label>
                                <Input id="review-sla" defaultValue={adminSystemSettings.operations.reviewSla} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="escalation-window">Escalation window</Label>
                                <Input id="escalation-window" defaultValue={adminSystemSettings.operations.escalationWindow} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="support-email">Support email</Label>
                                <Input id="support-email" type="email" defaultValue={adminSystemSettings.operations.supportEmail} />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </PageContainer>
    );
}
