// Mock data for the Applicant Portal

import type {
    Application,
    Applicant,
    Notification,
    Deadline,
    Announcement,
    UploadedDocument,
} from "@/types";

export const mockApplicant: Applicant = {
    id: "app-001",
    userId: "user-001",
    firstName: "Chukwuemeka",
    lastName: "Okafor",
    email: "c.okafor@email.com",
    phone: "+234 803 xxx xxxx",
    stateOfOrigin: "Enugu",
    dateOfBirth: "2002-04-15",
    gender: "Male",
    createdAt: "2026-01-10T09:00:00Z",
};

export const mockDocuments: UploadedDocument[] = [
    { id: "doc-1", type: "transcript", name: "WAEC_Result_2021.pdf", size: 1240000, uploadedAt: "2026-03-10", status: "verified" },
    { id: "doc-2", type: "id", name: "NationalID_Okafor.pdf", size: 380000, uploadedAt: "2026-03-11", status: "verified" },
    { id: "doc-3", type: "reference_letter", name: "Reference_Mr_Eze.pdf", size: 620000, uploadedAt: "2026-03-12", status: "pending" },
];

export const mockApplication: Application = {
    id: "NTDI-2025-00842",
    applicantId: "app-001",
    status: "draft",
    currentStep: 3,
    programChoice: "Technology & Software Engineering",
    personalInfo: {
        firstName: "Chukwuemeka",
        lastName: "Okafor",
        email: "c.okafor@email.com",
        phone: "+234 803 xxx xxxx",
        dateOfBirth: "2002-04-15",
        gender: "Male",
        stateOfOrigin: "Enugu",
        lgaOfOrigin: "Enugu North",
        address: "12 Independence Layout",
        city: "Enugu",
        nationalId: "12345678901",
    },
    academicBackground: {
        secondarySchool: "Government Secondary School, Enugu",
        waecYear: "2021",
        waecGrade: "8 A1s",
        jambScore: "334",
        jambYear: "2022",
        institution: "University of Nigeria, Nsukka",
        course: "Computer Science",
        programType: "undergraduate",
        currentYear: "Year 3",
    },
    essays: {
        whyApply: "I want to be part of the initiative because I believe...",
    },
    documents: mockDocuments,
    lastSavedAt: "2026-03-15T14:30:00Z",
    createdAt: "2026-03-08T10:20:00Z",
};

export const mockNotifications: Notification[] = [
    {
        id: "notif-1",
        userId: "user-001",
        title: "Application Deadline Reminder",
        body: "Your application must be fully submitted by April 30, 2026. You are currently on Step 3 of 5.",
        type: "warning",
        isRead: false,
        createdAt: "2026-03-15T09:00:00Z",
    },
    {
        id: "notif-2",
        userId: "user-001",
        title: "Document Verified",
        body: "Your WAEC Result (2021) has been successfully verified by our document team.",
        type: "success",
        isRead: false,
        createdAt: "2026-03-12T11:30:00Z",
    },
    {
        id: "notif-3",
        userId: "user-001",
        title: "Welcome to the NTDI Applicant Portal",
        body: "Your account has been created successfully. Begin your application when you are ready.",
        type: "info",
        isRead: true,
        createdAt: "2026-03-08T10:25:00Z",
    },
    {
        id: "notif-4",
        userId: "user-001",
        title: "Reference Letter Pending",
        body: "Your reference letter from Mr. Eze is still under review. Verification typically takes 2–3 working days.",
        type: "info",
        isRead: true,
        createdAt: "2026-03-13T08:00:00Z",
    },
];

export const mockDeadlines: Deadline[] = [
    { id: "d-1", label: "Application Submission Deadline", date: "April 30, 2026", daysLeft: 45, isUrgent: false },
    { id: "d-2", label: "Document Upload Deadline", date: "April 15, 2026", daysLeft: 30, isUrgent: false },
    { id: "d-3", label: "Essay Finalization", date: "April 10, 2026", daysLeft: 25, isUrgent: false },
];

export const mockAnnouncements: Announcement[] = [
    {
        id: "ann-1",
        title: "2025 Cohort: Information Webinar – March 20",
        body: "Join our live Q&A session with the NTDI Selection Board. Register via the link below to receive your joining details.",
        author: "NTDI Programme Office",
        createdAt: "2026-03-10",
        isPinned: true,
    },
    {
        id: "ann-2",
        title: "Essay Guidance Notes Published",
        body: "We have published detailed guidance notes for all four essay questions. Review the notes carefully before drafting your responses.",
        author: "NTDI Applications Team",
        createdAt: "2026-03-05",
        isPinned: false,
    },
    {
        id: "ann-3",
        title: "Programme Information Pack Updated",
        body: "The 2025 Programme Information Pack has been updated with details on the new Sustainable Energy track. Download it from the Resources section.",
        author: "NTDI Programme Office",
        createdAt: "2026-02-28",
        isPinned: false,
    },
];

export const applicationSteps = [
    { step: 1, label: "Personal Information", description: "Basic personal, contact, and identification details" },
    { step: 2, label: "Academic Background", description: "Secondary school results, JAMB score, and current institution" },
    { step: 3, label: "Essays", description: "Four structured essay responses about your ambitions and values" },
    { step: 4, label: "Documents", description: "Upload supporting documents including transcripts and ID" },
    { step: 5, label: "Review & Submit", description: "Final review of all information before formal submission" },
];

export const nigerianStates = [
    "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
    "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT - Abuja", "Gombe",
    "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara",
    "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau",
    "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
];

export const programChoices = [
    "Technology & Software Engineering",
    "Healthcare Delivery Systems",
    "Sustainable Energy & Agriculture",
    "Advanced Manufacturing & Engineering",
];
