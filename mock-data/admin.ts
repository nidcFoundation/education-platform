import type { ApplicationStatus } from "@/types";

export interface AdminDashboardMetric {
    title: string;
    value: string;
    description: string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
}

export interface AdminSectionLink {
    href: string;
    title: string;
    description: string;
    meta: string;
}

export interface AdminApplication {
    id: string;
    applicant: string;
    state: string;
    program: string;
    cohort: string;
    status: ApplicationStatus;
    reviewer: string;
    interviewWindow: string;
    score: number | null;
    notesCount: number;
    priority: "High" | "Medium" | "Low";
    submittedAt: string;
}

export interface ReviewerWorkload {
    name: string;
    queue: number;
    specialty: string;
    sla: string;
}

export interface AdminScholar {
    id: string;
    name: string;
    cohort: string;
    program: string;
    mentor: string;
    progress: number;
    milestones: string;
    placement: string;
    fundingUtilisation: number;
    status: "active" | "graduated" | "suspended";
    nextMilestone: string;
}

export interface AdminProgram {
    id: string;
    name: string;
    lead: string;
    campuses: string;
    activeScholars: number;
    applicants: number;
    completionRate: number;
    placementRate: number;
    budget: string;
    status: "active" | "upcoming";
}

export interface AdminCohort {
    year: string;
    phase: string;
    applicants: number;
    activeScholars: number;
    reviewCompletion: number;
    fundingReleased: string;
    readiness: string;
}

export interface FundingLedgerEntry {
    programme: string;
    sponsor: string;
    amount: string;
    status: "Committed" | "Disbursed" | "Flagged";
    window: string;
}

export interface SponsorAccount {
    name: string;
    category: string;
    commitment: string;
    focus: string;
    reportingCadence: string;
    renewalWindow: string;
    status: "Active" | "Renewal due" | "At risk";
}

export interface ImpactReportRecord {
    title: string;
    period: string;
    owner: string;
    audience: string;
    dueDate: string;
    status: "Draft" | "In review" | "Ready" | "Published";
    confidence: string;
}

export interface ContentRecord {
    title: string;
    type: string;
    audience: string;
    owner: string;
    updatedAt: string;
    status: "Draft" | "In review" | "Scheduled" | "Live";
}

export interface UserAccountRecord {
    name: string;
    role: string;
    team: string;
    access: string;
    lastActive: string;
    status: "Active" | "Pending" | "Suspended";
}

export interface SettingToggle {
    id: string;
    label: string;
    description: string;
    enabled: boolean;
}

export const adminDashboardMetrics: AdminDashboardMetric[] = [
    {
        title: "Total Applicants",
        value: "1,482",
        description: "Across open and archived cycles",
        trend: { value: 18, isPositive: true },
    },
    {
        title: "Pending Reviews",
        value: "346",
        description: "Need reviewer action this week",
        trend: { value: 9, isPositive: false },
    },
    {
        title: "Active Scholars",
        value: "864",
        description: "Across 4 live cohorts",
        trend: { value: 6, isPositive: true },
    },
    {
        title: "Cohort Distribution",
        value: "4 cohorts",
        description: "2023 to 2026 intake windows",
    },
    {
        title: "Funding Totals",
        value: "N4.26B",
        description: "Committed across programmes and sponsors",
        trend: { value: 12, isPositive: true },
    },
    {
        title: "Program Performance",
        value: "92%",
        description: "Completion and placement composite",
        trend: { value: 4, isPositive: true },
    },
];

export const adminSectionLinks: AdminSectionLink[] = [
    {
        href: "/admin/applications",
        title: "Applications Management",
        description: "Route applications through screening, scoring, interviews, and final decisions.",
        meta: "346 pending reviews",
    },
    {
        href: "/admin/scholars",
        title: "Scholar Management",
        description: "Track scholar progress, milestones, placements, and funding utilisation from one queue.",
        meta: "864 active scholars",
    },
    {
        href: "/admin/programs",
        title: "Programs Management",
        description: "Balance intake, performance, capacity, and budget across every programme track.",
        meta: "4 programmes live or launching",
    },
    {
        href: "/admin/cohorts",
        title: "Cohorts Management",
        description: "Monitor readiness and review completion for each cohort window.",
        meta: "2026 selection in progress",
    },
    {
        href: "/admin/funding",
        title: "Funding Management",
        description: "Oversee allocations, disbursements, watchlists, and sponsor coverage.",
        meta: "N4.26B tracked",
    },
    {
        href: "/admin/users",
        title: "User Management",
        description: "Control platform roles, permissions, and operational access.",
        meta: "214 staff and partners",
    },
];

export const adminOperationalPulse = [
    { label: "Review SLA", value: "68h", detail: "Average time from submission to reviewer assignment" },
    { label: "Interview slots", value: "74", detail: "Confirmed across the next 10 days" },
    { label: "Placement watchlist", value: "19 scholars", detail: "Require partner follow-up this month" },
];

export const adminCohortDistribution = [
    { label: "2023", value: 118, color: "#0f766e", description: "Graduating and close-out scholars", meta: "Retention 96%" },
    { label: "2024", value: 236, color: "#0284c7", description: "Core in-programme scholars", meta: "Placement readiness 78%" },
    { label: "2025", value: 284, color: "#d97706", description: "Academic progression focus", meta: "Milestone completion 83%" },
    { label: "2026", value: 226, color: "#dc2626", description: "Selection and onboarding pipeline", meta: "Review completion 71%" },
];

export const adminProgramPerformance = [
    { label: "Technology & Software", value: 94, color: "#0f766e", description: "Highest combined completion and placement score", meta: "412 active scholars" },
    { label: "Healthcare Delivery", value: 91, color: "#0284c7", description: "Strong partner conversion into placements", meta: "238 active scholars" },
    { label: "Energy & Agriculture", value: 89, color: "#d97706", description: "Steady outcomes with regional expansion", meta: "144 active scholars" },
    { label: "Advanced Manufacturing", value: 84, color: "#dc2626", description: "Launch-stage programme building demand", meta: "Q3 2026 intake prep" },
];

export const applicationPipeline = [
    { label: "Eligibility screened", value: 82, color: "#0f766e", description: "Documents and baseline criteria completed", meta: "1,214 applications" },
    { label: "Reviewer assigned", value: 76, color: "#0284c7", description: "Allocated into reviewer queues", meta: "1,126 applications" },
    { label: "Interview scheduled", value: 41, color: "#d97706", description: "Moved into panel coordination", meta: "608 applications" },
    { label: "Decision issued", value: 28, color: "#dc2626", description: "Final approval or rejection sent", meta: "414 applications" },
];

export const adminApplications: AdminApplication[] = [
    {
        id: "NTDI-2026-0142",
        applicant: "Amina Yusuf",
        state: "Kano",
        program: "Data Science & AI for Public Systems",
        cohort: "2026",
        status: "under_review",
        reviewer: "Miriam Okoro",
        interviewWindow: "March 22, 2026",
        score: 84,
        notesCount: 3,
        priority: "High",
        submittedAt: "March 12, 2026",
    },
    {
        id: "NTDI-2026-0131",
        applicant: "Tobi Adegoke",
        state: "Oyo",
        program: "Renewable Energy Systems",
        cohort: "2026",
        status: "shortlisted",
        reviewer: "David Uche",
        interviewWindow: "March 20, 2026",
        score: 88,
        notesCount: 5,
        priority: "High",
        submittedAt: "March 10, 2026",
    },
    {
        id: "NTDI-2026-0124",
        applicant: "Chisom Eze",
        state: "Enugu",
        program: "Health Informatics & Delivery",
        cohort: "2026",
        status: "interview_stage",
        reviewer: "Halima Bello",
        interviewWindow: "March 19, 2026",
        score: 90,
        notesCount: 4,
        priority: "Medium",
        submittedAt: "March 9, 2026",
    },
    {
        id: "NTDI-2026-0118",
        applicant: "Ibrahim Sani",
        state: "Kaduna",
        program: "Advanced Manufacturing",
        cohort: "2026",
        status: "submitted",
        reviewer: "Unassigned",
        interviewWindow: "Awaiting review",
        score: null,
        notesCount: 1,
        priority: "Medium",
        submittedAt: "March 8, 2026",
    },
    {
        id: "NTDI-2026-0107",
        applicant: "Ese Oghene",
        state: "Delta",
        program: "Technology & Software Engineering",
        cohort: "2026",
        status: "accepted",
        reviewer: "Programme Office",
        interviewWindow: "Completed",
        score: 93,
        notesCount: 6,
        priority: "Low",
        submittedAt: "March 5, 2026",
    },
    {
        id: "NTDI-2026-0102",
        applicant: "Fatima Haruna",
        state: "Borno",
        program: "Healthcare Delivery Systems",
        cohort: "2026",
        status: "rejected",
        reviewer: "Miriam Okoro",
        interviewWindow: "Completed",
        score: 61,
        notesCount: 2,
        priority: "Low",
        submittedAt: "March 2, 2026",
    },
];

export const reviewerWorkloads: ReviewerWorkload[] = [
    {
        name: "Miriam Okoro",
        queue: 42,
        specialty: "Essays, northern states, and public-interest tracks",
        sla: "64h average",
    },
    {
        name: "David Uche",
        queue: 37,
        specialty: "Technology and advanced manufacturing applications",
        sla: "59h average",
    },
    {
        name: "Halima Bello",
        queue: 35,
        specialty: "Healthcare and data-led programme tracks",
        sla: "71h average",
    },
];

export const featuredApplicationReview = {
    id: "NTDI-2026-0142",
    applicant: "Amina Yusuf",
    state: "Kano",
    program: "Data Science & AI for Public Systems",
    cohort: "2026",
    track: "National data infrastructure",
    submittedAt: "March 12, 2026",
    currentStatus: "under_review" as ApplicationStatus,
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

export const scholarManagementFocus = [
    {
        title: "Track progress",
        description: "Identify scholars slipping on academic or delivery outcomes before the next review cycle.",
        metric: "91% on-track",
    },
    {
        title: "Update milestones",
        description: "Flag milestone owners, due dates, and evidence gaps across active cohorts.",
        metric: "143 milestones due",
    },
    {
        title: "Manage placements",
        description: "Watch interview conversion, partner demand, and deployment readiness.",
        metric: "78 placements open",
    },
    {
        title: "Monitor funding",
        description: "Surface stipend, tuition, and research spend anomalies early.",
        metric: "19 watchlist accounts",
    },
];

export const scholarHealthBreakdown = [
    { label: "On-track scholars", value: 71, color: "#0f766e", description: "Meeting academic and milestone targets", meta: "614 scholars" },
    { label: "Needs intervention", value: 16, color: "#d97706", description: "Need mentor or funding follow-up", meta: "138 scholars" },
    { label: "Placement ready", value: 9, color: "#0284c7", description: "Ready for employer matching this cycle", meta: "78 scholars" },
    { label: "Funding watchlist", value: 4, color: "#dc2626", description: "Escalated for delayed support or overspend", meta: "34 scholars" },
];

export const adminScholars: AdminScholar[] = [
    {
        id: "SCH-24-017",
        name: "Amara Okafor",
        cohort: "2024",
        program: "Data Science for Public Systems",
        mentor: "Dr. Tade Akinyemi",
        progress: 89,
        milestones: "8 / 11",
        placement: "Partner matching",
        fundingUtilisation: 76,
        status: "active",
        nextMilestone: "Placement interview prep",
    },
    {
        id: "SCH-23-041",
        name: "Kehinde Balogun",
        cohort: "2023",
        program: "Renewable Energy Systems",
        mentor: "Engr. Chinwe Ibekwe",
        progress: 92,
        milestones: "10 / 10",
        placement: "Offer accepted",
        fundingUtilisation: 94,
        status: "graduated",
        nextMilestone: "Deployment onboarding",
    },
    {
        id: "SCH-25-006",
        name: "Zainab Yusuf",
        cohort: "2025",
        program: "Cybersecurity & Digital Trust",
        mentor: "Ayo Martins",
        progress: 81,
        milestones: "6 / 9",
        placement: "Readiness clinic",
        fundingUtilisation: 63,
        status: "active",
        nextMilestone: "Internship shortlist",
    },
    {
        id: "SCH-24-021",
        name: "Daniel Eze",
        cohort: "2024",
        program: "Advanced Manufacturing",
        mentor: "Ngozi Opara",
        progress: 85,
        milestones: "7 / 10",
        placement: "Partner review",
        fundingUtilisation: 71,
        status: "active",
        nextMilestone: "Capstone prototype demo",
    },
    {
        id: "SCH-25-014",
        name: "Mariam Sulaiman",
        cohort: "2025",
        program: "Healthcare Delivery Systems",
        mentor: "Dr. Temitope Adedeji",
        progress: 74,
        milestones: "4 / 8",
        placement: "Needs intervention",
        fundingUtilisation: 58,
        status: "suspended",
        nextMilestone: "Funding resolution meeting",
    },
];

export const adminPrograms: AdminProgram[] = [
    {
        id: "program-tech",
        name: "Technology & Software Engineering",
        lead: "Programme Office West",
        campuses: "Lagos, Abuja",
        activeScholars: 412,
        applicants: 682,
        completionRate: 95,
        placementRate: 93,
        budget: "N1.42B",
        status: "active",
    },
    {
        id: "program-health",
        name: "Healthcare Delivery Systems",
        lead: "Programme Office Central",
        campuses: "Abuja, Ibadan, Enugu",
        activeScholars: 238,
        applicants: 364,
        completionRate: 92,
        placementRate: 90,
        budget: "N1.18B",
        status: "active",
    },
    {
        id: "program-energy",
        name: "Sustainable Energy & Agriculture",
        lead: "Programme Office North",
        campuses: "Kaduna, Kano, Port Harcourt",
        activeScholars: 144,
        applicants: 251,
        completionRate: 90,
        placementRate: 88,
        budget: "N860M",
        status: "active",
    },
    {
        id: "program-manufacturing",
        name: "Advanced Manufacturing & Engineering",
        lead: "Programme Launch Team",
        campuses: "Port Harcourt, Kano",
        activeScholars: 70,
        applicants: 185,
        completionRate: 84,
        placementRate: 83,
        budget: "N800M",
        status: "upcoming",
    },
];

export const adminCohorts: AdminCohort[] = [
    {
        year: "2023",
        phase: "Close-out and deployment",
        applicants: 318,
        activeScholars: 118,
        reviewCompletion: 100,
        fundingReleased: "N620M",
        readiness: "Final placement wrap-up",
    },
    {
        year: "2024",
        phase: "In-programme",
        applicants: 512,
        activeScholars: 236,
        reviewCompletion: 94,
        fundingReleased: "N1.08B",
        readiness: "Milestone review in April",
    },
    {
        year: "2025",
        phase: "Academic progression",
        applicants: 446,
        activeScholars: 284,
        reviewCompletion: 86,
        fundingReleased: "N1.14B",
        readiness: "Placement preparation launch",
    },
    {
        year: "2026",
        phase: "Selection and onboarding",
        applicants: 1_482,
        activeScholars: 226,
        reviewCompletion: 71,
        fundingReleased: "N1.42B earmarked",
        readiness: "Interviews and final shortlist",
    },
];

export const adminFundingTotals = {
    committed: "N4.26B",
    disbursed: "N3.18B",
    reserved: "N640M",
    flagged: "N112M",
};

export const adminFundingDistribution = [
    { label: "Scholarship awards", value: 58, color: "#0f766e", description: "Tuition and direct scholar support", meta: "N2.47B" },
    { label: "Living stipends", value: 18, color: "#0284c7", description: "Monthly support and emergency buffers", meta: "N770M" },
    { label: "Research and labs", value: 12, color: "#d97706", description: "Research grants, fieldwork, and equipment", meta: "N511M" },
    { label: "Placement and leadership", value: 7, color: "#dc2626", description: "Bootcamps, clinics, and deployment support", meta: "N298M" },
    { label: "Programme operations", value: 5, color: "#475569", description: "Oversight, compliance, and reporting", meta: "N213M" },
];

export const adminFundingLedger: FundingLedgerEntry[] = [
    {
        programme: "Technology & Software Engineering",
        sponsor: "Crescent Impact Fund",
        amount: "N420M",
        status: "Disbursed",
        window: "Q1 2026",
    },
    {
        programme: "Healthcare Delivery Systems",
        sponsor: "Apex Health Foundation",
        amount: "N360M",
        status: "Committed",
        window: "Q2 2026",
    },
    {
        programme: "Sustainable Energy & Agriculture",
        sponsor: "Green Future Trust",
        amount: "N228M",
        status: "Disbursed",
        window: "Q1 2026",
    },
    {
        programme: "Advanced Manufacturing",
        sponsor: "National Industrial Growth Fund",
        amount: "N112M",
        status: "Flagged",
        window: "Q2 2026",
    },
];

export const adminSponsors: SponsorAccount[] = [
    {
        name: "Crescent Impact Fund",
        category: "Private foundation",
        commitment: "N500M",
        focus: "STEM scholarships and placement support",
        reportingCadence: "Quarterly",
        renewalWindow: "September 2026",
        status: "Active",
    },
    {
        name: "Apex Health Foundation",
        category: "Sector foundation",
        commitment: "N420M",
        focus: "Healthcare delivery and biomedical tracks",
        reportingCadence: "Monthly",
        renewalWindow: "July 2026",
        status: "Renewal due",
    },
    {
        name: "Green Future Trust",
        category: "Climate and energy funder",
        commitment: "N310M",
        focus: "Energy, agriculture, and climate resilience",
        reportingCadence: "Quarterly",
        renewalWindow: "December 2026",
        status: "Active",
    },
    {
        name: "National Industrial Growth Fund",
        category: "Public-private fund",
        commitment: "N180M",
        focus: "Manufacturing launch and equipment",
        reportingCadence: "Monthly",
        renewalWindow: "May 2026",
        status: "At risk",
    },
];

export const sponsorFocusMix = [
    { label: "Scholarship access", value: 46, color: "#0f766e", description: "Direct tuition and academic support", meta: "4 major sponsors" },
    { label: "Placement transition", value: 24, color: "#0284c7", description: "Career readiness and employer matching", meta: "3 sponsor-funded pipelines" },
    { label: "Research and innovation", value: 18, color: "#d97706", description: "Labs, grants, and applied research", meta: "2 active funds" },
    { label: "Regional expansion", value: 12, color: "#dc2626", description: "New campuses and state representation", meta: "2026 intake focus" },
];

export const adminImpactReports: ImpactReportRecord[] = [
    {
        title: "Q1 programme operations report",
        period: "Q1 2026",
        owner: "Insights and Reporting",
        audience: "Board and executive leadership",
        dueDate: "March 28, 2026",
        status: "In review",
        confidence: "93% data confidence",
    },
    {
        title: "Sponsor placement outcomes packet",
        period: "March 2026",
        owner: "Donor Partnerships",
        audience: "Priority sponsors",
        dueDate: "March 24, 2026",
        status: "Ready",
        confidence: "88% data confidence",
    },
    {
        title: "2025 annual impact report",
        period: "Annual 2025",
        owner: "Strategy and Communications",
        audience: "Public release",
        dueDate: "April 12, 2026",
        status: "Draft",
        confidence: "81% data confidence",
    },
    {
        title: "Cohort 2023 close-out brief",
        period: "Close-out",
        owner: "Scholar Success",
        audience: "Programme directors",
        dueDate: "March 19, 2026",
        status: "Published",
        confidence: "97% data confidence",
    },
];

export const reportCoverageBreakdown = [
    { label: "Board reporting", value: 95, color: "#0f766e", description: "Executive and board packs on schedule", meta: "3 active workstreams" },
    { label: "Sponsor reporting", value: 87, color: "#0284c7", description: "Sponsor packets with funding and outcomes data", meta: "8 packets due this cycle" },
    { label: "Public reporting", value: 78, color: "#d97706", description: "Annual and campaign publication pipeline", meta: "Annual report in production" },
];

export const adminContentItems: ContentRecord[] = [
    {
        title: "2026 applications campaign landing page",
        type: "Campaign page",
        audience: "Applicants",
        owner: "Communications Team",
        updatedAt: "March 16, 2026",
        status: "Live",
    },
    {
        title: "Sponsor stewardship newsletter",
        type: "Email bulletin",
        audience: "Sponsors",
        owner: "Donor Partnerships",
        updatedAt: "March 15, 2026",
        status: "Scheduled",
    },
    {
        title: "Scholar placement success story batch",
        type: "Editorial series",
        audience: "Public",
        owner: "Content Studio",
        updatedAt: "March 14, 2026",
        status: "In review",
    },
    {
        title: "Programme FAQ refresh",
        type: "Knowledge base",
        audience: "Applicants and scholars",
        owner: "Product Education",
        updatedAt: "March 12, 2026",
        status: "Draft",
    },
];

export const contentStatusBreakdown = [
    { label: "Live content", value: 52, color: "#0f766e", description: "Public and portal content currently published", meta: "134 assets" },
    { label: "Awaiting approval", value: 21, color: "#d97706", description: "Needs legal, programme, or brand sign-off", meta: "54 assets" },
    { label: "Scheduled", value: 17, color: "#0284c7", description: "Timed for campaign or report publication", meta: "44 assets" },
    { label: "Draft", value: 10, color: "#475569", description: "In editorial or production development", meta: "26 assets" },
];

export const adminUsers: UserAccountRecord[] = [
    {
        name: "Adaeze Nwosu",
        role: "Super admin",
        team: "Platform Operations",
        access: "Full platform",
        lastActive: "Today, 10:42 AM",
        status: "Active",
    },
    {
        name: "Miriam Okoro",
        role: "Reviewer",
        team: "Applications",
        access: "Applications and interviews",
        lastActive: "Today, 9:15 AM",
        status: "Active",
    },
    {
        name: "Ayo Martins",
        role: "Scholar success lead",
        team: "Scholar Operations",
        access: "Scholars, placements, funding",
        lastActive: "Yesterday, 4:50 PM",
        status: "Active",
    },
    {
        name: "Tosin Adeola",
        role: "Content editor",
        team: "Communications",
        access: "Content and reports",
        lastActive: "Yesterday, 2:08 PM",
        status: "Pending",
    },
    {
        name: "Haruna Bello",
        role: "Sponsor manager",
        team: "Donor Partnerships",
        access: "Sponsors and reporting",
        lastActive: "Monday, 11:32 AM",
        status: "Suspended",
    },
];

export const userRoleBreakdown = [
    { label: "Reviewers", value: 34, color: "#0f766e", description: "Application and interview staff", meta: "Peak-cycle enabled" },
    { label: "Scholar operations", value: 18, color: "#0284c7", description: "Scholar success, placement, and funding teams", meta: "Across 3 regions" },
    { label: "Content and reporting", value: 12, color: "#d97706", description: "Editorial, communications, and insights users", meta: "Shared publishing workflows" },
    { label: "Platform admins", value: 6, color: "#dc2626", description: "Highest-privilege operational users", meta: "MFA enforced" },
];

export const adminSystemSettings = {
    automation: [
        {
            id: "auto-review-routing",
            label: "Automatic reviewer routing",
            description: "Distribute new applications by workload, programme specialty, and state coverage.",
            enabled: true,
        },
        {
            id: "auto-interview-reminders",
            label: "Interview reminder notifications",
            description: "Send calendar and briefing reminders to candidates and panels 24 hours before interviews.",
            enabled: true,
        },
        {
            id: "auto-funding-watchlist",
            label: "Funding anomaly watchlist",
            description: "Flag unusual tuition, stipend, or research utilisation changes for admin review.",
            enabled: true,
        },
    ] satisfies SettingToggle[],
    access: [
        {
            id: "enforce-mfa",
            label: "Enforce MFA for privileged users",
            description: "Require multi-factor authentication for admins, reviewers, and sponsor managers.",
            enabled: true,
        },
        {
            id: "restrict-export",
            label: "Restrict full-data exports",
            description: "Only super admins can export full applicant and scholar datasets.",
            enabled: true,
        },
        {
            id: "session-lock",
            label: "Short session lock window",
            description: "Lock inactive admin sessions after 20 minutes.",
            enabled: false,
        },
    ] satisfies SettingToggle[],
    communications: [
        {
            id: "weekly-digest",
            label: "Weekly ops digest",
            description: "Send platform summary emails to programme leads every Monday morning.",
            enabled: true,
        },
        {
            id: "sponsor-alerts",
            label: "Sponsor SLA alerts",
            description: "Alert donor partnerships when sponsor reports are approaching deadline.",
            enabled: true,
        },
        {
            id: "content-approval-alerts",
            label: "Content approval alerts",
            description: "Notify editors and approvers when new content enters review.",
            enabled: false,
        },
    ] satisfies SettingToggle[],
    operations: {
        reportingWindow: "Quarterly",
        reviewSla: "72 hours",
        escalationWindow: "24 hours",
        supportEmail: "admin@ntdi.gov.ng",
    },
};
