export const adminSectionLinks = [
    {
        href: "/admin/applications",
        title: "Applications Management",
        description: "Route applications through screening, scoring, interviews, and final decisions.",
        meta: "Review pending cycles",
    },
    {
        href: "/admin/scholars",
        title: "Scholar Management",
        description: "Track scholar progress, milestones, placements, and funding utilisation from one queue.",
        meta: "Monitor delivery health",
    },
    {
        href: "/admin/programs",
        title: "Programs Management",
        description: "Balance intake, performance, capacity, and budget across every programme track.",
        meta: "Manage launch tracks",
    },
    {
        href: "/admin/cohorts",
        title: "Cohorts Management",
        description: "Monitor readiness and review completion for each cohort window.",
        meta: "Cycle oversight",
    },
    {
        href: "/admin/funding",
        title: "Funding Management",
        description: "Oversee allocations, disbursements, watchlists, and sponsor coverage.",
        meta: "Financial governance",
    },
    {
        href: "/admin/users",
        title: "User Management",
        description: "Control platform roles, permissions, and operational access.",
        meta: "Platform access",
    },
];

export const adminFundingDistribution = [
    { label: "Scholarship awards", value: 58, description: "Tuition and direct scholar support", meta: "Direct support" },
    { label: "Living stipends", value: 18, description: "Monthly support and emergency buffers", meta: "Stipends" },
    { label: "Research and labs", value: 12, description: "Research grants, fieldwork, and equipment", meta: "R&D" },
    { label: "Placement and leadership", value: 7, description: "Bootcamps, clinics, and deployment support", meta: "Readiness" },
    { label: "Programme operations", value: 5, description: "Oversight, compliance, and reporting", meta: "Operations" },
];

export const programGrowth = [
    { label: "2023", value: 118 },
    { label: "2024", value: 236 },
    { label: "2025", value: 284 },
    { label: "2026", value: 142 },
];

export const sectorPlacementBreakdown = [
    { label: "Public Health", value: 42, color: "var(--primary)" },
    { label: "Infrastructure", value: 28, color: "#0284c7" },
    { label: "Education", value: 18, color: "#f59e0b" },
    { label: "Digital Gov", value: 12, color: "#dc2626" },
];

export const contentStatusBreakdown = [
    { label: "Live", value: 72, color: "#10b981", description: "Currently visible to platform users" },
    { label: "Scheduled", value: 12, color: "#3b82f6", description: "Queued for automated publishing" },
    { label: "In review", value: 10, color: "#f59e0b", description: "Awaiting final sign-off" },
    { label: "Draft", value: 6, color: "#94a3b8", description: "Initial editorial generation" },
];

export const adminContentItems = [
    { title: "2026 Impact Narrative", type: "Impact Report", audience: "Donors", owner: "Marketing", updatedAt: "Jan 12", status: "In review" as const },
    { title: "Technical Milestone Guide", type: "Document", audience: "Scholars", owner: "Programs", updatedAt: "Jan 10", status: "Live" as const },
    { title: "Cohort 4 Welcome Pack", type: "Onboarding", audience: "Applicants", owner: "Admissions", updatedAt: "Jan 08", status: "Scheduled" as const },
];

export const impactMetrics = [
    { label: "Completion rate", value: "98%", description: "Percentage of scholars who finish" },
    { label: "Placement rate", value: "94%", description: "Percentage of scholars in careers" },
    { label: "Community impact", value: "450k+", description: "Lives touched by scholar projects" },
    { label: "Economic value", value: "₦2.4B", description: "Economic generation annually" },
];

export const donorImpactReports = [
    {
        id: "q4-2025",
        period: "Q4 2025",
        title: "Scaling Technical Excellence",
        summary: "Focus on the graduation of the first cohort and their deployment into strategic national sectors.",
        highlights: [
            "98% retention across all year 1 scholars",
            "₦45M in research grants unlocked by participants",
            "Successful placement of 120 Engineering leads"
        ]
    },
    {
        id: "q1-2026",
        period: "Q1 2026",
        title: "Digital Sovereignty Expansion",
        summary: "Expansion of the software engineering track into northern delivery hubs and mobile clinics.",
        highlights: [
            "New regional hub launched in Kano",
            "15 open source public health tools released",
            "Average GPA across cohort: 4.65/5.00"
        ]
    }
];

export const adminImpactReports = [
    { title: "Quarterly Board Pack", period: "Q1 2026", owner: "Admissions", audience: "Board", dueDate: "Mar 31", status: "In review" as const, confidence: "High" },
    { title: "Sponsor Transparency", period: "Feb 2026", owner: "Donors", audience: "Donors", dueDate: "Mar 05", status: "Published" as const, confidence: "High" },
    { title: "Strategic Review", period: "FY 2025", owner: "Programs", audience: "Board/Public", dueDate: "Mar 15", status: "Draft" as const, confidence: "Medium" },
    { title: "National Placement Study", period: "CY 2025", owner: "Research", audience: "Public", dueDate: "Apr 10", status: "Ready" as const, confidence: "High" }
];

export const reportCoverageBreakdown = [
    { label: "Board Reports", value: 100, color: "var(--primary)" },
    { label: "Sponsor Metrics", value: 85, color: "#0284c7" },
    { label: "Public Data", value: 65, color: "#d97706" },
    { label: "Operational Audit", value: 45, color: "#475569" }
];

export interface SettingToggle {
    id: string;
    label: string;
    description: string;
    enabled: boolean;
}

export const adminSystemSettings = {
    automation: [
        { id: "auto-routing", label: "Automatic Scholar Routing", description: "Route new applicants automatically based on discipline and availability.", enabled: true },
        { id: "reminders", label: "Milestone Reminders", description: "Send automated nudges to scholars with pending or overdue milestones.", enabled: true },
        { id: "anomaly-detection", label: "Grant Anomaly Detection", description: "Detect and flag unusual disbursement requests for manual review.", enabled: false }
    ],
    access: [
        { id: "read-only-mentors", label: "Restricted Mentor Access", description: "Limit mentor visibility to their assigned scholars' performance metrics only.", enabled: true },
        { id: "export-control", label: "Admin Export Controls", description: "Require secondary approval for large-scale data exports from the registry.", enabled: true }
    ],
    communications: [
        { id: "sponsor-alerts", label: "Sponsor Activity Alerts", description: "Notify the operations team whenever a donor views their impact desk.", enabled: false },
        { id: "daily-digest", label: "Operational Daily Digest", description: "Generate a morning summary of critical approval and support queues.", enabled: true }
    ],
    operations: {
        reportingWindow: "Q1 - Q4 2026",
        reviewSla: "48 Hours",
        escalationWindow: "12 Hours",
        supportEmail: "ops@talentinitiative.org"
    }
};

export const eligibilityRequirements = [
    { label: "Citizenship", desc: "Must be a Nigerian citizen with valid identification." },
    { label: "Age Range", desc: "Between 16 and 25 years at the time of application." },
    { label: "Academic Record", desc: "Minimum of 5 A-level credits (or equivalent), including English and Mathematics, obtained in a single sitting." },
    { label: "Character", desc: "Demonstrated integrity, community leadership, and commitment to national development." },
    { label: "Discipline Fit", desc: "Strong interest and aptitude in at least one of the four strategic focus areas." },
];

export const requiredDocuments = [
    { icon: "FileText", label: "Statement of Purpose", desc: "500–800 word essay on your vision for national impact." },
    { icon: "FileText", label: "Academic Transcripts", desc: "Certified copies of all academic results from secondary school." },
    { icon: "Users", label: "Two Reference Letters", desc: "From a teacher and a community/civic leader (not family members)." },
    { icon: "FileText", label: "Government-Issued ID", desc: "National ID card, birth certificate, or valid passport." },
    { icon: "GraduationCap", label: "JAMB Result (if applicable)", desc: "For applicants targeting undergraduate programs." },
];

export const applicationTimeline = [
    { phase: "Phase 1", title: "Online Application", date: "Jan – April 30, 2026", isCompleted: true },
    { phase: "Phase 2", title: "Aptitude Assessment", date: "May 15 – 25, 2026", isCompleted: false, isActive: true },
    { phase: "Phase 3", title: "Panel Interviews", date: "June 10 – 20, 2026", isCompleted: false },
    { phase: "Phase 4", title: "Offer Letters Issued", date: "July 1, 2026", isCompleted: false },
    { phase: "Phase 5", title: "Scholar Onboarding", date: "September 2026", isCompleted: false },
];

export const publicFAQs = [
    {
        q: "What is the scholarship coverage?",
        a: "The scholarship covers full tuition, mandatory university fees, and a monthly stipend for living expenses. In some cases, research grants and laptop allowances are also provided."
    },
    {
        q: "Can I apply if I'm currently in university?",
        a: "Applications are primarily open for prospective undergraduate or masters students. However, exceptional vocational or bridge programme credits may be considered."
    },
    {
        q: "Is there an application fee?",
        a: "No. The National Talent Development Initiative is a non-profit, merit-based programme. There is absolutely no fee required at any stage of the application or selection process."
    },
    {
        q: "How are the strategic focus areas determined?",
        a: "Focus areas are aligned with the national development plan, targeting sectors with high growth potential and critical skill gaps, such as renewable energy and technical governance."
    }
];

export const scholarOpportunities = [
    {
        id: "opp-1",
        title: "Technical Operations Intern",
        organisation: "State Digital Office",
        location: "Abuja (On-site)",
        type: "Internship",
        status: "active" as const,
        deadline: "Feb 15, 2026",
        fit: "High",
        summary: "Assist in the deployment of the new statewide data collection framework for public health clinics."
    },
    {
        id: "opp-2",
        title: "Junior Data Analyst",
        organisation: "HealthTech Solutions",
        location: "Kano (Hybrid)",
        type: "Full-time",
        status: "scheduled" as const,
        deadline: "Mar 01, 2026",
        fit: "Medium",
        summary: "Translate clinical research data into actionable insights for rural healthcare delivery teams."
    },
    {
        id: "opp-3",
        title: "Systems Architect Associate",
        organisation: "Energy Analytics Lab",
        location: "Lagos (Remote)",
        type: "Fellowship",
        status: "active" as const,
        deadline: "Feb 20, 2026",
        fit: "High",
        summary: "Support the architecture of distributed energy resource management systems for the national grid."
    }
];

export const programOutcomeHighlights = [
    {
        title: "Project Quality",
        metric: "4.8/5.0",
        summary: "Average faculty score across scholar capstone projects in 2025."
    },
    {
        title: "Regional Coverage",
        metric: "36 States",
        summary: "Successful deployment of scholars into every Nigerian state for national service."
    },
    {
        title: "Economic Velocity",
        metric: "₦120M+",
        summary: "Documented seed funding raised by scholar-led technical startups."
    }
];

export const scholarOutcomeBreakdown = [
    { label: "High Honours", value: 45, color: "var(--primary)" },
    { label: "Honours", value: 35, color: "#0284c7" },
    { label: "Technical Certification", value: 15, color: "#d97706" },
    { label: "Community Leadership", value: 5, color: "#dc2626" },
];

export const donorSettings = {
    contacts: {
        organization: "Crescent Impact Fund",
        reportingContact: "Sarah Aliyu",
        email: "s.aliyu@crescentimpact.org",
        phone: "+234 809 123 4567"
    },
    notifications: [
        { label: "Quarterly Impact Reports", description: "Receive automated notifications when the latest quarterly summaries are issued.", enabled: true },
        { label: "Financial Ledger Activity", description: "Receive notifications whenever funds are disbursed to your supported scholars.", enabled: true },
        { label: "Scholar Success Milestones", description: "Stay informed on high-level achievements, graduations, and placements.", enabled: false }
    ],
    visibility: [
        { label: "Public Acknowledgement", description: "Reference our organisation in public donor impact highlights.", enabled: true },
        { label: "Sector Leadership Attribution", description: "Attribute our support specifically to the STEM Leadership and Energy pathways.", enabled: true }
    ]
};

export const annualReports = [
    {
        year: 2025,
        title: "2025 Foundation Report",
        summary: "Comprehensive record of the inaugural year of the National Talent Development Initiative.",
        highlights: [
            "₦8B total funding committed and verified",
            "Establishment of the first 5 strategic regional hubs",
            "Completion of the first 250 scholar training cycles"
        ],
        fileSize: "4.2 MB"
    },
    {
        year: 2024,
        title: "2024 Pilot Implementation",
        summary: "Strategic outcomes and architectural review of the initial NTDI pilot program across 3 states.",
        highlights: [
            "Successful screening of 15,000+ pilot applicants",
            "Baseline socio-economic impact study completed",
            "Governance and policy framework established"
        ],
        fileSize: "3.8 MB"
    }
];

export const donorMessages = [
    {
        id: "msg-1",
        participant: "Programme Office",
        role: "Scholar Management",
        unreadCount: 1,
        lastMessage: "The Q1 progress reports for your sponsored scholars are now available for review.",
        timestamp: "2h ago",
        messages: [
            {
                id: "m1",
                sender: "Programme Office",
                time: "Yesterday, 10:45 AM",
                body: "Hello, we've just uploaded the latest performance metrics for the 2025 cohort. You'll notice a significant uptick in the research output."
            },
            {
                id: "m2",
                sender: "Crescent Impact Fund",
                time: "Yesterday, 2:30 PM",
                body: "Thank you for the update. We're particularly interested in the STEM Leadership track progress. Can we expect a detailed breakdown by next week?"
            },
            {
                id: "m3",
                sender: "Programme Office",
                time: "2h ago",
                body: "Absolutely. I'll ensure the leadership focus metrics are included in the transparency packet we're preparing for you."
            }
        ]
    },
    {
        id: "msg-2",
        participant: "Finance Operations",
        role: "Treasury & Disbursement",
        unreadCount: 0,
        lastMessage: "The secondary disbursement for your tech-focused portfolio has been processed.",
        timestamp: "Jan 10",
        messages: [
            {
                id: "m4",
                sender: "Finance Operations",
                time: "Jan 10, 9:20 AM",
                body: "We've confirmed the receipt of the Q1 commitment funds. The allocation to the respective scholars' stipends has been initiated."
            }
        ]
    }
];
