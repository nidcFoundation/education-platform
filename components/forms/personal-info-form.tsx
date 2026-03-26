"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ApplicationStepper } from "@/components/forms/application-stepper";
import { Info, Save, ArrowRight } from "lucide-react";
import { applicationSteps } from "@/constants/application";
import { nigerianStates } from "@/constants/nigeria";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { saveApplicationStep } from "@/lib/supabase/actions";

interface PersonalInfoFormProps {
  application: any;
  profile: any;
}

export function PersonalInfoForm({
  application,
  profile,
}: PersonalInfoFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const pi = application?.personal_info || {};

  const handleSave = async (
    e: React.FormEvent | React.MouseEvent<HTMLButtonElement>,
    isNext = false
  ) => {
    e.preventDefault();
    setLoading(true);

    try {
      const form = formRef.current;
      if (!form) {
        toast.error("Unable to save at the moment.");
        return;
      }

      const formData = new FormData(form);
      const getString = (key: string) => {
        const value = formData.get(key);
        return typeof value === "string" ? value.trim() : "";
      };

      const personalInfo = {
        firstName: getString("firstName"),
        middleName: getString("middleName"),
        lastName: getString("lastName"),
        email: pi.email || profile.email || "",
        phone: getString("phone"),
        dateOfBirth: getString("dob"),
        gender: getString("gender"),
        nationalId: getString("nationalId"),
        stateOfOrigin: getString("stateOfOrigin"),
        lgaOfOrigin: getString("lgaOfOrigin"),
        address: getString("address"),
        city: getString("city"),
        resState: getString("resState"),
      };

      const { error } = await saveApplicationStep(1, personalInfo, isNext);

      if (error) {
        toast.error(error);
        return;
      }

      toast.success("Progress saved");
      if (isNext) router.push("/application/step-2");
      else router.refresh();
    } catch {
      toast.error("Failed to save progress. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <ApplicationStepper steps={[...applicationSteps]} currentStep={1} />

      <form ref={formRef} onSubmit={(e) => handleSave(e, true)}>
        <Card className="border-border/50">
          <CardHeader className="border-b bg-muted/20">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Info className="h-4 w-4 text-primary" />
              All fields marked with * are required. Ensure all information
              matches your official identification.
            </p>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* Name */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                Full Name
              </h3>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    defaultValue={pi.firstName || profile?.first_name || ""}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="middleName">Middle Name</Label>
                  <Input
                    id="middleName"
                    name="middleName"
                    defaultValue={pi.middleName || ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name / Surname *</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    defaultValue={pi.lastName || profile?.last_name || ""}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                Contact Details
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={pi.email || profile.email}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    defaultValue={pi.phone || profile.phone || ""}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Personal */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                Personal Details
              </h3>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth *</Label>
                  <Input
                    id="dob"
                    name="dob"
                    type="date"
                    defaultValue={pi.dateOfBirth || ""}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender *</Label>
                  <Select name="gender" defaultValue={pi.gender?.toLowerCase()}>
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="national-id">NIN / National ID *</Label>
                  <Input
                    id="national-id"
                    name="nationalId"
                    defaultValue={pi.nationalId || ""}
                    placeholder="11-digit NIN"
                    maxLength={11}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Origin */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                State of Origin
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="state">State of Origin *</Label>
                  <Select
                    name="stateOfOrigin"
                    defaultValue={pi.stateOfOrigin || profile.state_of_origin}
                  >
                    <SelectTrigger id="state">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {nigerianStates.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lga">LGA of Origin *</Label>
                  <Input
                    id="lga"
                    name="lgaOfOrigin"
                    defaultValue={pi.lgaOfOrigin || ""}
                    placeholder="Enter your LGA"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                Residential Address
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Street Address *</Label>
                  <Input
                    id="address"
                    name="address"
                    defaultValue={pi.address || ""}
                    placeholder="House number, street name"
                    required
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      name="city"
                      defaultValue={pi.city || ""}
                      placeholder="City"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="res-state">State of Residence *</Label>
                    <Select name="resState" defaultValue={pi.resState}>
                      <SelectTrigger id="res-state">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {nigerianStates.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="border-t bg-muted/10 flex justify-between p-5">
            <Button
              type="button"
              variant="outline"
              className="gap-2"
              onClick={(e) => handleSave(e, false)}
              disabled={loading}
            >
              <Save className="h-4 w-4" /> Save Progress
            </Button>
            <Button
              type="submit"
              className="gap-2 font-semibold"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save & Continue"}{" "}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
