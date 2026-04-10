import { ImpactMetric, Report } from "@/types";

export const mockImpactMetrics: ImpactMetric[] = [
    {
        id: "m-1",
        label: "Scholars Placed",
        value: 1250,
        unit: "Scholars",
        description: "Total scholars successfully placed in national priority sectors.",
        trend: { value: 12, isPositive: true },
    },
    {
        id: "m-2",
        label: "Graduation Rate",
        value: 98.2,
        unit: "%",
        description: "Cohort graduation success rate across all programs.",
        trend: { value: 2, isPositive: true },
    },
    {
        id: "m-3",
        label: "Funds Deployed",
        value: "₦18.6B",
        description: "Total capital deployed into Nigerian talent infrastructure.",
        trend: { value: 8, isPositive: true },
    },
];

export const mockReports: Report[] = [
    {
        id: "rep-1",
        title: "2024 National Impact Summary",
        type: "impact",
        period: "FY 2024",
        owner: "Miriam Okoro",
        status: "Published",
        url: "/reports/impact-2024.pdf",
        createdAt: "2025-01-15T09:00:00Z",
    },
    {
        id: "rep-2",
        title: "Q1 2026 Academic Performance",
        type: "performance",
        period: "Q1 2026",
        owner: "Dr. Olu Bakare",
        status: "Ready",
        url: "/reports/academic-q1-2026.pdf",
        createdAt: "2026-03-10T14:30:00Z",
    },
];

export const adminImpactReports = [
    {
        title: "2026 Quarterly Performance Pack",
        period: "Q1 2026",
        owner: "Miriam Okoro",
        audience: "Stakeholder Board",
        dueDate: "March 30, 2026",
        status: "In review" as const,
        confidence: "High",
    },
    {
        title: "Sponsor Transparency Report",
        period: "Semi-Annual",
        owner: "Ayo Martins",
        audience: "External Partners",
        dueDate: "April 15, 2026",
        status: "Draft" as const,
        confidence: "Medium",
    },
    {
        title: "National Merit Audit 2025",
        period: "FY 2025",
        owner: "David Uche",
        audience: "Regulators",
        dueDate: "Completed",
        status: "Published" as const,
        confidence: "Verified",
    },
];

export const reportCoverageBreakdown = [
    { label: "Academic", value: 94, color: "#0f766e" },
    { label: "Financial", value: 88, color: "#0284c7" },
    { label: "Placement", value: 82, color: "#d97706" },
    { label: "Social Impact", value: 76, color: "#dc2626" },
];
export const mockImpactDetails = {
    sectorBreakdown: [
        { sector: "Technology & Engineering", count: 420, pct: 33.6 },
        { sector: "Healthcare & Life Sciences", count: 280, pct: 22.4 },
        { sector: "Public Policy & Governance", count: 215, pct: 17.2 },
        { sector: "Financial Infrastructure", count: 185, pct: 14.8 },
        { sector: "Environmental Science", count: 150, pct: 12.0 },
    ],
    fundingBreakdown: [
        { label: "Scholar Tuition & Institutional Fees", pct: 65 },
        { label: "Direct Living Stipends", pct: 20 },
        { label: "Research & Travel Grants", pct: 10 },
        { label: "Mentorship & Leadership Prep", pct: 5 },
    ],
};
