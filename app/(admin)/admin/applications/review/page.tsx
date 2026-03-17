"use client";

import Link from "next/link";
import { useState } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ApplicationStatusBadge } from "@/components/ui/application-status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { featuredApplicationReview } from "@/mock-data/admin";

export default function ApplicationReviewPage() {
    const [assignedReviewer, setAssignedReviewer] = useState(featuredApplicationReview.currentReviewer);
    const [interviewDate, setInterviewDate] = useState(featuredApplicationReview.interview.date);
    const [interviewTime, setInterviewTime] = useState(featuredApplicationReview.interview.time);
    const [interviewMode, setInterviewMode] = useState(featuredApplicationReview.interview.mode);
    const [notes, setNotes] = useState(featuredApplicationReview.notes.join("\n\n"));
    const [decision, setDecision] = useState<ApplicationStatus>(featuredApplicationReview.currentStatus);
    const [feedback, setFeedback] = useState<string | null>(null);
    const [scores, setScores] = useState<Record<string, number>>(
        Object.fromEntries(featuredApplicationReview.rubric.map((item) => [item.label, item.score]))
    );

    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
    const totalPossibleScore = featuredApplicationReview.rubric.reduce((sum, item) => sum + item.max, 0);

    function updateScore(label: string, rawValue: string, maxScore: number) {
        const nextValue = Number(rawValue);
        const clamped = Number.isNaN(nextValue)
            ? 0
            : Math.max(0, Math.min(maxScore, nextValue));
        setScores((current) => ({ ...current, [label]: clamped }));
        setFeedback("Review draft updated locally.");
    }

    function handleSaveDraft() {
        setFeedback("Review draft saved locally. Connect the page to your backend workflow when ready.");
    }

    function handleDecision(nextDecision: ApplicationStatus, message: string) {
        setDecision(nextDecision);
        setFeedback(message);
    }

    return (
        <PageContainer
            title="Application Review"
            description="Assign reviewers, score the application, coordinate the interview, and issue a decision."
            action={
                <Button asChild variant="outline">
                    <Link href="/admin/applications">Back to Applications</Link>
                </Button>
            }
        >
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
                                <CardTitle>{featuredApplicationReview.applicant}</CardTitle>
                                <ApplicationStatusBadge status={decision} />
                            </div>
                            <CardDescription>
                                {featuredApplicationReview.id} · {featuredApplicationReview.program} · Cohort {featuredApplicationReview.cohort}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="rounded-xl border bg-muted/15 p-4">
                                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">State</p>
                                    <p className="mt-2 font-semibold">{featuredApplicationReview.state}</p>
                                </div>
                                <div className="rounded-xl border bg-muted/15 p-4">
                                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Track</p>
                                    <p className="mt-2 font-semibold">{featuredApplicationReview.track}</p>
                                </div>
                                <div className="rounded-xl border bg-muted/15 p-4">
                                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Submitted</p>
                                    <p className="mt-2 font-semibold">{featuredApplicationReview.submittedAt}</p>
                                </div>
                                <div className="rounded-xl border bg-muted/15 p-4">
                                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Total score</p>
                                    <p className="mt-2 text-2xl font-bold tracking-tight">{totalScore} / {totalPossibleScore}</p>
                                </div>
                            </div>

                            <div className="rounded-xl border bg-background p-4">
                                <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-primary" />
                                    <p className="font-medium">Document readiness</p>
                                </div>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Document</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Owner</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {featuredApplicationReview.documents.map((document) => (
                                            <TableRow key={document.name}>
                                                <TableCell>{document.name}</TableCell>
                                                <TableCell>{document.status}</TableCell>
                                                <TableCell>{document.owner}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/60">
                        <CardHeader>
                            <CardTitle>Review Tools</CardTitle>
                            <CardDescription>Configure reviewer assignment, interview scheduling, and the final decision.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="reviewer">Reviewer assignment</Label>
                                <Select
                                    value={assignedReviewer}
                                    onValueChange={(value) => {
                                        setAssignedReviewer(value);
                                        setFeedback("Reviewer assignment updated locally.");
                                    }}
                                >
                                    <SelectTrigger id="reviewer" className="w-full">
                                        <SelectValue placeholder="Assign reviewer" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {featuredApplicationReview.reviewers.map((reviewer) => (
                                            <SelectItem key={reviewer} value={reviewer}>
                                                {reviewer}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="interview-date">Interview date</Label>
                                    <Input
                                        id="interview-date"
                                        type="date"
                                        value={interviewDate}
                                        onChange={(event) => {
                                            setInterviewDate(event.target.value);
                                            setFeedback("Interview schedule updated locally.");
                                        }}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="interview-time">Interview time</Label>
                                    <Input
                                        id="interview-time"
                                        type="time"
                                        value={interviewTime}
                                        onChange={(event) => {
                                            setInterviewTime(event.target.value);
                                            setFeedback("Interview schedule updated locally.");
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="interview-mode">Interview scheduling</Label>
                                <Input
                                    id="interview-mode"
                                    value={interviewMode}
                                    onChange={(event) => {
                                        setInterviewMode(event.target.value);
                                        setFeedback("Interview mode updated locally.");
                                    }}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Panel: {featuredApplicationReview.interview.panel}
                                </p>
                            </div>

                            <div className="rounded-xl border bg-muted/15 p-4">
                                <div className="flex items-center gap-2">
                                    <UserCheck className="h-4 w-4 text-primary" />
                                    <p className="font-medium">Assigned reviewer</p>
                                </div>
                                <p className="mt-2 text-lg font-semibold">{assignedReviewer}</p>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <Button type="button" onClick={() => handleDecision("shortlisted", "Candidate shortlisted locally for interview planning.")}>
                                    Shortlist
                                </Button>
                                <Button type="button" variant="outline" onClick={() => handleDecision("accepted", "Candidate marked accepted locally.")}>
                                    Approve
                                </Button>
                                <Button type="button" variant="destructive" onClick={() => handleDecision("rejected", "Candidate marked rejected locally.")}>
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
                            {featuredApplicationReview.rubric.map((item) => {
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
                            <CardTitle>Notes and Decision Trail</CardTitle>
                            <CardDescription>Keep structured notes for the panel and final approver.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="rounded-xl border bg-muted/15 p-4">
                                <div className="flex items-center gap-2">
                                    <CalendarDays className="h-4 w-4 text-primary" />
                                    <p className="font-medium">Interview schedule</p>
                                </div>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    {interviewDate} at {interviewTime} · {interviewMode}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="review-notes">Review notes</Label>
                                <Textarea
                                    id="review-notes"
                                    rows={14}
                                    value={notes}
                                    onChange={(event) => {
                                        setNotes(event.target.value);
                                        setFeedback("Review notes updated locally.");
                                    }}
                                />
                            </div>

                            <Button type="button" variant="outline" onClick={handleSaveDraft}>
                                Save Draft Review
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </PageContainer>
    );
}
