"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  CircleAlert,
  CircleCheck,
  GraduationCap,
  Handshake,
  Heart,
  Lock,
  Mail,
  Shield,
  User,
} from "lucide-react";
import React, { Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";

import {
  getDefaultRedirectPath,
  getRoleForIntent,
  isAuthIntent,
  type AuthIntent,
} from "@/lib/auth/roles";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { FormField } from "@/components/forms/form-field";

// ── Config ────────────────────────────────────────────────────────────────────
const CONFIG: Record<
  AuthIntent,
  {
    title: string;
    subtitle: string;
    cta: string;
    icon: LucideIcon;
    description: string;
  }
> = {
  applicant: {
    title: "Continue as Applicant",
    subtitle:
      "Start your application for education support and national impact.",
    cta: "Continue as Applicant",
    icon: GraduationCap,
    description: "Apply for scholarship funding and university placement.",
  },
  donor: {
    title: "Continue as Donor",
    subtitle: "Track donations, sponsorships, and real-time impact metrics.",
    cta: "Continue as Donor",
    icon: Heart,
    description: "Fund scholars and track your real-time impact.",
  },
  partner: {
    title: "Continue as Partner",
    subtitle:
      "Begin institutional collaboration with the national talent engine.",
    cta: "Continue as Partner",
    icon: Handshake,
    description: "Collaborate as an institution or employer.",
  },
};

// ── Schema ────────────────────────────────────────────────────────────────────
const signupSchema = z
  .object({
    firstName: z.string().trim().min(1, "First name is required."),
    lastName: z.string().trim().min(1, "Last name is required."),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Enter a valid email address."),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .regex(/[a-z]/, "Must contain a lowercase letter.")
      .regex(/[A-Z]/, "Must contain an uppercase letter.")
      .regex(/[0-9]/, "Must contain a number.")
      .regex(/[^a-zA-Z0-9]/, "Must contain a special character."),
    confirmPassword: z.string().min(1, "Please confirm your password."),
    terms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms to continue."
    }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type SignupValues = z.infer<typeof signupSchema>;

// ── Inner component ───────────────────────────────────────────────────────────
function SignupPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawIntent = searchParams.get("intent");
  const currentIntent = isAuthIntent(rawIntent) ? rawIntent : null;

  const [successMessage, setSuccessMessage] = React.useState<string | null>(
    null
  );

  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const onSubmit = async (values: SignupValues) => {
    if (!currentIntent) {
      setError("root", {
        message: "Choose an account type before creating an account.",
      });
      return;
    }

    setSuccessMessage(null);

    try {
      const role = getRoleForIntent(currentIntent);
      const supabase = getSupabaseBrowserClient();

      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            first_name: values.firstName,
            last_name: values.lastName,
            full_name: `${values.firstName} ${values.lastName}`.trim(),
            role,
            account_type: currentIntent,
          },
        },
      });

      if (error) {
        setError("root", { message: error.message });
        toast.error("Signup failed", { description: error.message });
        return;
      }

      if (data.user && data.user.identities?.length === 0) {
        const msg =
          "An account with this email already exists. Please sign in.";
        setError("root", { message: msg });
        toast.error("Account exists", { description: msg });
        return;
      }

      if (data.session?.user) {
        toast.success("Account created!", {
          description: "Welcome to the National Talent Initiative.",
        });
        router.replace(getDefaultRedirectPath(role));
        router.refresh();
        return;
      }

      reset();
      const msg =
        "Account created. Check your email to confirm your address before signing in.";
      toast.success("Success!", { description: msg });

      router.replace("/login");
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Unable to create your account right now.";
      setError("root", { message: msg });
      toast.error("Error", { description: msg });
    }
  };

  return (
    <div className="min-h-screen flex items-start md:items-center justify-center p-4 bg-muted/30">
      <div className="w-full max-w-3xl grid md:grid-cols-[5fr_7fr] border border-border/50 rounded-xl overflow-hidden shadow-sm my-8 md:my-0">
        {/* ── Left: Brand Panel ── */}
        <div className="bg-foreground p-8 md:p-10 hidden md:flex flex-col gap-8 justify-between">
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
              Join the Initiative
            </p>
            <h2 className="text-2xl font-bold leading-snug tracking-tight text-background mb-2">
              Choose how you want to{" "}
              <span className="text-background/40 font-medium">
                make an impact.
              </span>
            </h2>
          </div>

          <div className="flex flex-col divide-y divide-background/10 border-t border-background/10">
            {(Object.keys(CONFIG) as AuthIntent[]).map((key) => {
              const Icon = CONFIG[key].icon;
              const isActive = currentIntent === key;
              return (
                <Link
                  key={key}
                  href={`/signup?intent=${key}`}
                  className={`flex items-start gap-3 py-4 transition-opacity ${isActive ? "opacity-100" : "opacity-40 hover:opacity-60"
                    }`}
                >
                  <div
                    className={`h-7 w-7 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${isActive ? "bg-primary/20" : "bg-background/5"
                      }`}
                  >
                    <Icon
                      className={`h-3.5 w-3.5 ${isActive ? "text-primary" : "text-background/60"
                        }`}
                    />
                  </div>
                  <div>
                    <p
                      className={`text-xs font-bold capitalize mb-0.5 ${isActive ? "text-background" : "text-background/60"
                        }`}
                    >
                      {key}
                    </p>
                    <p className="text-xs text-background/40 leading-relaxed">
                      {CONFIG[key].description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ── Right: Form Panel ── */}
        <div className="bg-background p-8 md:p-10 flex flex-col gap-5">
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
              Create your account
            </p>
            <h1 className="text-xl font-bold tracking-tight">
              {currentIntent ? CONFIG[currentIntent].title : "Get started"}
            </h1>
            {currentIntent && (
              <p className="text-xs text-muted-foreground mt-1">
                {CONFIG[currentIntent].subtitle}
              </p>
            )}
          </div>

          {/* Intent tabs */}
          <div className="flex border border-border/50 rounded-lg overflow-hidden">
            {(Object.keys(CONFIG) as AuthIntent[]).map((key) => {
              const Icon = CONFIG[key].icon;
              const isActive = currentIntent === key;
              return (
                <Link
                  key={key}
                  href={`/signup?intent=${key}`}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium transition-colors capitalize border-r last:border-r-0 border-border/50 ${isActive
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                    }`}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  {key}
                </Link>
              );
            })}
          </div>

          {/* Alerts */}
          {errors.root && (
            <Alert variant="destructive">
              <CircleAlert className="h-4 w-4" />
              <AlertTitle>Signup failed</AlertTitle>
              <AlertDescription>{errors.root.message}</AlertDescription>
            </Alert>
          )}
          {successMessage && (
            <Alert>
              <CircleCheck className="h-4 w-4" />
              <AlertTitle>Verify your email</AlertTitle>
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}

          {/* Form */}
          <form
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            className={`transition-opacity duration-200 ${!currentIntent ? "opacity-40" : "opacity-100"
              }`}
          >
            <fieldset disabled={!currentIntent || false} className="min-w-0 border-0 p-0 m-0">
              <FieldGroup className="">
                {/* Name row */}
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    name="firstName"
                    control={control}
                    label="First name"
                    placeholder="Chukwuemeka"
                    autoComplete="given-name"
                    icon={User}
                  />

                  <FormField
                    name="lastName"
                    control={control}
                    label="Last name"
                    placeholder="Okafor"
                    autoComplete="family-name"
                  />
                </div>

                {/* Email */}
                <FormField
                  name="email"
                  control={control}
                  label="Email address"
                  type="email"
                  placeholder="you@email.com"
                  autoComplete="email"
                  icon={Mail}
                />

                <FormField
                  name="password"
                  control={control}
                  isPassword
                  label="Password"
                  placeholder="Minimum 8 characters"
                  autoComplete="new-password"
                  icon={Lock}
                />

                {/* Confirm password */}
                <FormField
                  name="confirmPassword"
                  control={control}
                  isPassword
                  label="Confirm password"
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                  icon={Shield}
                />

                {/* Terms */}
                <FormField
                  name="terms"
                  control={control}
                  type="checkbox"
                  label="I confirm that all information I provide will be
                        truthful. I understand that NTDI reserves the right to
                        verify all submissions for security and compliance."
                />

                <Button
                  type="submit"
                  className="w-full h-9 text-sm rounded-md gap-2"
                  disabled={!currentIntent || isSubmitting}
                >
                  {isSubmitting
                    ? "Creating account..."
                    : currentIntent
                      ? CONFIG[currentIntent].cta
                      : "Create Account"}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </FieldGroup>
            </fieldset>
          </form>

          {/* Security note */}
          <div className="flex items-start gap-2 border-t border-border/50 pt-4">
            <Shield className="h-3.5 w-3.5 shrink-0 mt-0.5 text-primary" />
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Your session is encrypted. By creating an account, you agree to
              our data privacy terms for {currentIntent ?? "users"}.
            </p>
          </div>

          <p className="text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-foreground font-semibold hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Page export ───────────────────────────────────────────────────────────────
export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      }
    >
      <SignupPageContent />
    </Suspense>
  );
}
