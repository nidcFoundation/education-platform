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
  Phone,
  Shield,
  User,
} from "lucide-react";
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  getDefaultRedirectPath,
  getRoleForIntent,
  isAuthIntent,
  type AuthIntent,
} from "@/lib/auth/roles";
import { nigerianStates } from "@/constants/nigeria";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const CONFIG: Record<
  AuthIntent,
  { title: string; subtitle: string; cta: string; icon: LucideIcon }
> = {
  applicant: {
    title: "Create Applicant Account",
    subtitle:
      "Start your application for education support and national impact.",
    cta: "Continue as Applicant",
    icon: GraduationCap,
  },
  donor: {
    title: "Create Donor Account",
    subtitle: "Track donations, sponsorships, and real-time impact metrics.",
    cta: "Continue as Donor",
    icon: Heart,
  },
  partner: {
    title: "Create Partner Account",
    subtitle:
      "Begin institutional collaboration with the national talent engine.",
    cta: "Continue as Partner",
    icon: Handshake,
  },
};

export function SignupClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawIntent = searchParams.get("intent");
  const [stateOfOrigin, setStateOfOrigin] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(
    null
  );

  const currentIntent = isAuthIntent(rawIntent) ? rawIntent : null;

  const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!currentIntent) {
      setErrorMessage("Choose an account type before creating an account.");
      setSuccessMessage(null);
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    const firstName = formData.get("firstName")?.toString().trim() ?? "";
    const lastName = formData.get("lastName")?.toString().trim() ?? "";
    const email = formData.get("email")?.toString().trim() ?? "";
    const phone = formData.get("phone")?.toString().trim() ?? "";
    const password = formData.get("password")?.toString() ?? "";
    const confirmPassword = formData.get("confirmPassword")?.toString() ?? "";

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      setSuccessMessage(null);
      return;
    }

    if (currentIntent === "applicant" && !stateOfOrigin) {
      setErrorMessage("Select your state of origin to continue.");
      setSuccessMessage(null);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const role = getRoleForIntent(currentIntent);
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            full_name: `${firstName} ${lastName}`.trim(),
            phone,
            state_of_origin:
              currentIntent === "applicant" ? stateOfOrigin : null,
            role,
            account_type: currentIntent,
          },
        },
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      if (data.session?.user) {
        router.replace(getDefaultRedirectPath(role));
        router.refresh();
        return;
      }

      form.reset();
      setStateOfOrigin("");
      setSuccessMessage(
        "Account created. Check your email to confirm your address before signing in."
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to create your account right now."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-lg py-8 mx-auto">
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2 mb-6">
          <div className="h-9 w-9 rounded bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xl">N</span>
          </div>
          <span className="font-bold text-lg">National Talent Initiative</span>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">
          {currentIntent ? CONFIG[currentIntent].title : "Create Your Account"}
        </h1>
        <p className="text-muted-foreground text-sm mt-1 max-w-xs mx-auto">
          {currentIntent
            ? CONFIG[currentIntent].subtitle
            : "Select your account type to get started."}
        </p>
      </div>

      {!currentIntent && (
        <div className="grid grid-cols-3 gap-3 mb-8">
          {(Object.keys(CONFIG) as AuthIntent[]).map((key) => {
            const Icon = CONFIG[key].icon;

            return (
              <Link
                key={key}
                href={`/signup?intent=${key}`}
                className="flex flex-col items-center gap-3 p-4 rounded-xl border bg-background hover:border-primary/50 hover:bg-primary/5 transition-all group"
              >
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <Icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground group-hover:text-primary">
                  {key}
                </span>
              </Link>
            );
          })}
        </div>
      )}

      <Card
        className={`border-border/60 shadow-sm transition-opacity duration-300 ${
          !currentIntent ? "opacity-50 pointer-events-none" : "opacity-100"
        }`}
      >
        <CardContent className="p-6">
          {errorMessage && (
            <Alert variant="destructive" className="mb-5">
              <CircleAlert />
              <AlertTitle>Signup failed</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          {successMessage && (
            <Alert className="mb-5">
              <CircleCheck />
              <AlertTitle>Verify your email</AlertTitle>
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSignup} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first-name">First Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="first-name"
                    name="firstName"
                    placeholder="Chukwuemeka"
                    className="pl-9"
                    autoComplete="given-name"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">Last Name / Surname</Label>
                <Input
                  id="last-name"
                  name="lastName"
                  placeholder="Okafor"
                  autoComplete="family-name"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@email.com"
                  className="pl-9"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+234 803 xxx xxxx"
                  className="pl-9"
                  autoComplete="tel"
                  required
                />
              </div>
            </div>

            {currentIntent === "applicant" && (
              <div className="space-y-2">
                <Label htmlFor="state">State of Origin</Label>
                <Select value={stateOfOrigin} onValueChange={setStateOfOrigin}>
                  <SelectTrigger id="state">
                    <SelectValue placeholder="Select your state of origin" />
                  </SelectTrigger>
                  <SelectContent>
                    {nigerianStates.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Minimum 8 characters"
                  className="pl-9"
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
              </div>
              <p className="text-[10px] text-muted-foreground px-1 ml-9">
                Use 8+ characters with a mix of letters and numbers.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <div className="relative">
                <Shield className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirm-password"
                  name="confirmPassword"
                  type="password"
                  placeholder="Repeat your password"
                  className="pl-9"
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
              </div>
            </div>

            <div className="flex items-start gap-2 pt-1">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 accent-primary"
                required
              />
              <label
                htmlFor="terms"
                className="text-xs text-muted-foreground leading-relaxed"
              >
                I confirm that all information I provide will be truthful. I
                understand that NTDI reserves the right to verify all
                submissions for security and compliance.
              </label>
            </div>

            <Button
              type="submit"
              className="w-full h-10 font-semibold"
              disabled={!currentIntent || isSubmitting}
            >
              {isSubmitting
                ? "Creating account..."
                : currentIntent
                ? CONFIG[currentIntent].cta
                : "Create Account"}{" "}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>

          <Separator className="my-6" />

          <div className="flex items-start gap-3 p-3 bg-muted/40 rounded-lg text-xs text-muted-foreground">
            <Shield className="h-3.5 w-3.5 shrink-0 mt-0.5 text-primary" />
            <p>
              Your session is encrypted. By creating an account, you agree to
              our specialized data privacy terms for {currentIntent || "users"}.
            </p>
          </div>
        </CardContent>
      </Card>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-primary font-semibold hover:underline"
        >
          Sign In
        </Link>
      </p>
    </div>
  );
}
