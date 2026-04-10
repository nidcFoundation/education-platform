"use client";

import Link from "next/link";
import React from "react";
import {
  ArrowRight,
  CircleAlert,
  CircleCheck,
  Handshake,
  HeartHandshake,
  Mail,
  MessageSquareMore,
  User,
} from "lucide-react";
import { SectionWrapper } from "@/components/sections/section-wrapper";
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
import { Textarea } from "@/components/ui/textarea";

export type SupportType = "donor" | "partner";

const SUPPORT_COPY: Record<
  SupportType,
  {
    title: string;
    subtitle: string;
    submitLabel: string;
    icon: typeof HeartHandshake;
  }
> = {
  donor: {
    title: "Donor Support Request",
    subtitle:
      "Tell us how you'd like to support scholars and our team will follow up with next steps.",
    submitLabel: "Submit Donor Request",
    icon: HeartHandshake,
  },
  partner: {
    title: "Partnership Enquiry",
    subtitle:
      "Share your collaboration goals and we will reach out to explore the right partnership model.",
    submitLabel: "Submit Partnership Request",
    icon: Handshake,
  },
};

const supportOptions: Array<{ value: SupportType; label: string }> = [
  { value: "donor", label: "Donor Support" },
  { value: "partner", label: "Partnership Request" },
];

export function SupportClient({ initialType }: { initialType: SupportType }) {
  const [supportType, setSupportType] = React.useState<SupportType>(initialType);
  const [submittedEmail, setSubmittedEmail] = React.useState<string | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const activeCopy = SUPPORT_COPY[supportType];
  const ActiveIcon = activeCopy.icon;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("name")?.toString().trim() ?? "";
    const email = formData.get("email")?.toString().trim() ?? "";
    const message = formData.get("message")?.toString().trim() ?? "";
    const selectedSupportType =
      formData.get("supportType")?.toString().trim() ?? "";

    if (!name || !email || !message || !selectedSupportType) {
      setErrorMessage("Complete all fields before submitting your request.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/support", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          supportType: selectedSupportType,
          name,
          email,
          message,
        }),
      });

      const result = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;

      if (!response.ok) {
        setErrorMessage(
          result?.error ?? "Unable to submit your request right now."
        );
        return;
      }

      setSubmittedEmail(email);
      form.reset();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to submit your request right now."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <section className="bg-primary/5 py-20 pb-12 border-b">
        <div className="container mx-auto px-4 max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background px-4 py-2 text-sm font-medium text-primary">
            <ActiveIcon className="h-4 w-4" />
            Public support form
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            {activeCopy.title}
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
            {activeCopy.subtitle}
          </p>
        </div>
      </section>

      <SectionWrapper className="bg-background">
        <div className="grid gap-10 md:grid-cols-5 mt-8">
          <div className="space-y-5 md:col-span-2">
            <h2 className="text-2xl font-bold tracking-tight">
              What happens next
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Submit a few details and our team will review your request before
              contacting you by email with the right next step.
            </p>
            <div className="space-y-4">
              {[
                "A programme lead reviews each enquiry.",
                "Donor and partnership requests are routed to the right team.",
                "You will receive a follow-up by email after review.",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-xl border bg-muted/20 p-4"
                >
                  <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <p className="text-sm text-muted-foreground">{item}</p>
                </div>
              ))}
            </div>
            <Link
              href={supportType === "donor" ? "/donate" : "/partner-with-us"}
              className="inline-flex text-sm font-semibold text-primary hover:underline"
            >
              Back to {supportType === "donor" ? "donate" : "partner"} page
            </Link>
          </div>

          <div className="md:col-span-3">
            <Card className="border-border/50 shadow-sm">
              <CardContent className="space-y-5 px-6 py-8 md:px-8">
                {submittedEmail ? (
                  <div className="space-y-5">
                    <Alert>
                      <CircleCheck className="h-4 w-4" />
                      <AlertTitle>Request received</AlertTitle>
                      <AlertDescription>
                        We&apos;ve received your {supportType} request and will
                        contact you at {submittedEmail}.
                      </AlertDescription>
                    </Alert>

                    <p className="text-sm text-muted-foreground">
                      Our team will review your note and follow up by email with
                      the right contact person or next step.
                    </p>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setSubmittedEmail(null)}
                    >
                      Submit another request
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold">{activeCopy.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Complete the form below and we&apos;ll follow up via
                        email.
                      </p>
                    </div>

                    {errorMessage && (
                      <Alert variant="destructive">
                        <CircleAlert className="h-4 w-4" />
                        <AlertTitle>Submission failed</AlertTitle>
                        <AlertDescription>{errorMessage}</AlertDescription>
                      </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <input
                        type="hidden"
                        name="supportType"
                        value={supportType}
                      />

                      <div className="space-y-2">
                        <Label htmlFor="support-type">Type of Support</Label>
                        <Select
                          value={supportType}
                          onValueChange={(value) =>
                            setSupportType(value as SupportType)
                          }
                        >
                          <SelectTrigger id="support-type">
                            <SelectValue placeholder="Select a support type" />
                          </SelectTrigger>
                          <SelectContent>
                            {supportOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="name"
                            name="name"
                            placeholder="Adaeze Okonkwo"
                            className="pl-9"
                            autoComplete="name"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
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
                        <Label htmlFor="message">Message</Label>
                        <div className="relative">
                          <MessageSquareMore className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Textarea
                            id="message"
                            name="message"
                            placeholder="Tell us about the kind of support or partnership you're interested in."
                            className="min-h-[160px] resize-none pl-9 pt-3"
                            required
                          />
                        </div>
                      </div>

                      <Button
                        className="w-full h-11 font-semibold"
                        size="lg"
                        disabled={isSubmitting}
                      >
                        {isSubmitting
                          ? "Submitting request..."
                          : activeCopy.submitLabel}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </form>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
}
