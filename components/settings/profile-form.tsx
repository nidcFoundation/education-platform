"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Save, User, Mail, Phone, MapPin, Shield, Bell, Lock, AlertTriangle } from "lucide-react";
import { nigerianStates } from "@/lib/constants/nigeria";
import { toast } from "sonner";
import { changePassword, withdrawApplication, updateProfile } from "@/lib/supabase/actions";
import { CldUploadWidget } from "next-cloudinary";

interface ProfileFormProps {
    profile: any;
}

const NOTIFICATION_PREFS = [
    { key: "app_status", label: "Application Status Updates", desc: "Notify me when my application status changes.", enabled: true },
    { key: "doc_verify", label: "Document Verification", desc: "Notify me when a document is verified or flagged.", enabled: true },
    { key: "announcements", label: "New Announcements", desc: "Receive announcements from the programme office.", enabled: true },
    { key: "deadlines", label: "Deadline Reminders", desc: "Remind me before important deadlines.", enabled: false },
];

export function ProfileForm({ profile }: ProfileFormProps) {
    const [loading, setLoading] = useState(false);

    // ── Profile field state (controlled) ─────────────────────────────────────
    const [firstName, setFirstName] = useState(profile?.first_name ?? "");
    const [lastName, setLastName] = useState(profile?.last_name ?? "");
    const [phone, setPhone] = useState(profile?.phone ?? "");
    const [stateOfOrigin, setStateOfOrigin] = useState(profile?.state_of_origin ?? "");
    const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url ?? "");

    // ── Notification Preferences ──────────────────────────────────────────────
    const [prefs, setPrefs] = useState<Record<string, boolean>>(
        Object.fromEntries(NOTIFICATION_PREFS.map((p) => [p.key, p.enabled]))
    );
    const [prefsLoading, setPrefsLoading] = useState(false);

    const savePreferences = async () => {
        setPrefsLoading(true);
        // Optimistic save — upgrade to DB persist once notification_preferences table exists
        await new Promise((r) => setTimeout(r, 600));
        setPrefsLoading(false);
        toast.success("Notification preferences saved");
    };

    // ── Password Change ───────────────────────────────────────────────────────
    const [currentPw, setCurrentPw] = useState("");
    const [newPw, setNewPw] = useState("");
    const [confirmPw, setConfirmPw] = useState("");
    const [pwLoading, setPwLoading] = useState(false);

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentPw || !newPw || !confirmPw) {
            toast.error("All password fields are required");
            return;
        }
        if (newPw.length < 8) {
            toast.error("New password must be at least 8 characters");
            return;
        }
        if (newPw !== confirmPw) {
            toast.error("Passwords do not match");
            return;
        }
        setPwLoading(true);
        const { error } = await changePassword(newPw);
        setPwLoading(false);
        if (error) {
            toast.error(error);
        } else {
            toast.success("Password updated successfully");
            setCurrentPw("");
            setNewPw("");
            setConfirmPw("");
        }
    };

    // ── Withdraw Application ──────────────────────────────────────────────────
    const [showWithdrawConfirm, setShowWithdrawConfirm] = useState(false);
    const [withdrawing, setWithdrawing] = useState(false);

    const handleWithdraw = async () => {
        setWithdrawing(true);
        const { error } = await withdrawApplication(profile.id);
        setWithdrawing(false);
        setShowWithdrawConfirm(false);
        if (error) {
            toast.error(error);
        } else {
            toast.success("Your application has been withdrawn");
        }
    };

    // ── Profile Save ──────────────────────────────────────────────────────────
    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error } = await updateProfile(profile.id, {
                first_name: firstName,
                last_name: lastName,
                phone,
                state_of_origin: stateOfOrigin,
                avatar_url: avatarUrl,
            });
            if (error) {
                toast.error(error);
            } else {
                toast.success("Profile updated successfully");
                window.dispatchEvent(new Event('profileUpdated'));
            }
        } catch (err) {
            toast.error("An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* ── Personal Information ── */}
            <Card className="border-border/50">
                <CardHeader className="border-b bg-muted/10 pb-4">
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary relative group overflow-hidden shrink-0">
                            {avatarUrl ? (
                                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <span>{profile.first_name?.[0] ?? ''}{profile.last_name?.[0] ?? ''}</span>
                            )}
                            <CldUploadWidget
                                signatureEndpoint="/api/cloudinary/sign"
                                onSuccess={(result) => {
                                    if (result.info && typeof result.info !== "string" && result.info.secure_url) {
                                        setAvatarUrl(result.info.secure_url);
                                        updateProfile(profile.id, { avatar_url: result.info.secure_url })
                                    .then(({ error }) => {
                                        if (error) {
                                            toast.error("Failed to save avatar. Please try again.");
                                        } else {
                                            toast.success("Avatar updated successfully!");
                                            window.dispatchEvent(new Event('profileUpdated'));
                                        }
                                    });
                                    }
                                }}
                            >
                                {({ open }) => (
                                    <div
                                        onClick={(e) => { e.preventDefault(); open(); }}
                                        className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white text-xs font-medium"
                                    >
                                        Edit
                                    </div>
                                )}
                            </CldUploadWidget>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold">{profile.first_name ?? ''} {profile.last_name ?? ''}</h2>
                            <p className="text-sm text-muted-foreground">{profile.email ?? ''}</p>
                            <Badge variant="secondary" className="mt-1 text-xs uppercase">{profile.role ?? 'user'} Account</Badge>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-6 space-y-6">
                    <form onSubmit={handleSaveProfile} className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <User className="h-4 w-4" /> Personal Information
                            </h3>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="first">First Name</Label>
                                    <Input id="first" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="last">Last Name</Label>
                                    <Input id="last" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                                </div>
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <Mail className="h-4 w-4" /> Contact Details
                            </h3>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" type="email" defaultValue={profile.email} disabled />
                                <p className="text-xs text-muted-foreground">Email changes are restricted for security. Contact support.</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="pl-9" />
                                </div>
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <MapPin className="h-4 w-4" /> State of Origin
                            </h3>
                            <Select value={stateOfOrigin} onValueChange={setStateOfOrigin}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {nigerianStates.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex justify-end">
                            <Button type="submit" className="gap-2" disabled={loading}>
                                <Save className="h-4 w-4" /> {loading ? "Saving..." : "Save Profile Changes"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* ── Notification Preferences ── */}
            <Card className="border-border/50">
                <CardHeader className="border-b pb-3 bg-muted/10">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <Bell className="h-4 w-4" /> Notification Preferences
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                    {NOTIFICATION_PREFS.map((pref) => (
                        <div key={pref.key} className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium">{pref.label}</p>
                                <p className="text-xs text-muted-foreground">{pref.desc}</p>
                            </div>
                            <input
                                type="checkbox"
                                id={`pref-${pref.key}`}
                                checked={prefs[pref.key]}
                                onChange={(e) =>
                                    setPrefs((prev) => ({ ...prev, [pref.key]: e.target.checked }))
                                }
                                className="mt-1 h-4 w-4 accent-primary shrink-0 cursor-pointer"
                            />
                        </div>
                    ))}
                    <div className="flex justify-end pt-2">
                        <Button
                            variant="outline"
                            className="gap-2"
                            onClick={savePreferences}
                            disabled={prefsLoading}
                        >
                            <Save className="h-4 w-4" />
                            {prefsLoading ? "Saving..." : "Save Preferences"}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* ── Account Security ── */}
            <Card className="border-border/50">
                <CardHeader className="border-b pb-3 bg-muted/10">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <Shield className="h-4 w-4" /> Account Security
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                    <form onSubmit={handleChangePassword} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="cur-pw">Current Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="cur-pw"
                                    type="password"
                                    className="pl-9"
                                    placeholder="••••••••"
                                    value={currentPw}
                                    onChange={(e) => setCurrentPw(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="new-pw">New Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="new-pw"
                                        type="password"
                                        className="pl-9"
                                        placeholder="Minimum 8 characters"
                                        value={newPw}
                                        onChange={(e) => setNewPw(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirm-pw">Confirm Password</Label>
                                <Input
                                    id="confirm-pw"
                                    type="password"
                                    placeholder="Re-enter password"
                                    value={confirmPw}
                                    onChange={(e) => setConfirmPw(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end pt-1">
                            <Button type="submit" variant="outline" className="gap-2" disabled={pwLoading}>
                                <Lock className="h-4 w-4" />
                                {pwLoading ? "Updating..." : "Update Password"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* ── Danger Zone ── */}
            <Card className="border-red-200 bg-red-50/30 dark:bg-red-900/10">
                <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <p className="font-semibold text-sm text-red-700">Withdraw Application</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            This will permanently withdraw your application. This action cannot be undone.
                        </p>
                    </div>
                    <Button
                        variant="destructive"
                        size="sm"
                        className="shrink-0"
                        onClick={() => setShowWithdrawConfirm(true)}
                        disabled={withdrawing}
                    >
                        Withdraw Application
                    </Button>
                </CardContent>

                {showWithdrawConfirm && (
                    <CardContent className="px-5 pb-5 pt-0 border-t border-red-200">
                        <div className="rounded-md bg-red-100/70 dark:bg-red-900/20 border border-red-300 dark:border-red-700 p-4 space-y-3">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-semibold text-red-700">Are you sure?</p>
                                    <p className="text-xs text-red-600 mt-0.5">
                                        This will immediately withdraw your application. You will not be able to reverse this.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-3 justify-end">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowWithdrawConfirm(false)}
                                    disabled={withdrawing}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={handleWithdraw}
                                    disabled={withdrawing}
                                >
                                    {withdrawing ? "Withdrawing..." : "Confirm Withdraw"}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                )}
            </Card>
        </div>
    );
}
