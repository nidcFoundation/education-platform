"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ApplicationStepper } from "@/components/forms/application-stepper";
import { ArrowLeft, ArrowRight, Save, Info, AlertCircle, CheckCircle2 } from "lucide-react";
import { applicationSteps } from "@/lib/constants/application";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { saveApplicationStep } from "@/lib/supabase/actions";

interface EssayFormProps {
    application: any;
}

const essayPrompts = [
    {
        id: "whyApply",
        label: "Why are you applying?",
        prompt: "Describe in detail why you are applying for the National Talent Development Initiative. What drove you to seek this opportunity, and what specific outcomes do you hope to achieve for Nigeria through this platform?",
        wordMin: 300,
        wordMax: 500,
    },
    {
        id: "nationalContribution",
        label: "Your Vision for National Contribution",
        prompt: "In your chosen discipline, describe specifically how you intend to apply your education and skills to address a measurable national challenge within 5 years of graduating. Be detailed, specific, and grounded.",
        wordMin: 300,
        wordMax: 500,
    },
    {
        id: "leadershipExample",
        label: "Demonstrated Leadership",
        prompt: "Describe a specific instance where you took initiative and led others — inside or outside a formal setting. What was the challenge, what exactly did you do, what was the result, and what did you learn about yourself as a leader?",
        wordMin: 200,
        wordMax: 400,
    },
    {
        id: "careerGoals",
        label: "Long-Term Career & Impact Goals",
        prompt: "Where do you see yourself in 10 years? Describe your career trajectory and the specific national impact you aim to have created. Why is this programme the most effective accelerant for that vision?",
        wordMin: 200,
        wordMax: 400,
    },
];

function wordCount(text: string) {
    return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
}

export function EssayForm({ application }: EssayFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const essays = application?.essays || {};
    const [formData, setFormData] = useState(essays);

    const handleTextChange = (id: string, value: string) => {
        setFormData((prev: any) => ({ ...prev, [id]: value }));
    };

    const handleSave = async (e: React.FormEvent | React.MouseEvent<HTMLButtonElement>, isNext = false) => {
        e.preventDefault();

        // Validate all essays are within [wordMin, wordMax] before saving
        for (const essay of essayPrompts) {
            const count = wordCount(formData[essay.id] || "");
            if (count < essay.wordMin) {
                toast.error(`"${essay.label}" needs at least ${essay.wordMin} words (${count} written).`);
                return;
            }
            if (count > essay.wordMax) {
                toast.error(`"${essay.label}" exceeds the ${essay.wordMax}-word limit (${count} written).`);
                return;
            }
        }

        setLoading(true);
        try {
            const { error } = await saveApplicationStep(3, formData, isNext);
            if (error) {
                toast.error(error);
                return;
            }

            toast.success("Draft saved");
            if (isNext) router.push("/application/step-4");
            else router.refresh();
        } catch {
            toast.error("Failed to save progress. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <ApplicationStepper steps={[...applicationSteps]} currentStep={3} />

            <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <p>
                    Do not copy content from the internet or use AI-generated text. Plagiarism is grounds for immediate disqualification.
                </p>
            </div>

            <form onSubmit={(e) => handleSave(e, true)}>
                <div className="space-y-6">
                    {essayPrompts.map((essay, i) => {
                        const content = formData[essay.id] || "";
                        const count = wordCount(content);
                        const isStarted = count > 0;
                        return (
                            <Card key={essay.id} className="border-border/50">
                                <CardHeader className="pb-3 border-b">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Essay {i + 1}</span>
                                                {isStarted && (
                                                    <Badge className="text-[10px] h-4 bg-emerald-100 text-emerald-700 border-none">
                                                        <CheckCircle2 className="h-2.5 w-2.5 mr-1" /> Draft saved
                                                    </Badge>
                                                )}
                                            </div>
                                            <h3 className="font-bold text-base">{essay.label}</h3>
                                        </div>
                                        <Badge variant="secondary" className="text-xs shrink-0">
                                            {essay.wordMin}–{essay.wordMax} words
                                        </Badge>
                                    </div>
                                    <div className="mt-3 p-3 bg-muted/30 rounded-lg text-sm text-muted-foreground leading-relaxed border">
                                        {essay.prompt}
                                    </div>
                                </CardHeader>

                                <CardContent className="p-5 space-y-3">
                                    <div className="space-y-2">
                                        <Label htmlFor={essay.id} className="sr-only">{essay.label}</Label>
                                        <Textarea
                                            id={essay.id}
                                            value={content}
                                            onChange={(e) => handleTextChange(essay.id, e.target.value)}
                                            placeholder={`Begin your response here... (minimum ${essay.wordMin} words)`}
                                            className="min-h-[200px] resize-y text-sm leading-relaxed"
                                        />
                                    </div>
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1.5">
                                            <Info className="h-3 w-3" /> Progress is tracked
                                        </span>
                                        <span className={`font-medium ${count > essay.wordMax
                                                ? "text-red-600"
                                                : count < essay.wordMin
                                                    ? "text-amber-600"
                                                    : "text-emerald-600"
                                            }`}>
                                            {count} / {essay.wordMin}–{essay.wordMax} words
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                <Card className="border-border/50 mt-6">
                    <CardFooter className="flex justify-between p-5">
                        <div className="flex gap-2">
                            <Link href="/application/step-2">
                                <Button type="button" variant="outline" className="gap-2"><ArrowLeft className="h-4 w-4" /> Back</Button>
                            </Link>
                            <Button type="button" variant="ghost" className="gap-2" onClick={(e) => handleSave(e, false)} disabled={loading}>
                                <Save className="h-4 w-4" /> Save Draft
                            </Button>
                        </div>
                        <Button type="submit" className="gap-2 font-semibold" disabled={loading}>
                            {loading ? "Saving..." : "Save & Continue"} <ArrowRight className="h-4 w-4" />
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
}
