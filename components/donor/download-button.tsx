"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

function getFilenameFromDisposition(contentDisposition: string | null) {
    const match = contentDisposition?.match(/filename="?([^"]+)"?/i);
    return match?.[1] ?? "allocation-summary.txt";
}

export function DownloadButton() {
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadError, setDownloadError] = useState<string | null>(null);

    async function downloadAllocationSummary() {
        setIsDownloading(true);
        setDownloadError(null);

        try {
            const response = await fetch("/api/donor/allocation-summary");

            if (!response.ok) {
                throw new Error("Unable to download the allocation summary right now.");
            }

            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.href = downloadUrl;
            link.download = getFilenameFromDisposition(response.headers.get("content-disposition"));
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            setDownloadError(error instanceof Error ? error.message : "Unable to download the allocation summary right now.");
        } finally {
            setIsDownloading(false);
        }
    }

    return (
        <div className="flex flex-col gap-2">
            <Button onClick={downloadAllocationSummary} disabled={isDownloading} aria-busy={isDownloading}>
                Download Allocation Summary
            </Button>
            {downloadError && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Download failed</AlertTitle>
                    <AlertDescription>{downloadError}</AlertDescription>
                </Alert>
            )}
        </div>
    );
}
