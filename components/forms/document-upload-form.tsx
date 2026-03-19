"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ApplicationStepper } from "@/components/forms/application-stepper";
import {
    ArrowLeft, ArrowRight, Upload, CheckCircle2, Clock, XCircle, Trash2, FileText, Info, AlertCircle
} from "lucide-react";
import { applicationSteps } from "@/lib/constants/application";
import type { DocumentStatus, DocumentType } from "@/types";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface DocumentUploadFormProps {
    documents: any[];
}

const requiredDocuments: { type: DocumentType; label: string; description: string; required: boolean }[] = [
    { type: "transcript", label: "Academic Transcripts / WAEC Result", description: "Certified copy of your final secondary school results.", required: true },
    { type: "id", label: "Government-Issued ID", description: "National ID card, International Passport, or Birth Certificate.", required: true },
    { type: "reference_letter", label: "Reference Letter 1 (Academic)", description: "Letter from a teacher, lecturer, or school principal.", required: true },
    { type: "reference_letter", label: "Reference Letter 2 (Community)", description: "Letter from a community or civic leader.", required: true },
    { type: "jamb_result", label: "JAMB / UTME Result", description: "Official JAMB slip or result notification.", required: true },
    { type: "essay", label: "Statement of Purpose (Optional)", description: "Additional written statement.", required: false },
];

const statusIcon: Record<DocumentStatus, React.ReactNode> = {
    verified: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
    pending: <Clock className="h-4 w-4 text-amber-500" />,
    rejected: <XCircle className="h-4 w-4 text-red-500" />,
    expiring: <AlertCircle className="h-4 w-4 text-red-500" />,
};

const statusLabel: Record<DocumentStatus, string> = {
    verified: "Verified",
    pending: "Under Review",
    rejected: "Rejected",
    expiring: "Expiring Soon",
};

export function DocumentUploadForm({ documents }: DocumentUploadFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleUpload = async (type: string) => {
        toast.info(`Uploading ${type}...`);
        // TODO: Implement actual upload logic
    };

    const handleDelete = async (id: string) => {
        toast.info("Deleting document...");
        // TODO: Implement deletion logic
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <ApplicationStepper steps={[...applicationSteps]} currentStep={4} />

            <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                    <p className="font-semibold mb-0.5">Document Requirements</p>
                    <p>Accepted formats: PDF, JPG, PNG. Maximum file size: 5MB per document.</p>
                </div>
            </div>

            <div className="space-y-4">
                {requiredDocuments.map((doc, i) => {
                    const uploaded = documents.find(d => d.type === doc.type);
                    return (
                        <Card key={i} className={`border ${uploaded ? "border-emerald-200/60" : "border-border/50"}`}>
                            <CardHeader className="pb-3 border-b">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-semibold text-sm">{doc.label}</h3>
                                            {doc.required ? (
                                                <Badge variant="destructive" className="text-[9px] h-4 px-1.5">Required</Badge>
                                            ) : (
                                                <Badge variant="secondary" className="text-[9px] h-4 px-1.5">Optional</Badge>
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground">{doc.description}</p>
                                    </div>
                                    {uploaded && (
                                        <div className="flex items-center gap-1.5 text-xs font-medium shrink-0">
                                            {statusIcon[uploaded.status as DocumentStatus] || <Clock className="h-4 w-4" />}
                                            <span className={
                                                uploaded.status === "verified" ? "text-emerald-600" :
                                                    uploaded.status === "pending" ? "text-amber-600" :
                                                        "text-red-600"
                                            }>
                                                {statusLabel[uploaded.status as DocumentStatus] || uploaded.status}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </CardHeader>

                            <CardContent className="p-4">
                                {uploaded ? (
                                    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border">
                                        <FileText className="h-8 w-8 text-primary/60 shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{uploaded.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                Uploaded on {new Date(uploaded.updated_at || uploaded.updated_on).toLocaleDateString()}
                                            </p>
                                            {uploaded.status === "rejected" && (
                                                <p className="text-xs text-red-600 font-medium mt-1 flex items-center gap-1">
                                                    <AlertCircle className="h-3 w-3" /> Document rejected — please re-upload
                                                </p>
                                            )}
                                        </div>
                                        <button onClick={() => handleDelete(uploaded.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div
                                        onClick={() => handleUpload(doc.type)}
                                        className="border-2 border-dashed border-muted-foreground/20 hover:border-primary/40 rounded-xl p-8 text-center transition-colors cursor-pointer group"
                                    >
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                                <Upload className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">Drag & drop your file here</p>
                                                <p className="text-xs text-muted-foreground mt-0.5">or</p>
                                            </div>
                                            <Button variant="outline" size="sm" className="text-xs">Browse Files</Button>
                                            <p className="text-xs text-muted-foreground/70">PDF, JPG, PNG — Max 5MB</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <Card className="border-border/50 bg-muted/20">
                <CardContent className="p-5">
                    <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            <span>{documents.filter(d => d.status === "verified").length} Verified</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-amber-500" />
                            <span>{documents.filter(d => d.status === "pending").length} Under Review</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-border/50">
                <CardFooter className="flex justify-between p-5">
                    <Link href="/application/step-3">
                        <Button variant="outline" className="gap-2"><ArrowLeft className="h-4 w-4" /> Back</Button>
                    </Link>
                    <Link href="/application/step-5">
                        <Button className="gap-2 font-semibold">
                            Continue <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
