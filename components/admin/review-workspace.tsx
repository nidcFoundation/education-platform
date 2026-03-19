"use client";

import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ApplicationStatusBadge } from "@/components/ui/application-status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import type { ApplicationStatus } from "@/types";
import { CalendarDays, ClipboardPen, FileText, UserCheck } from "lucide-react";

interface ReviewWorkspaceProps {
    application: any;
}

export function ReviewWorkspace({ application }: ReviewWorkspaceProps) {
    const [decision, setDecision] = useState<ApplicationStatus>(application.status as ApplicationStatus);
    const [feedback, setFeedback] = useState<string | null>(null);
    const [notes, setNotes] = useState("");
    const [scores, setScores] = useState<Record<string, number>>({
        "Academic Readiness": application.score || 0,
        "Service Potential": 0,
        "Mission Fit": 0
    });

    const rubric = [
        { label: "Academic Readiness", note: "Previous grades and technical foundation", max: 40 },
        { label: "Service Potential", note: "Leadership and community impact history", max: 30 },
        { label: "Mission Fit", note: "Alignment with NTDI core focus areas", max: 30 }
    ];

    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
    const totalPossibleScore = 100;

    function updateScore(label: string, rawValue: string, maxScore: number) {
        const nextValue = Number(rawValue);
        const clamped = Number.isNaN(nextValue)
            ? 0
            : Math.max(0, Math.min(maxScore, nextValue));
        setScores((current) => ({ ...current, [label]: clamped }));
        setFeedback("Review draft updated.");
    }

    function handleSaveDraft() {
        setFeedback("Review draft saved to local state. Integration with database pending Phase 2.");
    }

    function handleDecision(nextDecision: ApplicationStatus, message: string) {
        setDecision(nextDecision);
        setFeedback(message);
    }

    return (
        <div className="space-y-6">
            {feedback && (
                <Alert>
                    <ClipboardPen className="h-4 w-4" />
                    <AlertTitle>Review workspace updated</AlertTitle>
                    <AlertDescription>{feedback}</AlertDescription>
                </Alert>
            )}

            <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
                <Card className="border-border/60">
                    <CardHeader>
                        <div className="flex flex-wrap items-center gap-3">
                            <CardTitle>{application.profiles?.first_name} {application.profiles?.last_name}</CardTitle>
                            <ApplicationStatusBadge status={decision} />
                        </div>
                        <CardDescription>
                            {application.id.slice(0, 8)} · Cohort {application.cohort_year}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <div className="grid gap-3 sm:grid-cols-2">
                            <div className="rounded-xl border bg-muted/15 p-4">
                                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">State</p>
                                <p className="mt-2 font-semibold">{application.profiles?.state || "N/A"}</p>
                            </div>
                            <div className="rounded-xl border bg-muted/15 p-4">
                                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Submitted</p>
                                <p className="mt-2 font-semibold">{new Date(application.created_at).toLocaleDateString()}</p>
                            </div>
                            <div className="rounded-xl border bg-muted/15 p-4 sm:col-span-2">
                                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Total score</p>
                                <p className="mt-2 text-2xl font-bold tracking-tight">{totalScore} / {totalPossibleScore}</p>
                            </div>
                        </div>

                        <div className="rounded-xl border bg-background p-4">
                            <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-primary" />
                                <p className="font-medium">Information readiness</p>
                            </div>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Full application profile and secondary documents are being synced for the next phase.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/60">
                    <CardHeader>
                        <CardTitle>Review Tools</CardTitle>
                        <CardDescription>Coordinate the interview and issue a decision.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <div className="rounded-xl border bg-muted/15 p-4">
                            <div className="flex items-center gap-2">
                                <UserCheck className="h-4 w-4 text-primary" />
                                <p className="font-medium">Current Reviewer</p>
                            </div>
                            <p className="mt-2 text-lg font-semibold">System Administrator</p>
                        </div>

                        <div className="flex flex-wrap gap-3 pt-4">
                            <Button type="button" onClick={() => handleDecision("shortlisted", "Candidate shortlisted for interview planning.")}>
                                Shortlist
                            </Button>
                            <Button type="button" variant="outline" onClick={() => handleDecision("accepted", "Candidate marked approved.")}>
                                Approve
                            </Button>
                            <Button type="button" variant="destructive" onClick={() => handleDecision("rejected", "Candidate marked rejected.")}>
                                Reject
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                <Card className="border-border/60">
                    <CardHeader>
                        <CardTitle>Scoring</CardTitle>
                        <CardDescription>Review rubric covering academic readiness, service potential, and mission fit.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {rubric.map((item) => {
                            const inputId = `score-${item.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
                            return (
                                <div key={item.label} className="rounded-xl border bg-background p-4">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="font-medium">{item.label}</p>
                                            <p className="mt-1 text-sm text-muted-foreground">{item.note}</p>
                                        </div>
                                        <div className="w-24 space-y-2">
                                            <Label htmlFor={inputId}>Score</Label>
                                            <Input
                                                id={inputId}
                                                type="number"
                                                min={0}
                                                max={item.max}
                                                value={scores[item.label]}
                                                onChange={(event) => updateScore(item.label, event.target.value, item.max)}
                                            />
                                        </div>
                                    </div>
                                    <p className="mt-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">Max {item.max}</p>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>

                <Card className="border-border/60">
                    <CardHeader>
                        <CardTitle>Decision Trail & Notes</CardTitle>
                        <CardDescription>Structured feedback for the final decision.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="review-notes">Internal notes</Label>
                            <Textarea
                                id="review-notes"
                                rows={10}
                                value={notes}
                                onChange={(event) => {
                                    setNotes(event.target.value);
                                    setFeedback("Internal notes updated.");
                                }}
                                placeholder="Add observations about mission fit, interview performance..."
                            />
                        </div>

                        <Button type="button" variant="outline" className="w-full" onClick={handleSaveDraft}>
                            Save Draft Review
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
