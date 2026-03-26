"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ApplicationStepper } from "@/components/forms/application-stepper";
import {
  ArrowLeft,
  ArrowRight,
  Upload,
  CheckCircle2,
  Clock,
  XCircle,
  Trash2,
  FileText,
  Info,
  AlertCircle,
} from "lucide-react";
import { applicationSteps } from "@/constants/application";
import type {
  DocumentStatus,
  DocumentType,
  UploadedDocument,
} from "@/types";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  CldUploadWidget,
  type CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import {
  deleteApplicationDocument,
  saveApplicationDocument,
} from "@/lib/supabase/actions";

interface DocumentUploadFormProps {
  documents: UploadedDocument[];
}

interface RequiredDocument {
  slot: string;
  type: DocumentType;
  label: string;
  description: string;
  required: boolean;
}

type CloudinaryUploadInfo = {
  bytes?: number;
  format?: string;
  original_filename?: string;
  public_id: string;
  resource_type?: string;
  secure_url: string;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const requiredDocuments: RequiredDocument[] = [
  {
    slot: "transcript",
    type: "transcript",
    label: "Academic Transcripts / WAEC Result",
    description: "Certified copy of your final secondary school results.",
    required: true,
  },
  {
    slot: "government_id",
    type: "id",
    label: "Government-Issued ID",
    description:
      "National ID card, International Passport, or Birth Certificate.",
    required: true,
  },
  {
    slot: "reference_letter_academic",
    type: "reference_letter",
    label: "Reference Letter 1 (Academic)",
    description: "Letter from a teacher, lecturer, or school principal.",
    required: true,
  },
  {
    slot: "reference_letter_community",
    type: "reference_letter",
    label: "Reference Letter 2 (Community)",
    description: "Letter from a community or civic leader.",
    required: true,
  },
  {
    slot: "jamb_result",
    type: "jamb_result",
    label: "JAMB / UTME Result",
    description: "Official JAMB slip or result notification.",
    required: true,
  },
  {
    slot: "statement_of_purpose",
    type: "essay",
    label: "Statement of Purpose (Optional)",
    description: "Additional written statement.",
    required: false,
  },
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

function isCloudinaryUploadInfo(value: unknown): value is CloudinaryUploadInfo {
  if (!value || typeof value !== "object") {
    return false;
  }

  const source = value as Record<string, unknown>;
  return (
    typeof source.public_id === "string" &&
    typeof source.secure_url === "string"
  );
}

function getCloudinaryUploadInfo(
  result: CloudinaryUploadWidgetResults
): CloudinaryUploadInfo | null {
  if (!result || typeof result !== "object" || !("info" in result)) {
    return null;
  }

  const info = result.info;
  return isCloudinaryUploadInfo(info) ? info : null;
}

function buildUploadedFileName(
  info: CloudinaryUploadInfo,
  fallbackLabel: string
): string {
  const fallbackBaseName = fallbackLabel
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const baseName =
    typeof info.original_filename === "string" && info.original_filename.trim()
      ? info.original_filename.trim()
      : fallbackBaseName;
  const extension =
    typeof info.format === "string" && info.format.trim()
      ? `.${info.format.trim()}`
      : "";

  if (!extension || baseName.toLowerCase().endsWith(extension.toLowerCase())) {
    return baseName;
  }

  return `${baseName}${extension}`;
}

function getMimeType(info: CloudinaryUploadInfo): string | undefined {
  const format = info.format?.trim().toLowerCase();

  if (!format) {
    return undefined;
  }

  if (format === "pdf") {
    return "application/pdf";
  }

  if (format === "jpg" || format === "jpeg") {
    return "image/jpeg";
  }

  if (format === "png") {
    return "image/png";
  }

  if (info.resource_type === "image") {
    return `image/${format}`;
  }

  return undefined;
}

function getDocumentForRequirement(
  requirement: RequiredDocument,
  documents: UploadedDocument[]
) {
  const matchingSlot = documents.find(
    (document) => document.slot === requirement.slot
  );

  if (matchingSlot) {
    return matchingSlot;
  }

  if (requirement.type === "reference_letter") {
    return undefined;
  }

  return documents.find(
    (document) => !document.slot && document.type === requirement.type
  );
}

export function DocumentUploadForm({ documents }: DocumentUploadFormProps) {
  const router = useRouter();
  const [busyKey, setBusyKey] = useState<string | null>(null);

  const isBusy = busyKey !== null;

  const handleUploadSuccess = async (
    requirement: RequiredDocument,
    result: CloudinaryUploadWidgetResults
  ) => {
    const info = getCloudinaryUploadInfo(result);

    if (!info) {
      toast.error("Upload failed.", {
        description:
          "The file uploaded, but its metadata could not be read. Please try again.",
      });
      return;
    }

    setBusyKey(requirement.slot);
    toast.info("Saving document...");

    try {
      const { error } = await saveApplicationDocument({
        type: requirement.type,
        slot: requirement.slot,
        name: buildUploadedFileName(info, requirement.label),
        size:
          typeof info.bytes === "number" && Number.isFinite(info.bytes)
            ? info.bytes
            : 0,
        url: info.secure_url,
        publicId: info.public_id,
        mimeType: getMimeType(info),
      });

      if (error) {
        toast.error("Upload failed.", {
          description: error,
        });
        return;
      }

      toast.success("Document uploaded successfully.");
      router.refresh();
    } catch {
      toast.error("Upload failed. Please try again.");
    } finally {
      setBusyKey(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (isBusy) return;

    setBusyKey(id);
    toast.info("Deleting document...");

    try {
      const { error } = await deleteApplicationDocument(id);

      if (error) {
        toast.error("Delete failed.", {
          description: error,
        });
        return;
      }

      toast.success("Document deleted successfully.");
      router.refresh();
    } catch {
      toast.error("Delete failed. Please try again.");
    } finally {
      setBusyKey(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <ApplicationStepper steps={[...applicationSteps]} currentStep={4} />

      <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
        <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold mb-0.5">Document Requirements</p>
          <p>
            Accepted formats: PDF, JPG, PNG. Maximum file size: 5MB per
            document.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {requiredDocuments.map((requirement) => {
          const uploaded = getDocumentForRequirement(requirement, documents);
          const isSavingThisRequirement = busyKey === requirement.slot;
          const isDeletingThisRequirement = busyKey === uploaded?.id;

          return (
            <Card
              key={requirement.slot}
              className={`border ${
                uploaded ? "border-emerald-200/60" : "border-border/50"
              }`}
            >
              <CardHeader className="pb-3 border-b">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-sm">
                        {requirement.label}
                      </h3>
                      {requirement.required ? (
                        <Badge
                          variant="destructive"
                          className="text-[9px] h-4 px-1.5"
                        >
                          Required
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="text-[9px] h-4 px-1.5"
                        >
                          Optional
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {requirement.description}
                    </p>
                  </div>
                  {uploaded && (
                    <div className="flex items-center gap-1.5 text-xs font-medium shrink-0">
                      {statusIcon[uploaded.status] || (
                        <Clock className="h-4 w-4" />
                      )}
                      <span
                        className={
                          uploaded.status === "verified"
                            ? "text-emerald-600"
                            : uploaded.status === "pending"
                            ? "text-amber-600"
                            : "text-red-600"
                        }
                      >
                        {statusLabel[uploaded.status] || uploaded.status}
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
                      {uploaded.url ? (
                        <a
                          href={uploaded.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm font-medium truncate block hover:text-primary transition-colors"
                        >
                          {uploaded.name}
                        </a>
                      ) : (
                        <p className="text-sm font-medium truncate">
                          {uploaded.name}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Uploaded on{" "}
                        {new Date(uploaded.uploadedAt).toLocaleDateString()}
                      </p>
                      {uploaded.status === "rejected" && (
                        <p className="text-xs text-red-600 font-medium mt-1 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" /> Document rejected
                          - please re-upload
                        </p>
                      )}
                    </div>
                    <Button
                      onClick={() => handleDelete(uploaded.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                      disabled={isBusy}
                    >
                      {isDeletingThisRequirement ? (
                        "Deleting..."
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                ) : (
                  <CldUploadWidget
                    signatureEndpoint="/api/cloudinary/sign"
                    options={{
                      clientAllowedFormats: ["pdf", "jpg", "jpeg", "png"],
                      maxFileSize: MAX_FILE_SIZE,
                      maxFiles: 1,
                      multiple: false,
                      resourceType: "auto",
                      sources: ["local"],
                    }}
                    onError={() => {
                      toast.error("Upload failed. Please try again.");
                    }}
                    onSuccess={(result) => {
                      void handleUploadSuccess(requirement, result);
                    }}
                  >
                    {({ open }) => (
                      <div
                        onClick={() => {
                          if (isBusy) return;
                          open();
                        }}
                        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors group ${
                          isBusy
                            ? "border-muted-foreground/10 cursor-not-allowed opacity-60"
                            : "border-muted-foreground/20 hover:border-primary/40 cursor-pointer"
                        }`}
                      >
                        <div className="flex flex-col items-center gap-3">
                          <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                            <Upload className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              Select a file to upload
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Upload opens in a secure file picker
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            disabled={isBusy}
                            onClick={(event) => {
                              event.preventDefault();
                              event.stopPropagation();
                              if (isBusy) return;
                              open();
                            }}
                          >
                            {isSavingThisRequirement
                              ? "Saving..."
                              : "Browse Files"}
                          </Button>
                          <p className="text-xs text-muted-foreground/70">
                            PDF, JPG, PNG - Max 5MB
                          </p>
                        </div>
                      </div>
                    )}
                  </CldUploadWidget>
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
              <span>
                {documents.filter((document) => document.status === "verified")
                  .length}{" "}
                Verified
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-500" />
              <span>
                {documents.filter((document) => document.status === "pending")
                  .length}{" "}
                Under Review
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardFooter className="flex justify-between p-5">
          <Link href="/application/step-3">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
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
