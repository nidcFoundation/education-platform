"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, CircleAlert, Lock, Mail, Shield } from "lucide-react";
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { getDefaultRedirectPath, getRoleFromMetadata } from "@/lib/auth/roles";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LoginPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

    const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const email = formData.get("email")?.toString().trim() ?? "";
        const password = formData.get("password")?.toString() ?? "";

        setIsSubmitting(true);
        setErrorMessage(null);

        try {
            const supabase = getSupabaseBrowserClient();
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                setErrorMessage(error.message);
                return;
            }

            const role = getRoleFromMetadata(data.user.user_metadata);
            router.replace(getDefaultRedirectPath(role));
            router.refresh();
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : "Unable to sign you in right now.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto py-8">
            <div className="text-center mb-8">
                <Link href="/" className="inline-flex items-center gap-2 mb-6">
                    <div className="h-9 w-9 rounded bg-primary flex items-center justify-center">
                        <span className="text-primary-foreground font-bold text-xl">N</span>
                    </div>
                    <span className="font-bold text-lg">National Talent Initiative</span>
                </Link>
                <h1 className="text-2xl font-bold tracking-tight">Sign In</h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Access your secure portal
                </p>
            </div>

            <Card className="border-border/60 shadow-sm">
                <CardContent className="p-6">
                    {errorMessage && (
                        <Alert variant="destructive" className="mb-5">
                            <CircleAlert />
                            <AlertTitle>Sign-in failed</AlertTitle>
                            <AlertDescription>{errorMessage}</AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleSignIn} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    className="pl-9"
                                    autoComplete="email"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className="pl-9"
                                    autoComplete="current-password"
                                    required
                                />
                            </div>
                        </div>

                        <Button type="submit" className="w-full h-10 font-semibold mt-2" disabled={isSubmitting}>
                            {isSubmitting ? "Signing in..." : "Sign In to Portal"} <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </form>

                    <Separator className="my-6" />

                    <div className="flex items-start gap-3 p-3 bg-muted/40 rounded-lg text-xs text-muted-foreground">
                        <Shield className="h-3.5 w-3.5 shrink-0 mt-0.5 text-primary" />
                        <p>
                            This portal is secured with end-to-end encryption. Never share your password with anyone, including NTDI staff.
                        </p>
                    </div>
                </CardContent>
            </Card>

            <p className="text-center text-sm text-muted-foreground mt-6">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="text-primary font-semibold hover:underline">
                    Create Account
                </Link>
            </p>

            <p className="text-center text-xs text-muted-foreground mt-4">
                By signing in, you agree to the{" "}
                <Link href="/terms" className="hover:underline">Terms of Service</Link>{" "}
                and{" "}
                <Link href="/privacy" className="hover:underline">Privacy Policy</Link>.
            </p>
        </div>
    );
}
