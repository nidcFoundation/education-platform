// Consolidated Mock Data for the National Talent Development Initiative platform
// All data is illustrative and used for development/demonstration purposes

export * from "./users";
export * from "./programs-focus";
export * from "./application-system";
export * from "./funding-sponsors";
export * from "./impact-reports";
export * from "./scholars-milestones";

// Legacy exports for backward compatibility if needed, or re-mapped versions
import { mockScholars as scholars } from "./scholars-milestones";
import { mockPrograms as programs } from "./programs-focus";
import { mockImpactMetrics as impact } from "./impact-reports";

export const legacyMockScholars = scholars;
export const legacyMockPrograms = programs;
export const legacyMockImpactMetrics = impact;

// Common Helpers or Global Mock Data
export const mockPartners = [
    { id: "1", name: "University of Lagos", type: "Academic Institution", tier: "Founding", location: "Lagos" },
    { id: "2", name: "Ahmadu Bello University", type: "Academic Institution", tier: "Founding", location: "Zaria" },
    { id: "3", name: "University of Ibadan", type: "Academic Institution", tier: "Core", location: "Ibadan" },
    { id: "4", name: "Covenant University", type: "Academic Institution", tier: "Core", location: "Ota" },
    { id: "5", name: "Bayero University Kano", type: "Academic Institution", tier: "Core", location: "Kano" },
    { id: "6", name: "Federal Ministry of Education", type: "Government", tier: "Strategic", location: "Abuja" },
    { id: "7", name: "Central Bank of Nigeria", type: "Government", tier: "Strategic", location: "Abuja" },
    { id: "8", name: "Dangote Group", type: "Private Sector", tier: "Corporate", location: "Lagos" },
    { id: "9", name: "Flutterwave", type: "Private Sector", tier: "Corporate", location: "Lagos" },
    { id: "10", name: "NNPC", type: "Government Enterprise", tier: "Corporate", location: "Abuja" },
];

export const mockNews = [
    {
        id: "1",
        title: "NTDI Launches 2025 Cohort Applications Across All 36 States",
        excerpt: "The National Talent Development Initiative has officially opened applications for the 2025 cohort, with an expanded outreach to ensure full geographic representation.",
        category: "Announcement",
        date: "March 8, 2026",
        readTime: "3 min read",
    },
    {
        id: "2",
        title: "Scholar Success: Aisha Mohammed Joins FinTech Board at 23",
        excerpt: "2024 NTDI scholar Aisha Mohammed has been appointed to the advisory board of a leading Nigerian FinTech company.",
        category: "Scholar Story",
        date: "February 20, 2026",
        readTime: "5 min read",
    },
];

export const mockFAQs = [
    { q: "Who is eligible to apply?", a: "Nigerian citizens aged 16–25 who have achieved minimum 5 A-level credits (or equivalent) and demonstrate exceptional academic potential." },
    { q: "Is the scholarship fully funded?", a: "Yes. The scholarship covers 100% of tuition, accommodation, study materials, and provides a monthly living stipend." },
];
