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
import { ArrowLeft, ArrowRight, Save, Info } from "lucide-react";
import { applicationSteps, programChoices } from "@/constants/application";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { saveApplicationStep } from "@/lib/supabase/actions";

interface AcademicBackgroundFormProps {
  application: any;
}

export function AcademicBackgroundForm({
  application,
}: AcademicBackgroundFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const ab = application?.academic_background || {};

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

      const academicBackground = {
        programChoice: getString("programChoice"),
        secondarySchool: getString("secondarySchool"),
        waecYear: getString("waecYear"),
        waecGrade: getString("waecGrade"),
        jambScore: getString("jambScore"),
        jambYear: getString("jambYear"),
        institution: getString("institution"),
        course: getString("course"),
        currentYear: getString("currentYear"),
        programType: getString("programType"),
      };

      const { error } = await saveApplicationStep(
        2,
        academicBackground,
        isNext
      );
      if (error) {
        toast.error(error);
        return;
      }

      toast.success("Progress saved");
      if (isNext) router.push("/application/step-3");
      else router.refresh();
    } catch {
      toast.error("Failed to save progress. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <ApplicationStepper steps={[...applicationSteps]} currentStep={2} />

      <form ref={formRef} onSubmit={(e) => handleSave(e, true)}>
        <Card className="border-border/50">
          <CardHeader className="border-b bg-muted/20">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Info className="h-4 w-4 text-primary" />
              All academic credentials will be independently verified. Any
              discrepancy will result in disqualification.
            </p>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* Programme Choice */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                Programme Selection
              </h3>
              <div className="space-y-2">
                <Label htmlFor="program">Preferred NTDI Programme *</Label>
                <Select
                  name="programChoice"
                  defaultValue={application?.programChoice || application?.program_choice || ""}
                >
                  <SelectTrigger id="program">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {programChoices.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Programme placement is subject to assessment results and
                  national strategic needs.
                </p>
              </div>
            </div>

            {/* Secondary School */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                Secondary School
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="school">Name of Secondary School *</Label>
                  <Input
                    id="school"
                    name="secondarySchool"
                    defaultValue={ab.secondarySchool || ""}
                    placeholder="Full official name of school"
                    required
                  />
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="waec-year">WAEC/NECO Year *</Label>
                    <Input
                      id="waec-year"
                      name="waecYear"
                      defaultValue={ab.waecYear || ""}
                      placeholder="e.g. 2021"
                      maxLength={4}
                      required
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="waec-grade">
                      WAEC/NECO Results Summary *
                    </Label>
                    <Input
                      id="waec-grade"
                      name="waecGrade"
                      defaultValue={ab.waecGrade || ""}
                      placeholder="e.g. 8 A1s, including Mathematics and English"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* JAMB */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                JAMB / UTME
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="jamb-score">JAMB Score *</Label>
                  <Input
                    id="jamb-score"
                    name="jambScore"
                    defaultValue={ab.jambScore || ""}
                    placeholder="e.g. 334"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Minimum 280 required
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jamb-year">JAMB Year *</Label>
                  <Input
                    id="jamb-year"
                    name="jambYear"
                    defaultValue={ab.jambYear || ""}
                    placeholder="e.g. 2022"
                    maxLength={4}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Current Institution */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                Current Tertiary Institution (if enrolled)
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="institution">Institution Name</Label>
                  <Input
                    id="institution"
                    name="institution"
                    defaultValue={ab.institution || ""}
                    placeholder="University / Polytechnic name"
                  />
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="course">Course / Department *</Label>-{" "}
                    <Input
                      id="course"
                      name="course"
                      defaultValue={ab.course || ""}
                      placeholder="e.g. Computer Science"
                    />
                    +{" "}
                    <Input
                      id="course"
                      name="course"
                      defaultValue={ab.course || ""}
                      placeholder="e.g. Computer Science"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year">Current Year</Label>
                    <Select name="currentYear" defaultValue={ab.currentYear}>
                      <SelectTrigger id="year">
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          "Year 1",
                          "Year 2",
                          "Year 3",
                          "Year 4",
                          "Year 5",
                          "Postgraduate",
                        ].map((y) => (
                          <SelectItem key={y} value={y}>
                            {y}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="program-type">Programme Type *</Label>
                  <Select name="programType" defaultValue={ab.programType}>
                    <SelectTrigger id="program-type">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="undergraduate">
                        Undergraduate
                      </SelectItem>
                      <SelectItem value="postgraduate">Postgraduate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="border-t bg-muted/10 flex justify-between p-5">
            <div className="flex gap-2">
              <Link href="/application/step-1">
                <Button type="button" variant="outline" className="gap-2">
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
              </Link>
              <Button
                type="button"
                variant="ghost"
                className="gap-2"
                onClick={(e) => handleSave(e, false)}
                disabled={loading}
              >
                <Save className="h-4 w-4" /> Save
              </Button>
            </div>
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
