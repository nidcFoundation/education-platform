export type ScholarMilestoneCategory =
    | "course completion"
    | "internships"
    | "research"
    | "national service contributions"
    | "industry placements";

export interface ScholarProfile {
    scholarId: string;
    fullName: string;
    email: string;
    phone: string;
    cohort: string;
    program: string;
    institution: string;
    level: string;
    location: string;
    stateOfOrigin: string;
    mentor: string;
    mentorTitle: string;
    placementTrack: string;
    bio: string;
    focusAreas: string[];
    goals: string[];
    supportNeeds: string[];
}

export interface AcademicTerm {
    term: string;
    gpa: string;
    highlight: string;
    focus: string;
}

export interface CourseSnapshot {
    title: string;
    credits: number;
    score: string;
    status: "completed" | "active" | "upcoming";
    note: string;
}

export interface ScholarMilestone {
    id: string;
    title: string;
    category: ScholarMilestoneCategory;
    status: "completed" | "active" | "upcoming";
    dueDate: string;
    owner: string;
    impact: string;
    evidence: string;
}

export interface ProgressReport {
    id: string;
    period: string;
    submittedOn: string;
    reviewer: string;
    score: string;
    status: "completed" | "active" | "upcoming";
    summary: string;
    priorities: string[];
}

export interface MentorSession {
    id: string;
    date: string;
    mentor: string;
    theme: string;
    sentiment: "Strong" | "Positive" | "Watch";
    summary: string;
    strengths: string[];
    actionItems: string[];
}

export interface FundingLine {
    label: string;
    allocated: string;
    used: string;
    utilisation: number;
    note: string;
}

export interface Disbursement {
    id: string;
    date: string;
    category: string;
    amount: string;
    status: "completed" | "pending";
    reference: string;
}

export interface Opportunity {
    id: string;
    title: string;
    organisation: string;
    type: "Internship" | "Placement" | "Research" | "Leadership";
    location: string;
    deadline: string;
    fit: string;
    status: "active" | "upcoming" | "completed";
    summary: string;
}

export interface ScholarDocument {
    id: string;
    name: string;
    type: string;
    updatedOn: string;
    expiresOn: string;
    status: "verified" | "pending" | "expiring";
    owner: string;
}

export interface ScholarAnnouncement {
    id: string;
    title: string;
    author: string;
    date: string;
    priority: "High" | "Medium";
    summary: string;
    audience: string;
}

export interface MessageThread {
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

export const scholarProfile: ScholarProfile = {
    scholarId: "SCH-24-017",
    fullName: "Amara Okafor",
    email: "amara.okafor@example.org",
    phone: "+000-000-0000",
    cohort: "2024",
    program: "Data Science for Public Systems",
    institution: "University of Lagos",
    level: "Year 3 Scholar",
    location: "Lagos, Nigeria",
    stateOfOrigin: "Anambra",
    mentor: "Dr. Tade Akinyemi",
    mentorTitle: "Lead Data Scientist, National Health Analytics Hub",
    placementTrack: "Public-sector analytics and health-tech deployment",
    bio: "Amara is building data products that translate health and education signals into policy action. Her scholarship journey is focused on combining rigorous academic performance with measurable public impact.",
    focusAreas: ["Predictive modelling", "Health analytics", "Public policy communication"],
    goals: [
        "Graduate with a first-class standing and an applied research portfolio.",
        "Secure an industry placement in a national analytics or health-tech team.",
        "Lead at least two community data-literacy projects before final year.",
    ],
    supportNeeds: [
        "Quarterly research supervision",
        "Industry placement interview prep",
        "Funding for conference travel and datasets",
    ],
};

export const scholarDashboardStats = [
    { title: "Program Enrolled", value: scholarProfile.program, description: scholarProfile.institution },
    { title: "Cohort", value: scholarProfile.cohort, description: scholarProfile.level },
    { title: "Progress Score", value: "84%", description: "Academic, leadership, and impact score" },
    { title: "Funding Support", value: "₦3.6M", description: "Disbursed across tuition and stipend" },
    { title: "Milestones", value: "8 / 11", description: "Completed or on-track" },
];

export const academicGrowthMetrics = [
    { label: "Current CGPA", value: "4.72 / 5.00", change: "+0.18 since last term" },
    { label: "Credits Completed", value: "96", change: "24 credits this session" },
    { label: "Research Hours", value: "148", change: "32 hours logged this month" },
    { label: "Leadership Hours", value: "64", change: "4 peer-learning sessions led" },
];

export const academicJourneyTimeline: AcademicTerm[] = [
    {
        term: "2024 / Rain Semester",
        gpa: "4.51",
        highlight: "Built a local government service dashboard with live community survey data.",
        focus: "Foundation courses, teamwork, and presentation skills",
    },
    {
        term: "2025 / Harmattan Semester",
        gpa: "4.66",
        highlight: "Completed the NTDI analytics bootcamp and presented a policy memo to programme leadership.",
        focus: "Machine learning, research writing, stakeholder communication",
    },
    {
        term: "2025 / Rain Semester",
        gpa: "4.72",
        highlight: "Published a supervised paper draft on maternal health risk forecasting.",
        focus: "Applied research and placement readiness",
    },
];

export const currentCourses: CourseSnapshot[] = [
    {
        title: "Advanced Statistical Modelling",
        credits: 3,
        score: "A",
        status: "completed",
        note: "Completed with a case study on immunisation uptake.",
    },
    {
        title: "Machine Learning for Public Policy",
        credits: 3,
        score: "A-",
        status: "active",
        note: "Current focus is explainability and model governance.",
    },
    {
        title: "Research Methods & Ethics",
        credits: 2,
        score: "B+",
        status: "active",
        note: "Preparing ethics clearance for field interviews.",
    },
    {
        title: "Leadership Communication Lab",
        credits: 2,
        score: "Planned",
        status: "upcoming",
        note: "Starts next month with cohort presentations.",
    },
];

export const scholarMilestones: ScholarMilestone[] = [
    {
        id: "milestone-1",
        title: "Complete advanced analytics core modules",
        category: "course completion",
        status: "completed",
        dueDate: "February 14, 2026",
        owner: "Academic Adviser",
        impact: "Unlocked eligibility for capstone research placement.",
        evidence: "Term transcript uploaded",
    },
    {
        id: "milestone-2",
        title: "Finish NITDA policy analytics internship",
        category: "internships",
        status: "active",
        dueDate: "May 30, 2026",
        owner: "Placement Office",
        impact: "Builds work-readiness and public-sector delivery exposure.",
        evidence: "Mid-point supervisor review received",
    },
    {
        id: "milestone-3",
        title: "Submit maternal health forecasting paper",
        category: "research",
        status: "active",
        dueDate: "June 18, 2026",
        owner: "Research Supervisor",
        impact: "Supports national health-risk early warning planning.",
        evidence: "Draft 2 under faculty review",
    },
    {
        id: "milestone-4",
        title: "Lead community data-literacy clinics",
        category: "national service contributions",
        status: "completed",
        dueDate: "January 28, 2026",
        owner: "Community Impact Lead",
        impact: "Reached 180 secondary-school students across 3 LGAs.",
        evidence: "Attendance register and impact photos filed",
    },
    {
        id: "milestone-5",
        title: "Secure year-four industry placement",
        category: "industry placements",
        status: "upcoming",
        dueDate: "August 8, 2026",
        owner: "Career Placement Team",
        impact: "Transitions scholar into national deployment track.",
        evidence: "Placement shortlist opens in April",
    },
];

export const progressReports: ProgressReport[] = [
    {
        id: "report-1",
        period: "Q3 2025",
        submittedOn: "September 29, 2025",
        reviewer: "Programme Office",
        score: "82 / 100",
        status: "completed",
        summary: "Strong academic standing with clear improvement in communication and leadership outputs.",
        priorities: ["Improve project documentation", "Increase mentor touchpoints"],
    },
    {
        id: "report-2",
        period: "Q4 2025",
        submittedOn: "December 18, 2025",
        reviewer: "Mentor Panel",
        score: "86 / 100",
        status: "completed",
        summary: "Research maturity improved and national service contribution exceeded target.",
        priorities: ["Prepare internship portfolio", "Tighten research methodology"],
    },
    {
        id: "report-3",
        period: "Q1 2026",
        submittedOn: "March 10, 2026",
        reviewer: "Scholar Success Team",
        score: "89 / 100",
        status: "active",
        summary: "Placement readiness is trending up, with strong applied learning outcomes this quarter.",
        priorities: ["Complete internship project", "Finalize conference abstract"],
    },
    {
        id: "report-4",
        period: "Q2 2026",
        submittedOn: "June 24, 2026",
        reviewer: "Scholar Success Team",
        score: "In progress",
        status: "upcoming",
        summary: "Next cycle focuses on research submission, internship closeout, and placement interviews.",
        priorities: ["Track mentor action items", "Prepare end-of-term impact report"],
    },
];

export const mentorSessions: MentorSession[] = [
    {
        id: "mentor-1",
        date: "March 11, 2026",
        mentor: scholarProfile.mentor,
        theme: "Placement readiness and executive communication",
        sentiment: "Strong",
        summary: "Amara is showing sharper thinking around translating technical work into decision-ready insights. The next stretch is interview storytelling.",
        strengths: ["Clear analytical thinking", "Reliable follow-through", "High ownership"],
        actionItems: ["Draft a two-minute placement pitch", "Refine internship case study deck"],
    },
    {
        id: "mentor-2",
        date: "February 6, 2026",
        mentor: scholarProfile.mentor,
        theme: "Research quality and stakeholder engagement",
        sentiment: "Positive",
        summary: "The paper direction is strong, but the evidence chain needs to be explained in simpler language for policy audiences.",
        strengths: ["Research discipline", "Quality of questions asked"],
        actionItems: ["Simplify methodology slides", "Share paper abstract with programme office"],
    },
    {
        id: "mentor-3",
        date: "January 14, 2026",
        mentor: scholarProfile.mentor,
        theme: "Workload management",
        sentiment: "Watch",
        summary: "Academic output remains strong, but scheduling across coursework, service, and research needs tighter boundaries.",
        strengths: ["Academic excellence", "Community initiative"],
        actionItems: ["Block weekly deep-work sessions", "Reduce context-switching during research weeks"],
    },
];

export const fundingSnapshot = {
    approved: "₦4.8M",
    disbursed: "₦3.6M",
    nextStipend: "₦350,000 due March 28, 2026",
    emergencySupport: "₦150,000 available",
};

export const fundingBreakdown: FundingLine[] = [
    {
        label: "Tuition & academic fees",
        allocated: "₦2.9M",
        used: "₦2.2M",
        utilisation: 76,
        note: "Covers core fees, lab access, and project supervision.",
    },
    {
        label: "Living stipend",
        allocated: "₦1.1M",
        used: "₦800,000",
        utilisation: 73,
        note: "Monthly stipends are on schedule with one pending cycle.",
    },
    {
        label: "Research & conference support",
        allocated: "₦500,000",
        used: "₦280,000",
        utilisation: 56,
        note: "Includes dataset access, field transport, and poster printing.",
    },
    {
        label: "Leadership and service fund",
        allocated: "₦300,000",
        used: "₦210,000",
        utilisation: 70,
        note: "Supports workshops, volunteer projects, and civic campaigns.",
    },
];

export const disbursements: Disbursement[] = [
    {
        id: "disbursement-1",
        date: "January 5, 2026",
        category: "Living stipend",
        amount: "₦200,000",
        status: "completed",
        reference: "NTDI-STIP-0105",
    },
    {
        id: "disbursement-2",
        date: "January 18, 2026",
        category: "Research support",
        amount: "₦120,000",
        status: "completed",
        reference: "NTDI-RSH-0118",
    },
    {
        id: "disbursement-3",
        date: "February 28, 2026",
        category: "Living stipend",
        amount: "₦200,000",
        status: "completed",
        reference: "NTDI-STIP-0228",
    },
    {
        id: "disbursement-4",
        date: "March 28, 2026",
        category: "Living stipend",
        amount: "₦350,000",
        status: "pending",
        reference: "NTDI-STIP-0328",
    },
];

export const placementStages: Array<{
    label: string;
    status: "completed" | "active" | "upcoming";
    detail: string;
}> = [
    { label: "Career readiness review", status: "completed", detail: "CV, portfolio, and mentor sign-off complete." },
    { label: "Partner matching", status: "active", detail: "3 organisations shortlisted across public analytics and health-tech." },
    { label: "Interview rounds", status: "upcoming", detail: "Mock interviews scheduled for April 2026." },
    { label: "Deployment placement", status: "upcoming", detail: "Final placement expected before Year 4 starts." },
];

export const opportunities: Opportunity[] = [
    {
        id: "opp-1",
        title: "Policy Analytics Internship",
        organisation: "National Information Technology Development Agency",
        type: "Internship",
        location: "Abuja",
        deadline: "April 4, 2026",
        fit: "92% fit",
        status: "active",
        summary: "12-week internship focused on building dashboards for digital service delivery teams.",
    },
    {
        id: "opp-2",
        title: "Health Systems Research Fellowship",
        organisation: "National Health Analytics Hub",
        type: "Research",
        location: "Lagos",
        deadline: "April 18, 2026",
        fit: "88% fit",
        status: "active",
        summary: "Applied research role for scholars translating models into ministry planning recommendations.",
    },
    {
        id: "opp-3",
        title: "Graduate Placement Track",
        organisation: "HealthLogic Africa",
        type: "Placement",
        location: "Hybrid",
        deadline: "July 2, 2026",
        fit: "High potential",
        status: "upcoming",
        summary: "Early-access placement pathway for scholars working at the intersection of analytics and health-tech.",
    },
    {
        id: "opp-4",
        title: "National Leadership Sprint",
        organisation: "NTDI Scholar Success Team",
        type: "Leadership",
        location: "Lagos",
        deadline: "May 12, 2026",
        fit: "Cohort priority",
        status: "active",
        summary: "Bootcamp on executive communication, policy influence, and team leadership before placement season.",
    },
];

export const scholarDocuments: ScholarDocument[] = [
    {
        id: "document-1",
        name: "Scholarship Award Letter",
        type: "Programme",
        updatedOn: "January 10, 2026",
        expiresOn: "December 31, 2028",
        status: "verified",
        owner: "Programme Office",
    },
    {
        id: "document-2",
        name: "University Transcript",
        type: "Academic",
        updatedOn: "February 16, 2026",
        expiresOn: "N/A",
        status: "verified",
        owner: "Registry",
    },
    {
        id: "document-3",
        name: "Internship Placement Letter",
        type: "Placement",
        updatedOn: "March 2, 2026",
        expiresOn: "August 30, 2026",
        status: "pending",
        owner: "Placement Office",
    },
    {
        id: "document-4",
        name: "National ID",
        type: "Identity",
        updatedOn: "January 5, 2025",
        expiresOn: "April 21, 2026",
        status: "expiring",
        owner: "Scholar",
    },
];

export const scholarAnnouncements: ScholarAnnouncement[] = [
    {
        id: "announcement-1",
        title: "Placement readiness clinic opens this week",
        author: "Scholar Success Team",
        date: "March 14, 2026",
        priority: "High",
        summary: "All Year 3 scholars must complete the placement readiness clinic before interview matching begins.",
        audience: "Year 3 scholars",
    },
    {
        id: "announcement-2",
        title: "Research travel micro-grants available",
        author: "Research Desk",
        date: "March 8, 2026",
        priority: "Medium",
        summary: "Scholars with approved fieldwork plans can request travel grants for data collection and stakeholder interviews.",
        audience: "Research-active scholars",
    },
    {
        id: "announcement-3",
        title: "Community impact reporting due",
        author: "Programme Office",
        date: "March 2, 2026",
        priority: "High",
        summary: "Upload service evidence and beneficiary counts before the end of the month to keep impact records current.",
        audience: "All scholars",
    },
    {
        id: "announcement-4",
        title: "Annual scholars summit speaker nominations",
        author: "Communications Team",
        date: "February 23, 2026",
        priority: "Medium",
        summary: "Nominate scholars with notable academic, research, or civic outcomes for the annual summit spotlight sessions.",
        audience: "Cohort leaders",
    },
];

export const impactTracking = [
    { label: "Beneficiaries reached", value: "180 students", detail: "Through 3 community data-literacy clinics" },
    { label: "Policy outputs", value: "2 memos", detail: "Submitted to programme leadership and external partners" },
    { label: "Peer mentoring", value: "11 sessions", detail: "Weekly support for first-year scholars" },
    { label: "Volunteer hours", value: "74 hours", detail: "Logged this academic year" },
];

export const messageThreads: MessageThread[] = [
    {
        id: "thread-1",
        participant: "Dr. Tade Akinyemi",
        role: "Mentor",
        timestamp: "10:24 AM",
        unreadCount: 2,
        lastMessage: "Share the latest case study deck before tomorrow's review.",
        messages: [
            { id: "m1", sender: "Dr. Tade Akinyemi", body: "Your policy brief is sharper. Next, simplify the first methodology slide.", time: "9:10 AM" },
            { id: "m2", sender: "Amara Okafor", body: "Understood. I will tighten the evidence chain and resend before noon.", time: "9:34 AM" },
            { id: "m3", sender: "Dr. Tade Akinyemi", body: "Share the latest case study deck before tomorrow's review.", time: "10:24 AM" },
        ],
    },
    {
        id: "thread-2",
        participant: "Scholar Success Team",
        role: "Programme Office",
        timestamp: "Yesterday",
        unreadCount: 0,
        lastMessage: "Your Q1 report has been reviewed and marked on-track.",
        messages: [
            { id: "m4", sender: "Scholar Success Team", body: "Your Q1 report has been reviewed and marked on-track.", time: "Yesterday, 2:10 PM" },
            { id: "m5", sender: "Amara Okafor", body: "Thanks. I will upload the revised placement plan today.", time: "Yesterday, 2:36 PM" },
        ],
    },
    {
        id: "thread-3",
        participant: "Placement Office",
        role: "Career Placement",
        timestamp: "Monday",
        unreadCount: 1,
        lastMessage: "Two new internship briefs match your profile. Please rank them by Friday.",
        messages: [
            { id: "m6", sender: "Placement Office", body: "Two new internship briefs match your profile. Please rank them by Friday.", time: "Monday, 11:08 AM" },
        ],
    },
];

export const scholarSettings = {
    notifications: [
        { label: "Mentor feedback alerts", description: "Notify me when a mentor session summary is posted.", enabled: true },
        { label: "Funding disbursement updates", description: "Notify me when stipends or reimbursements are processed.", enabled: true },
        { label: "Placement deadlines", description: "Notify me before placement or internship cut-off dates.", enabled: true },
        { label: "Community impact reminders", description: "Notify me to upload service evidence and impact numbers.", enabled: false },
    ],
    visibility: [
        { label: "Show my profile to placement partners", description: "Placement partners can view your scholar profile and achievements.", enabled: true },
        { label: "Share impact portfolio with cohort leads", description: "Cohort leads can reference your service and mentoring contributions.", enabled: true },
        { label: "Display my contact details to all scholars", description: "Only direct collaborators can contact you if disabled.", enabled: false },
    ],
    emergencyContact: {
        name: "Ifeoma Okafor",
        relationship: "Mother",
        phone: "000-000-0000",
        email: "ifeoma.okafor@example.org",
    },
};
