import { cn } from "@/lib/utils";

export type BadgeStatus =
    | "active"
    | "inactive"
    | "pending"
    | "approved"
    | "rejected"
    | "completed"
    | "upcoming"
    | "closed"
    | "graduated"
    | "suspended"
    | "scheduled"
    | "processing";

interface StatusBadgeProps {
    status: BadgeStatus;
    className?: string;
}

const statusConfig: Record<BadgeStatus, { label: string; className: string }> = {
    active: { label: "Active", className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" },
    inactive: { label: "Inactive", className: "bg-slate-100 text-slate-800 dark:bg-slate-900/50 dark:text-slate-400" },
    pending: { label: "Pending Review", className: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400" },
    approved: { label: "Approved", className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" },
    rejected: { label: "Rejected", className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" },
    completed: { label: "Completed", className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" },
    upcoming: { label: "Upcoming", className: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400" },
    closed: { label: "Closed", className: "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400" },
    graduated: { label: "Graduated", className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" },
    suspended: { label: "Suspended", className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" },
    scheduled: { label: "Scheduled", className: "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-400" },
    processing: { label: "Processing", className: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400" },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
    const config = statusConfig[status];

    if (!config) return null;

    return (
        <span
            className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                config.className,
                className
            )}
        >
            {config.label}
        </span>
    );
}
