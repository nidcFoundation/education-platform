import { Scholar, Milestone, Placement, UploadedDocument } from "@/types";

export const mockCohorts = [
    {
        id: "c-2024",
        year: "2024",
        phase: "Active Placement",
        applicantsCount: 1482,
        activeScholarsCount: 864,
        reviewCompletion: 100,
        fundingReleased: "₦1.8B",
        readiness: "Ready",
    },
    {
        id: "c-2025",
        year: "2025",
        phase: "Selection Stage",
        applicantsCount: 1840,
        activeScholarsCount: 0,
        reviewCompletion: 42,
        fundingReleased: "₦0.0B",
        readiness: "In Progress",
    },
];

export const mockScholars: Scholar[] = [
    {
        id: "sch-1",
        applicantId: "usr-5",
        cohortId: "c-2024",
        programId: "prog-tech",
        institution: "University of Lagos",
        status: "active",
        progressScore: 84,
        mentorId: "usr-2",
        placementId: "pl-1",
        fundingUtilisation: 76,
        level: "Year 3",
    },
];

export const mockMilestones: Milestone[] = [
    {
        id: "m-1",
        scholarId: "sch-1",
        title: "Complete advanced analytics core modules",
        category: "course completion",
        status: "completed",
        dueDate: "2026-02-14",
    },
    {
        id: "m-2",
        scholarId: "sch-1",
        title: "Finish NITDA policy analytics internship",
        category: "internships",
        status: "active",
        dueDate: "2026-05-30",
    },
];

export const mockPlacements: Placement[] = [
    {
        id: "pl-1",
        scholarId: "sch-1",
        organizationName: "NITDA Innovation Lab",
        role: "Data Policy Intern",
        status: "active",
        location: "Abuja",
        startDate: "2026-02-01",
    },
];

export const mockScholarDocuments: UploadedDocument[] = [
    {
        id: "doc-1",
        type: "transcript",
        name: "Semester 5 Transcript.pdf",
        size: 1024 * 1024 * 1.2,
        uploadedAt: "2026-02-15",
        status: "verified",
    },
    {
        id: "doc-2",
        type: "id",
        name: "National ID Card.jpg",
        size: 1024 * 512,
        uploadedAt: "2025-01-10",
        status: "expiring",
    },
];
