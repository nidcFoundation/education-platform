export interface SponsoredScholar {
    id: string;
    name: string;
    initials: string;
    program: string;
    institution: string;
    cohort: string;
    allocation: string;
    used: string;
    progressScore: number;
    performance: string;
    placementTrack: string;
    impact: string;
}

export interface DonorMessageThread {
    id: string;
    participant: string;
    role: string;
    timestamp: string;
    unreadCount: number;
    lastMessage: string;
    messages: Array<{
        id: string;
        sender: string;
        body: string;
        time: string;
    }>;
}

export interface AnnualReportSummary {
    year: string;
    title: string;
    summary: string;
    highlights: string[];
    fileSize: string;
}

export const donorProfile = {
    organization: "Crescent Impact Fund",
    donorId: "DNR-0042",
    focus: "STEM scholarship access, transition-to-work support, and public-interest innovation.",
    pledgeWindow: "2024 to 2026",
    totalCommitment: "₦18.5M",
    relationshipManager: "Partnerships & Transparency Office",
};

export const donorDashboardMetrics = [
    { title: "Scholars Sponsored", value: "12", description: "Across 3 active cohorts" },
    { title: "Funds Allocated", value: "₦18.5M", description: "Committed to tuition, stipends, and research" },
    { title: "Funds Used", value: "₦14.2M", description: "76.8% of commitment deployed" },
    { title: "Impact Metrics", value: "1,480", description: "Learners and community beneficiaries reached" },
    { title: "Scholar Performance", value: "88%", description: "Portfolio average across sponsored scholars" },
    { title: "Program Outcomes", value: "94%", description: "Graduation and placement success trend" },
];

export const sponsoredScholars: SponsoredScholar[] = [
    {
        id: "s-1",
        name: "Amara Okafor",
        initials: "AO",
        program: "Data Science for Public Systems",
        institution: "University of Lagos",
        cohort: "2024",
        allocation: "₦1.65M",
        used: "₦1.28M",
        progressScore: 89,
        performance: "Excellent",
        placementTrack: "Health-tech analytics",
        impact: "Led 3 data-literacy clinics and produced 2 policy memos.",
    },
    {
        id: "s-2",
        name: "Kehinde Balogun",
        initials: "KB",
        program: "Renewable Energy Systems",
        institution: "University of Ibadan",
        cohort: "2023",
        allocation: "₦1.52M",
        used: "₦1.44M",
        progressScore: 84,
        performance: "Strong",
        placementTrack: "Grid modernisation",
        impact: "Built a low-cost monitoring prototype used in campus labs.",
    },
    {
        id: "s-3",
        name: "Zainab Yusuf",
        initials: "ZY",
        program: "Cybersecurity & Digital Trust",
        institution: "Covenant University",
        cohort: "2025",
        allocation: "₦1.37M",
        used: "₦860,000",
        progressScore: 81,
        performance: "On-track",
        placementTrack: "Public digital infrastructure",
        impact: "Co-led cohort security awareness sessions reaching 260 students.",
    },
    {
        id: "s-4",
        name: "Daniel Eze",
        initials: "DE",
        program: "Advanced Manufacturing",
        institution: "University of Nigeria",
        cohort: "2024",
        allocation: "₦1.58M",
        used: "₦1.12M",
        progressScore: 87,
        performance: "Strong",
        placementTrack: "Industrial automation",
        impact: "Completed an internship productivity model now in pilot use.",
    },
];

export const fundDistribution = [
    { label: "Tuition & fees", value: 46, color: "#16a34a", description: "Direct scholar academic fees", meta: "₦6.5M deployed" },
    { label: "Living stipends", value: 28, color: "#0284c7", description: "Monthly scholar support", meta: "₦4.0M deployed" },
    { label: "Research support", value: 14, color: "#d97706", description: "Fieldwork, tools, and conferences", meta: "₦2.0M deployed" },
    { label: "Mentorship & leadership", value: 12, color: "#7c3aed", description: "Mentor sessions and bootcamps", meta: "₦1.7M deployed" },
];

export const scholarFundingBreakdown = [
    { label: "Scholar tuition coverage", value: 92, color: "#16a34a", description: "Fully funded active scholars", meta: "11 of 12 fully covered this cycle" },
    { label: "Stipend continuity", value: 87, color: "#0284c7", description: "On-time support release rate", meta: "One stipend is pending this month" },
    { label: "Research utilisation", value: 73, color: "#d97706", description: "Use of approved research support", meta: "Focus is fieldwork and datasets" },
    { label: "Leadership support", value: 66, color: "#7c3aed", description: "Participation in development activities", meta: "Leadership sprint scaling this quarter" },
];

export const impactMetrics = [
    { label: "Graduation rate", value: 96.2, description: "Across supported cohorts", unit: "%" },
    { label: "Placement rate", value: 91.4, description: "Within six months of graduation", unit: "%" },
    { label: "Community beneficiaries", value: 1480, description: "Reached by scholar-led projects" },
    { label: "Research outputs", value: 27, description: "Papers, prototypes, and policy briefs" },
];

export const scholarOutcomeBreakdown = [
    { label: "On-track scholars", value: 42, color: "#16a34a", description: "Meeting academic and development targets" },
    { label: "Placement-ready", value: 31, color: "#0284c7", description: "Prepared for internships or deployment" },
    { label: "Research-active", value: 19, color: "#d97706", description: "Submitting papers or prototypes" },
    { label: "Impact leaders", value: 14, color: "#7c3aed", description: "Running measurable community initiatives" },
];

export const sectorPlacementBreakdown = [
    { label: "Technology & software", value: 34, color: "#16a34a", description: "Product, engineering, and analytics teams" },
    { label: "Healthcare systems", value: 22, color: "#0284c7", description: "Hospitals, health-tech, and public health" },
    { label: "Energy & climate", value: 18, color: "#d97706", description: "Power, clean tech, and environmental roles" },
    { label: "Manufacturing", value: 15, color: "#7c3aed", description: "Automation, logistics, and industrial design" },
    { label: "Education & policy", value: 11, color: "#dc2626", description: "Policy labs, schools, and civic organisations" },
];

export const cohortSuccessRates = [
    { cohort: "2022", retention: 98, graduation: 96, placement: 93 },
    { cohort: "2023", retention: 97, graduation: 95, placement: 91 },
    { cohort: "2024", retention: 99, graduation: null, placement: 68 },
    { cohort: "2025", retention: 100, graduation: null, placement: null },
];

export const programGrowth = [
    { label: "2021", value: 42 },
    { label: "2022", value: 68 },
    { label: "2023", value: 96 },
    { label: "2024", value: 124 },
    { label: "2025", value: 152 },
];

export const donorImpactReports = [
    {
        id: "report-q1-2026",
        period: "Q1 2026",
        title: "Funding accelerated placement readiness for senior scholars",
        summary: "Donor funds covered research, stipends, and leadership programming that pushed senior scholars closer to deployment into national-priority sectors.",
        highlights: [
            "12 sponsored scholars maintained active funding status.",
            "5 scholars completed public-interest internships.",
            "3 research grants resulted in working prototypes and policy briefs.",
        ],
    },
    {
        id: "report-q4-2025",
        period: "Q4 2025",
        title: "Cohort stability improved as stipend continuity remained high",
        summary: "Funding continuity protected scholar retention and enabled stronger performance in project-based modules.",
        highlights: [
            "Retention for donor-backed scholars remained above 97%.",
            "Average scholar progress score reached 86%.",
            "Community impact projects reached 620 learners in the quarter.",
        ],
    },
    {
        id: "report-q3-2025",
        period: "Q3 2025",
        title: "Research and mentorship investments improved portfolio quality",
        summary: "Mentor sessions and research support improved the quality of scholar outputs and placement-readiness narratives.",
        highlights: [
            "27 mentor sessions completed.",
            "8 scholars published or submitted applied research pieces.",
            "Placement office added 14 partner opportunities for the donor-backed cohort.",
        ],
    },
];

export const programOutcomeHighlights = [
    {
        title: "Academic excellence",
        summary: "Sponsored scholars consistently outperform the broader cohort in progression and grade stability.",
        metric: "88% performance average",
    },
    {
        title: "Career transition",
        summary: "Funding is directly linked to internships, placement readiness clinics, and interview preparation.",
        metric: "91.4% placement rate",
    },
    {
        title: "Public impact",
        summary: "Scholar service projects translate funding into measurable community outcomes and civic value.",
        metric: "1,480 beneficiaries reached",
    },
];

export const annualReports: AnnualReportSummary[] = [
    {
        year: "2025",
        title: "Annual Transparency Report 2025",
        summary: "A full review of fund deployment, scholar progression, and placement outcomes across all active donor-backed cohorts.",
        highlights: ["₦14.2M deployed", "96.2% graduation rate", "91.4% placement success"],
        fileSize: "12.4 MB PDF",
    },
    {
        year: "2024",
        title: "Annual Transparency Report 2024",
        summary: "Baseline year for the current donor commitment window, establishing funding allocation logic and scholar outcome measures.",
        highlights: ["₦9.8M deployed", "4 new partner sectors", "87% scholar performance average"],
        fileSize: "10.8 MB PDF",
    },
    {
        year: "2023",
        title: "Annual Outcomes Report 2023",
        summary: "Demonstrates how early-stage donor support expanded scholar access and improved transition-to-work structures.",
        highlights: ["68 funded scholars", "3 new programmes", "89% retention rate"],
        fileSize: "9.6 MB PDF",
    },
];

export const donorMessages: DonorMessageThread[] = [
    {
        id: "donor-thread-1",
        participant: "Partnerships & Transparency Office",
        role: "Programme Office",
        timestamp: "11:20 AM",
        unreadCount: 1,
        lastMessage: "The Q1 transparency packet is ready for your review.",
        messages: [
            { id: "dm-1", sender: "Partnerships & Transparency Office", body: "The Q1 transparency packet is ready for your review.", time: "11:20 AM" },
            { id: "dm-2", sender: "Crescent Impact Fund", body: "Please include the latest placement breakdown by sector in the appendix.", time: "11:32 AM" },
        ],
    },
    {
        id: "donor-thread-2",
        participant: "Scholar Success Team",
        role: "Scholar Support",
        timestamp: "Yesterday",
        unreadCount: 0,
        lastMessage: "We have updated the scholar performance summary for your sponsored cohort.",
        messages: [
            { id: "dm-3", sender: "Scholar Success Team", body: "We have updated the scholar performance summary for your sponsored cohort.", time: "Yesterday, 2:18 PM" },
        ],
    },
    {
        id: "donor-thread-3",
        participant: "Finance Operations",
        role: "Finance",
        timestamp: "Monday",
        unreadCount: 0,
        lastMessage: "March disbursement reconciliation has been completed.",
        messages: [
            { id: "dm-4", sender: "Finance Operations", body: "March disbursement reconciliation has been completed.", time: "Monday, 10:04 AM" },
        ],
    },
];

export const donorSettings = {
    contacts: {
        organization: donorProfile.organization,
        email: "partnerships@example.org",
        phone: "+000-000-0000",
        reportingContact: "Ayo Martins",
    },
    notifications: [
        { label: "Quarterly transparency packets", description: "Receive the full funding and impact summary every quarter.", enabled: true },
        { label: "Disbursement alerts", description: "Be notified when major funding releases are completed.", enabled: true },
        { label: "Scholar milestone updates", description: "Receive milestone and placement updates for sponsored scholars.", enabled: true },
        { label: "Annual report publication", description: "Be alerted when annual outcomes and audited reports are available.", enabled: true },
    ],
    visibility: [
        { label: "Show donor profile in annual report acknowledgements", description: "Public-facing acknowledgement in the annual donor list.", enabled: true },
        { label: "Receive named scholar introductions", description: "Allow the programme office to facilitate scholar showcase sessions.", enabled: true },
    ],
};
