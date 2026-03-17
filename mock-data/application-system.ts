import { ApplicationCycle, Review, Interview } from "@/types";

export const mockApplicationCycles: ApplicationCycle[] = [
    {
        id: "cycle-2025",
        year: "2025",
        title: "NTDI 2025 National Talent Intake",
        openDate: "2025-03-01",
        closeDate: "2025-04-30",
        status: "open",
    },
    {
        id: "cycle-2026",
        year: "2026",
        title: "NTDI 2026 Scholarship Window",
        openDate: "2026-03-01",
        closeDate: "2026-04-30",
        status: "upcoming",
    },
];

export const mockInterviews: Interview[] = [
    {
        id: "int-1",
        applicationId: "APP-2026-0142",
        date: "2026-03-22",
        time: "14:00",
        mode: "Panel interview",
        panelMembers: ["David Uche", "Halima Bello", "External Auditor"],
        status: "scheduled",
    },
];

export const mockReviews: Review[] = [
    {
        id: "rev-1",
        applicationId: "APP-2026-0142",
        reviewerId: "usr-2",
        rubricScores: [
            { label: "Academic readiness", score: 18, max: 20 },
            { label: "Leadership and service", score: 16, max: 20 },
            { label: "Mission fit", score: 17, max: 20 },
            { label: "Communication quality", score: 15, max: 20 },
            { label: "Placement potential", score: 18, max: 20 },
        ],
        notes: "Highly qualified candidate with strong national service commitment.",
        decision: "shortlisted",
        submittedAt: "2026-03-15T10:30:00Z",
    },
];
export const featuredApplicationReview = {
    id: "APP-2025-0142",
    applicant: "Amina Yusuf",
    state: "Kano",
    program: "Data Science & AI for Public Systems",
    cohort: "2025",
    track: "National data infrastructure",
    submittedAt: "March 12, 2025",
    currentStatus: "under_review",
    currentReviewer: "Miriam Okoro",
    reviewers: ["Miriam Okoro", "David Uche", "Halima Bello", "Programme Office Lead"],
    interview: {
        date: "2026-03-22",
        time: "14:00",
        mode: "Panel interview",
        panel: "Selection Board A",
    },
    rubric: [
        { label: "Academic readiness", score: 18, max: 20, note: "Strong transcript and quantitative fundamentals." },
        { label: "Leadership and service", score: 16, max: 20, note: "Clear school and community leadership evidence." },
        { label: "Mission fit", score: 17, max: 20, note: "Application aligns closely with public-sector deployment." },
        { label: "Communication quality", score: 15, max: 20, note: "Essays are strong but still need tighter structure." },
        { label: "Placement potential", score: 18, max: 20, note: "High placement confidence with analytics partners." },
    ],
    notes: [
        "Recommend interview focus on resilience, workload planning, and national service commitment.",
        "Quantitative essay response is standout; leadership examples are credible and measurable.",
        "One referee response arrived late but supports the same performance pattern.",
    ],
    documents: [
        { name: "WAEC transcript", status: "Verified", owner: "Document Desk" },
        { name: "Reference letter", status: "Verified", owner: "Programme Office" },
        { name: "Identity document", status: "Verified", owner: "Compliance Team" },
        { name: "Essay packet", status: "Ready for review", owner: "Review Board" },
    ],
};
