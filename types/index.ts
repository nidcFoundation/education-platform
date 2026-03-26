// Core Types for the National Talent Development Initiative Platform

export type UserRole = "admin" | "reviewer" | "donor" | "scholar" | "applicant";

export type ApplicationStatus =
    | "draft"
    | "submitted"
    | "under_review"
    | "shortlisted"
    | "interview_stage"
    | "accepted"
    | "rejected";

export type DocumentStatus = "pending" | "verified" | "rejected" | "expiring";

export type DocumentType =
    | "transcript"
    | "id"
    | "reference_letter"
    | "essay"
    | "jamb_result"
    | "award_letter"
    | "other";

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    team?: string;
    access: string;
    status: "Active" | "Pending" | "Suspended";
    lastActive: string;
    avatarUrl?: string;
}

export interface Applicant {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    stateOfOrigin: string;
    dateOfBirth: string;
    gender: string;
    avatarUrl?: string;
    createdAt: string;
}

export interface PersonalInfo {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    gender: string;
    stateOfOrigin: string;
    lgaOfOrigin: string;
    address: string;
    city: string;
    nationalId: string;
}

export interface AcademicBackground {
    secondarySchool: string;
    waecYear: string;
    waecGrade: string;
    jambScore: string;
    jambYear: string;
    institution: string;
    course: string;
    programType: "undergraduate" | "postgraduate";
    currentYear?: string;
}

export interface EssaySubmission {
    whyApply: string;
    nationalContribution: string;
    leadershipExample: string;
    careerGoals: string;
}

export interface UploadedDocument {
    id: string;
    type: DocumentType;
    slot?: string;
    name: string;
    size: number;
    uploadedAt: string;
    status: DocumentStatus;
    owner?: string;
}

export interface Application {
    id: string;
    applicantId: string;
    status: ApplicationStatus;
    currentStep: number;
    programChoice: string;
    personalInfo?: Partial<PersonalInfo>;
    academicBackground?: Partial<AcademicBackground>;
    essays?: Partial<EssaySubmission>;
    documents?: UploadedDocument[];
    submittedAt?: string;
    lastSavedAt: string;
    createdAt: string;
    reviewNotes?: string;
}

export interface Scholar {
    id: string;
    applicantId: string;
    cohortId: string;
    programId: string;
    name: string;
    cohort: string;
    discipline: string;
    institution: string;
    state: string;
    placement: string;
    status: "active" | "graduated" | "suspended";
    progressScore: number; // 0-100
    mentorId?: string;
    placementId?: string;
    fundingUtilisation: number; // 0-100
    level: string;
}

export interface Program {
    id: string;
    title: string;
    description: string;
    focusAreaId: string;
    modules: string[];
    outcomes: string[];
    lead: string;
    location: string;
    duration: string;
    capacity: number;
    activeScholarsCount: number;
    completionRate: number;
    placementRate: number;
    budget: string;
    status: "active" | "upcoming" | "archived";
}

export interface FocusArea {
    id: string;
    name: string;
    description: string;
    iconName: string; // Lucide icon name
}

export interface Cohort {
    id: string;
    year: string;
    phase: string;
    applicantsCount: number;
    activeScholarsCount: number;
    reviewCompletion: number; // percentage
    fundingReleased: string;
    readiness: string;
}

export interface ApplicationCycle {
    id: string;
    year: string;
    title: string;
    openDate: string;
    closeDate: string;
    status: "upcoming" | "open" | "closed";
}

export interface Review {
    id: string;
    applicationId: string;
    reviewerId: string;
    rubricScores: Array<{
        label: string;
        score: number;
        max: number;
    }>;
    notes: string;
    decision: ApplicationStatus;
    submittedAt: string;
}

export interface Interview {
    id: string;
    applicationId: string;
    date: string;
    time: string;
    mode: string;
    panelMembers: string[];
    status: "scheduled" | "completed" | "cancelled";
    feedback?: string;
}

export interface Milestone {
    id: string;
    scholarId: string;
    title: string;
    category: "course completion" | "internships" | "research" | "leadership" | "national service";
    status: "completed" | "active" | "upcoming";
    dueDate: string;
    impactDescription?: string;
    evidenceUrl?: string;
}

export interface Placement {
    id: string;
    scholarId: string;
    organizationName: string;
    role: string;
    status: "active" | "completed" | "upcoming";
    location: string;
    startDate: string;
    endDate?: string;
}

export interface Sponsor {
    id: string;
    name: string;
    category: string;
    commitment: string; // e.g. "₦18.5M"
    focusAreaIds: string[];
    status: "Active" | "Renewal due" | "At risk";
}

export interface FundingRecord {
    id: string;
    sponsorId: string;
    programId?: string;
    scholarId?: string;
    amount: string;
    type: "commitment" | "disbursement" | "stipend";
    status: "Committed" | "Disbursed" | "Flagged";
    date: string;
}

export interface ImpactMetric {
    id: string;
    label: string;
    value: string | number;
    unit?: string;
    description: string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
}

export interface Report {
    id: string;
    title: string;
    type: "impact" | "performance" | "financial";
    period: string;
    owner: string;
    status: "Draft" | "In review" | "Ready" | "Published";
    url: string;
    createdAt: string;
}

export interface Notification {
    id: string;
    userId: string;
    title: string;
    body: string;
    type: "info" | "warning" | "success" | "error";
    isRead: boolean;
    createdAt: string;
    link?: string;
}

export interface Deadline {
    id: string;
    label: string;
    date: string;
    daysLeft: number;
    isUrgent: boolean;
}

export interface Announcement {
    id: string;
    title: string;
    body: string;
    author: string;
    createdAt: string;
    isPinned: boolean;
    audience: "all" | "scholars" | "reviewers" | "applicants";
}
