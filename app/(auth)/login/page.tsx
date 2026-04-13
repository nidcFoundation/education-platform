"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, CircleAlert, Lock, Mail, Shield } from "lucide-react";
import { toast } from "sonner";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  getSafePostLoginRedirectPath,
  resolveUserRoleForSession,
} from "@/lib/auth/roles";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

// ── Schema ────────────────────────────────────────────────────────────────────
const loginSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

type LoginValues = z.infer<typeof loginSchema>;

// ── Component ─────────────────────────────────────────────────────────────────
export default function LoginPage() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginValues) => {
    try {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        setError("root", { message: error.message });
        toast.error("Sign-in failed", { description: error.message });
        return;
      }

      if (!data.user) {
        const message =
          "Your account was not returned after sign-in. Please try again.";
        setError("root", { message });
        toast.error("Sign-in failed", { description: message });
        return;
      }

      const role = await resolveUserRoleForSession(supabase, data.user);
      const nextPath = new URLSearchParams(window.location.search).get("next");
      const redirectPath = getSafePostLoginRedirectPath(nextPath, role);

      toast.success("Welcome back!", {
        description: "You have successfully signed in.",
      });
      router.replace(redirectPath);
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to sign you in right now.";
      setError("root", { message });
      toast.error("Authentication error", { description: message });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-3xl grid md:grid-cols-2 border border-border/50 rounded-xl overflow-hidden shadow-sm">
        {/* ── Left: Brand Panel ── */}
        <div className="bg-foreground p-10 flex-col justify-between hidden md:flex">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center shrink-0">
              <span className="text-primary-foreground font-bold text-sm">
                N
              </span>
            </div>
            <span className="text-background font-bold text-sm tracking-tight">
              National Talent Initiative
            </span>
          </Link>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2 mb-4">
              <span className="inline-block w-5 h-px bg-primary" />
              Secure Portal
            </p>
            <h2 className="text-2xl font-bold leading-snug tracking-tight text-background mb-3">
              Shaping Nigeria&apos;s future,{" "}
              <span className="text-background/50 font-medium">
                one scholar at a time.
              </span>
            </h2>
            <p className="text-sm text-background/45 leading-relaxed">
              Access your dashboard to track applications, funding status, and
              programme milestones.
            </p>
          </div>

          <div className="flex divide-x divide-background/10 border-t border-background/10 pt-5">
            {[
              { value: "5,000+", label: "Scholars" },
              { value: "36", label: "States" },
              { value: "98%", label: "Employed" },
            ].map((s, i) => (
              <div
                key={i}
                className={`flex-1 ${
                  i === 0 ? "pr-4" : i === 2 ? "pl-4" : "px-4"
                }`}
              >
                <div className="text-lg font-bold text-background tracking-tight leading-none">
                  {s.value}
                </div>
                <div className="text-xs text-background/40 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: Form Panel ── */}
        <div className="bg-background p-8 md:p-10 flex flex-col justify-center gap-6">
          {/* Mobile logo */}
          <Link href="/" className="flex md:hidden items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">
                N
              </span>
            </div>
            <span className="font-bold text-sm tracking-tight">
              National Talent Initiative
            </span>
          </Link>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
              Welcome back
            </p>
            <h1 className="text-xl font-bold tracking-tight">
              Sign in to your portal
            </h1>
          </div>

          {/* Root / server error */}
          {errors.root && (
            <Alert variant="destructive">
              <CircleAlert className="h-4 w-4" />
              <AlertTitle>Sign-in failed</AlertTitle>
              <AlertDescription>{errors.root.message}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup className="space-y-4">
              {/* Email */}
              <Controller
                name="email"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="login-email"
                      className="text-xs font-medium"
                    >
                      Email address
                    </FieldLabel>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                      <Input
                        {...field}
                        id="login-email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-9 h-9 text-sm"
                        autoComplete="email"
                        aria-invalid={fieldState.invalid}
                      />
                    </div>
                    {fieldState.invalid && (
                      <FieldError
                        errors={[fieldState.error]}
                        className="text-xs"
                      />
                    )}
                  </Field>
                )}
              />

              {/* Password */}
              <Controller
                name="password"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <div className="flex items-center justify-between">
                      <FieldLabel
                        htmlFor="login-password"
                        className="text-xs font-medium"
                      >
                        Password
                      </FieldLabel>
                      <Link
                        href="/forgot-password"
                        className="text-xs text-primary hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                      <Input
                        {...field}
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-9 h-9 text-sm"
                        autoComplete="current-password"
                        aria-invalid={fieldState.invalid}
                      />
                    </div>
                    {fieldState.invalid && (
                      <FieldError
                        errors={[fieldState.error]}
                        className="text-xs"
                      />
                    )}
                  </Field>
                )}
              />

              <Button
                type="submit"
                className="w-full h-9 text-sm rounded-md gap-2 mt-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing in..." : "Sign in to Portal"}
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </FieldGroup>
          </form>

          {/* Security note */}
          <div className="flex items-start gap-2.5 border-t border-border/50 pt-5">
            <Shield className="h-3.5 w-3.5 shrink-0 mt-0.5 text-primary" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              End-to-end encrypted. Never share your password with anyone,
              including NTDI staff.
            </p>
          </div>

          {/* Footer */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">
              No account?{" "}
              <Link
                href="/signup"
                className="text-foreground font-semibold hover:underline"
              >
                Create one
              </Link>
            </p>
            <p className="text-xs text-muted-foreground">
              By signing in you agree to our{" "}
              <Link href="/terms" className="hover:underline">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
