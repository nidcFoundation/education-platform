"use client";

import { useState, type Dispatch, type SetStateAction, useTransition } from "react";
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
} from "@/lib/constants";
import { Settings2, Loader2 } from "lucide-react";
import { saveAdminSettings, saveOperationalDefaults } from "./actions";

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

interface SettingsClientProps {
    initialToggles: Record<string, boolean>;
    initialDefaults: any;
}

export function SettingsClient({ initialToggles, initialDefaults }: SettingsClientProps) {
    // Merge DB state with constants blueprint
    const mapWithInitial = (group: SettingToggle[]) =>
        group.map(item => ({
            ...item,
            enabled: initialToggles[item.id] !== undefined ? initialToggles[item.id] : item.enabled
        }));

    const [automation, setAutomation] = useState<SettingToggle[]>(mapWithInitial(adminSystemSettings.automation));
    const [access, setAccess] = useState<SettingToggle[]>(mapWithInitial(adminSystemSettings.access));
    const [communications, setCommunications] = useState<SettingToggle[]>(mapWithInitial(adminSystemSettings.communications));
    const [feedback, setFeedback] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    // Operational Defaults local state
    const [opsDefaults, setOpsDefaults] = useState({
        reporting_window: initialDefaults?.reporting_window || adminSystemSettings.operations.reportingWindow,
        review_sla: initialDefaults?.review_sla || adminSystemSettings.operations.reviewSla,
        escalation_window: initialDefaults?.escalation_window || adminSystemSettings.operations.escalationWindow,
        support_email: initialDefaults?.support_email || adminSystemSettings.operations.supportEmail,
    });

    function updateToggle(setter: Dispatch<SetStateAction<SettingToggle[]>>) {
        return (id: string, checked: boolean) => {
            setter((current) =>
                current.map((item) => (item.id === id ? { ...item, enabled: checked } : item))
            );
        };
    }

    function handleSave() {
        startTransition(async () => {
            const allToggles = [...automation, ...access, ...communications].map(t => ({
                id: t.id,
                enabled: t.enabled
            }));

            await Promise.all([
                saveAdminSettings(allToggles),
                saveOperationalDefaults(opsDefaults)
            ]);

            setFeedback("System configuration successfully synchronized to the database.");
            setTimeout(() => setFeedback(null), 5000);
        });
    }

    return (
        <PageContainer
            title="System Settings"
            description="Configure automation, access control, communications, and operating defaults."
            action={
                <Button onClick={handleSave} disabled={isPending}>
                    {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Save Settings
                </Button>
            }
        >
            <div className="space-y-6">
                {feedback && (
                    <Alert className="border-emerald-500/50 bg-emerald-500/10 text-emerald-600">
                        <Settings2 className="h-4 w-4" />
                        <AlertTitle>Settings Synced</AlertTitle>
                        <AlertDescription>{feedback}</AlertDescription>
                    </Alert>
                )}

                <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                    <div className="space-y-6">
                        <ToggleGroup
                            title="Automation"
                            description="Control routing, reminders, and anomaly detection."
                            items={automation}
                            onToggle={updateToggle(setAutomation)}
                        />
                        <ToggleGroup
                            title="Access Control"
                            description="Set baseline security and export permissions."
                            items={access}
                            onToggle={updateToggle(setAccess)}
                        />
                        <ToggleGroup
                            title="Communications"
                            description="Manage operational digests and approval notifications."
                            items={communications}
                            onToggle={updateToggle(setCommunications)}
                        />
                    </div>

                    <Card className="border-border/60 h-fit">
                        <CardHeader>
                            <CardTitle>Operational Defaults</CardTitle>
                            <CardDescription>Core timing and support settings.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="reporting-window">Reporting window</Label>
                                <Input
                                    id="reporting-window"
                                    value={opsDefaults.reporting_window}
                                    onChange={(e) => setOpsDefaults({ ...opsDefaults, reporting_window: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="review-sla">Review SLA</Label>
                                <Input
                                    id="review-sla"
                                    value={opsDefaults.review_sla}
                                    onChange={(e) => setOpsDefaults({ ...opsDefaults, review_sla: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="escalation-window">Escalation window</Label>
                                <Input
                                    id="escalation-window"
                                    value={opsDefaults.escalation_window}
                                    onChange={(e) => setOpsDefaults({ ...opsDefaults, escalation_window: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="support-email">Support email</Label>
                                <Input
                                    id="support-email"
                                    type="email"
                                    value={opsDefaults.support_email}
                                    onChange={(e) => setOpsDefaults({ ...opsDefaults, support_email: e.target.value })}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </PageContainer>
    );
}
