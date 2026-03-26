"use client";

import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ApplicationStatusBadge } from "@/components/ui/application-status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ApplicationStatus, DocumentStatus, UploadedDocument } from "@/types";
import {
    AlertCircle,
    CheckCircle2,
    ClipboardPen,
    Clock,
    FileText,
    Loader2,
    UserCheck,
    XCircle,
} from "lucide-react";
import {
    updateApplicationDecision,
    updateApplicationDocumentStatus,
} from "@/lib/supabase/actions";
import { useRouter } from "next/navigation";

interface ReviewWorkspaceApplication {
    id: string;
    status: ApplicationStatus;
    score?: number | null;
    review_notes?: string | null;
    review_scores?: Record<string, number> | null;
    cohort_year?: string | number | null;
    created_at: string;
    documents?: UploadedDocument[];
    profiles?: {
        first_name?: string | null;
        last_name?: string | null;
        state?: string | null;
        state_of_origin?: string | null;
    } | null;
}

interface ReviewWorkspaceProps {
    application: ReviewWorkspaceApplication;
}

const rubric = [
    { label: "Academic Readiness", note: "Previous grades and technical foundation", max: 40 },
    { label: "Service Potential", note: "Leadership and community impact history", max: 30 },
    { label: "Mission Fit", note: "Alignment with NTDI core focus areas", max: 30 },
] as const;

const documentStatusLabel: Record<DocumentStatus, string> = {
    verified: "Verified",
    pending: "Under Review",
    rejected: "Rejected",
    expiring: "Expiring Soon",
};

const documentStatusIcon: Record<DocumentStatus, React.ReactNode> = {
    verified: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
    pending: <Clock className="h-4 w-4 text-amber-500" />,
    rejected: <XCircle className="h-4 w-4 text-red-500" />,
    expiring: <AlertCircle className="h-4 w-4 text-red-500" />,
};

const documentSlotLabels: Record<string, string> = {
    transcript: "Academic Transcripts / WAEC Result",
    id: "Government-Issued ID",
    reference_letter_academic: "Reference Letter 1 (Academic)",
    reference_letter_community: "Reference Letter 2 (Community)",
    jamb_result: "JAMB / UTME Result",
    essay: "Statement of Purpose",
};

function getInitialScores(application: ReviewWorkspaceApplication): Record<string, number> {
    const savedScores = application.review_scores || {};

    return {
        "Academic Readiness":
            typeof savedScores["Academic Readiness"] === "number"
                ? savedScores["Academic Readiness"]
                : application.score || 0,
        "Service Potential":
            typeof savedScores["Service Potential"] === "number"
                ? savedScores["Service Potential"]
                : 0,
        "Mission Fit":
            typeof savedScores["Mission Fit"] === "number"
                ? savedScores["Mission Fit"]
                : 0,
    };
}

function getDocumentDisplayLabel(document: UploadedDocument): string {
    if (document.slot && documentSlotLabels[document.slot]) {
        return documentSlotLabels[document.slot];
    }

    return document.name;
}

function getDocumentStatusClassName(status: DocumentStatus): string {
    switch (status) {
        case "verified":
            return "border-emerald-200 bg-emerald-50 text-emerald-700";
        case "pending":
            return "border-amber-200 bg-amber-50 text-amber-700";
        case "rejected":
        case "expiring":
            return "border-red-200 bg-red-50 text-red-700";
        default:
            return "border-border bg-background text-foreground";
    }
}

export function ReviewWorkspace({ application }: ReviewWorkspaceProps) {
    const [decision, setDecision] = useState<ApplicationStatus>(application.status as ApplicationStatus);
    const [requestedDecision, setRequestedDecision] = useState<ApplicationStatus | null>(null);
    const [feedback, setFeedback] = useState<string | null>(null);
    const [notes, setNotes] = useState(application.review_notes ?? "");
    const [scores, setScores] = useState<Record<string, number>>(() => getInitialScores(application));
    const [documents, setDocuments] = useState<UploadedDocument[]>(application.documents || []);
    const [isSaving, setIsSaving] = useState(false);
    const [documentAction, setDocumentAction] = useState<{ id: string; status: DocumentStatus } | null>(null);
    const router = useRouter();

    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
    const totalPossibleScore = 100;
    const displayedDecision = isSaving && requestedDecision ? requestedDecision : decision;
    const verifiedDocuments = documents.filter((document) => document.status === "verified").length;
    const pendingDocuments = documents.filter((document) => document.status === "pending").length;

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

    async function handleDecision(nextDecision: ApplicationStatus, message: string) {
        setRequestedDecision(nextDecision);
        setIsSaving(true);

        try {
            const { error } = await updateApplicationDecision(
                application.id,
                application.applicant_id,
                nextDecision,
                notes,
                scores
            );

            if (error) {
                setRequestedDecision(null);
                setFeedback(`Error: ${error}`);
                return;
            }

            setDecision(nextDecision);
            setFeedback(message);
            router.refresh();
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "An unexpected error occurred.";
            setFeedback(`Error: ${message}`);
        } finally {
            setIsSaving(false);
            setRequestedDecision(null);
        }
    }

    async function handleDocumentStatusChange(documentId: string, status: DocumentStatus) {
        setDocumentAction({ id: documentId, status });

        try {
            const { error } = await updateApplicationDocumentStatus(application.id, documentId, status);

            if (error) {
                setFeedback(`Error: ${error}`);
                return;
            }

            setDocuments((current) =>
                current.map((document) =>
                    document.id === documentId
                        ? { ...document, status }
                        : document
                )
            );
            setFeedback(
                status === "verified"
                    ? "Document marked as verified."
                    : "Document marked as rejected."
            );
            router.refresh();
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Unable to update document review status.";
            setFeedback(`Error: ${message}`);
        } finally {
            setDocumentAction(null);
        }
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
                            <CardTitle>
                                {application.profiles?.first_name} {application.profiles?.last_name}
                            </CardTitle>
                            <ApplicationStatusBadge status={displayedDecision} />
                        </div>
                        <CardDescription>
                            {application.id.slice(0, 8)} · Cohort {application.cohort_year || "N/A"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <div className="grid gap-3 sm:grid-cols-2">
                            <div className="rounded-xl border bg-muted/15 p-4">
                                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">State</p>
                                <p className="mt-2 font-semibold">
                                    {application.profiles?.state || application.profiles?.state_of_origin || "N/A"}
                                </p>
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
                                <p className="font-medium">Document readiness</p>
                            </div>
                            <div className="mt-3 flex flex-wrap gap-3 text-sm">
                                <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
                                    <CheckCircle2 className="h-4 w-4" />
                                    <span>{verifiedDocuments} verified</span>
                                </div>
                                <div className="flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-amber-700">
                                    <Clock className="h-4 w-4" />
                                    <span>{pendingDocuments} under review</span>
                                </div>
                            </div>
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
                            <Button disabled={isSaving} type="button" onClick={() => handleDecision("shortlisted", "Candidate shortlisted for interview planning.")}>
                                {isSaving && requestedDecision === "shortlisted" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Shortlist
                            </Button>
                            <Button disabled={isSaving} type="button" variant="outline" onClick={() => handleDecision("accepted", "Candidate marked approved.")}>
                                {isSaving && requestedDecision === "accepted" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Approve
                            </Button>
                            <Button disabled={isSaving} type="button" variant="destructive" onClick={() => handleDecision("rejected", "Candidate marked rejected.")}>
                                {isSaving && requestedDecision === "rejected" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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

                <div className="space-y-6">
                    <Card className="border-border/60">
                        <CardHeader>
                            <CardTitle>Document Review</CardTitle>
                            <CardDescription>Verify or reject each uploaded applicant document.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {documents.length > 0 ? (
                                documents.map((document) => {
                                    const isReviewingThisDocument = documentAction?.id === document.id;

                                    return (
                                        <div key={document.id} className="rounded-xl border bg-background p-4">
                                            <div className="flex flex-col gap-4">
                                                <div className="flex flex-wrap items-start justify-between gap-3">
                                                    <div className="min-w-0">
                                                        <p className="font-medium">{getDocumentDisplayLabel(document)}</p>
                                                        <p className="mt-1 truncate text-sm text-muted-foreground">{document.name}</p>
                                                        <p className="mt-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                                                            Uploaded {new Date(document.uploadedAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <Badge variant="outline" className={getDocumentStatusClassName(document.status)}>
                                                        <span className="mr-1 inline-flex">{documentStatusIcon[document.status]}</span>
                                                        {documentStatusLabel[document.status]}
                                                    </Badge>
                                                </div>

                                                <div className="flex flex-wrap gap-2">
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="outline"
                                                        disabled={isSaving || Boolean(documentAction)}
                                                        className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
                                                        onClick={() => handleDocumentStatusChange(document.id, "verified")}
                                                    >
                                                        {isReviewingThisDocument && documentAction?.status === "verified" && (
                                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        )}
                                                        Verify
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="outline"
                                                        disabled={isSaving || Boolean(documentAction)}
                                                        className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
                                                        onClick={() => handleDocumentStatusChange(document.id, "rejected")}
                                                    >
                                                        {isReviewingThisDocument && documentAction?.status === "rejected" && (
                                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        )}
                                                        Reject
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="rounded-xl border border-dashed p-6 text-sm text-muted-foreground">
                                    No applicant documents have been uploaded yet.
                                </div>
                            )}
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
        </div>
    );
}
