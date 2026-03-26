"use server";

import { createSupabaseServerClient } from "./server";
import {
    Scholar,
    Milestone,
    Announcement,
    ImpactMetric,
    FundingRecord,
    ApplicationStatus,
    DocumentStatus,
    DocumentType,
    UploadedDocument,
} from "@/types";

const MS_PER_DAY = 1000 * 60 * 60 * 24;

function getDaysUntilDueDate(dueDate: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);

    return Math.ceil((due.getTime() - today.getTime()) / MS_PER_DAY);
}

function getApplicationPermissionErrorMessage(rawMessage?: string, action: "save" | "submit" = "save") {
    const message = (rawMessage || "").toLowerCase();
    const isMissingApplicantProfileError =
        message.includes("applications_applicant_id_fkey") ||
        (message.includes("foreign key constraint") && message.includes("applicant_id"));
    const isPermissionError =
        message.includes("permission denied") ||
        message.includes("row-level security") ||
        message.includes("violates row-level security policy");
    const isApplicationsTableError =
        message.includes("application") ||
        message.includes("applications");

    if (isMissingApplicantProfileError) {
        return "Your applicant profile is not initialized yet. Please sign out and sign in again, then retry. If it persists, run the latest database migrations.";
    }

    if (isPermissionError && isApplicationsTableError) {
        return action === "submit"
            ? "You do not have permission to submit this application yet. Please contact support or run the latest database migrations."
            : "You do not have permission to save this application yet. Please contact support or run the latest database migrations.";
    }

    return rawMessage || "An unexpected error occurred.";
}

function getProfileSaveErrorMessage(rawMessage?: string) {
    const message = (rawMessage || "").toLowerCase();
    const isPermissionError =
        message.includes("permission denied") ||
        message.includes("row-level security") ||
        message.includes("violates row-level security policy");

    if (isPermissionError) {
        return "Unable to save profile details right now due to access restrictions.";
    }

    return "Unable to save profile details right now. Please try again.";
}

const SUPPORTED_DOCUMENT_TYPES = new Set<DocumentType>([
    "transcript",
    "id",
    "reference_letter",
    "essay",
    "jamb_result",
    "award_letter",
    "other",
]);

const SUPPORTED_DOCUMENT_STATUSES = new Set<DocumentStatus>([
    "pending",
    "verified",
    "rejected",
    "expiring",
]);

function isDocumentType(value: unknown): value is DocumentType {
    return typeof value === "string" && SUPPORTED_DOCUMENT_TYPES.has(value as DocumentType);
}

function isDocumentStatus(value: unknown): value is DocumentStatus {
    return typeof value === "string" && SUPPORTED_DOCUMENT_STATUSES.has(value as DocumentStatus);
}

function getApplicationDocumentKey(document: Pick<UploadedDocument, "type" | "slot">): string {
    return typeof document.slot === "string" && document.slot.trim() ? document.slot.trim() : document.type;
}

function normalizeApplicationDocuments(value: unknown): UploadedDocument[] {
    if (!Array.isArray(value)) {
        return [];
    }

    return value
        .flatMap((entry) => {
            if (!entry || typeof entry !== "object") {
                return [];
            }

            const source = entry as Record<string, unknown>;
            const id = typeof source.id === "string" ? source.id.trim() : "";
            const name = typeof source.name === "string" ? source.name.trim() : "";
            const uploadedAt =
                typeof source.uploadedAt === "string"
                    ? source.uploadedAt
                    : typeof source.updated_at === "string"
                        ? source.updated_at
                        : typeof source.updated_on === "string"
                            ? source.updated_on
                            : typeof source.created_at === "string"
                                ? source.created_at
                                : "";

            if (!id || !name || !uploadedAt) {
                return [];
            }

            const document: UploadedDocument = {
                id,
                type: isDocumentType(source.type) ? source.type : "other",
                name,
                size: typeof source.size === "number" && Number.isFinite(source.size) ? source.size : 0,
                uploadedAt,
                status: isDocumentStatus(source.status) ? source.status : "pending",
            };

            if (typeof source.owner === "string" && source.owner.trim()) {
                document.owner = source.owner.trim();
            }

            if (typeof source.slot === "string" && source.slot.trim()) {
                document.slot = source.slot.trim();
            }

            return [document];
        })
        .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
}

function getApplicationDocumentsErrorMessage(rawMessage?: string, action: "save" | "delete" | "review" = "save") {
    const message = (rawMessage || "").toLowerCase();
    const isPermissionError =
        message.includes("permission denied") ||
        message.includes("row-level security") ||
        message.includes("violates row-level security policy");
    const isMissingDocumentsColumn =
        message.includes("documents") &&
        (message.includes("schema cache") || message.includes("column"));
    const isMissingDocumentReviewFunction =
        message.includes("update_application_document_status") &&
        (message.includes("schema cache") || message.includes("function"));

    if (isMissingDocumentsColumn) {
        return "Application document storage is not set up yet. Run the latest database migrations and try again.";
    }

    if (isMissingDocumentReviewFunction) {
        return "Application document review is not set up yet. Run the latest database migrations and try again.";
    }

    if (isPermissionError) {
        if (action === "delete") {
            return "You do not have permission to delete application documents right now. Please contact support or run the latest database migrations.";
        }

        if (action === "review") {
            return "You do not have permission to review application documents right now. Please contact support or run the latest database migrations.";
        }

        return "You do not have permission to save application documents right now. Please contact support or run the latest database migrations.";
    }

    return rawMessage || "An unexpected error occurred.";
}

export async function getScholarDashboardData(scholarId: string) {
    const supabase = await createSupabaseServerClient();

    const [
        profileRes,
        milestonesRes,
        announcementsRes,
        impactRes,
        fundingRes,
        sessionsRes
    ] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", scholarId).single(),
        supabase.from("milestones").select("*").eq("scholar_id", scholarId).order("due_date", { ascending: true }),
        supabase.from("announcements").select("*").order("created_at", { ascending: false }).limit(5),
        supabase.from("impact_metrics").select("*").eq("scholar_id", scholarId),
        supabase.from("funding_records").select("*").eq("scholar_id", scholarId),
        supabase.from("mentor_sessions").select("*").eq("scholar_id", scholarId).order("date", { ascending: false }).limit(3)
    ]);

    return {
        profile: profileRes.data,
        milestones: milestonesRes.data || [],
        announcements: announcementsRes.data || [],
        impactMetrics: impactRes.data || [],
        fundingRecords: fundingRes.data || [],
        mentorSessions: sessionsRes.data || [],
    };
}

export async function getAdminDashboardData() {
    const supabase = await createSupabaseServerClient();

    const [
        scholarsCount,
        applicantsCount,
        donorsCount,
        applicationsRes,
        cohortsRes,
        programsRes,
        fundingRes
    ] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "scholar"),
        supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "applicant"),
        supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "donor"),
        supabase.from("applications").select("*, profiles(first_name, last_name, email)").order("created_at", { ascending: false }).limit(10),
        supabase.from("cohorts").select("*, programs(name)").order("year", { ascending: false }),
        supabase.from("programs").select("*"),
        supabase.from("donor_details").select("commitment")
    ]);

    const counts = {
        scholars: scholarsCount.count || 0,
        applicants: applicantsCount.count || 0,
        donors: donorsCount.count || 0,
    };

    const totalFunding = fundingRes.data?.reduce((sum, d) => sum + (Number(d.commitment) || 0), 0) || 0;

    return {
        counts,
        totalFunding,
        applications: applicationsRes.data || [],
        cohorts: cohortsRes.data || [],
        programs: programsRes.data || [],
    };
}

export async function getDonorDashboardData(donorId: string) {
    const supabase = await createSupabaseServerClient();

    const [
        profileRes,
        detailsRes,
        fundingRes,
        impactRes
    ] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", donorId).single(),
        supabase.from("donor_details").select("*").eq("id", donorId).single(),
        supabase.from("funding_records").select("*, programs(name)").eq("sponsor_id", donorId),
        supabase.from("impact_metrics").select("*").limit(10) // Showing global impact for donors
    ]);

    const scholarIds = Array.from(new Set(
        (fundingRes.data || [])
            .map((fr: any) => fr.scholar_id)
            .filter(Boolean)
    ));

    let sponsoredScholars: any[] = [];
    if (scholarIds.length > 0) {
        const { data } = await supabase.from("profiles").select("*").in("id", scholarIds);
        sponsoredScholars = data || [];
    }

    return {
        profile: { ...profileRes.data, ...detailsRes.data },
        fundingRecords: fundingRes.data || [],
        sponsoredScholars,
        impactMetrics: impactRes.data || [],
    };
}

export async function getScholarAcademicJourney(scholarId: string) {
    const supabase = await createSupabaseServerClient();

    const [coursesRes, termsRes, profileRes] = await Promise.all([
        supabase.from("courses").select("*").eq("scholar_id", scholarId).order("created_at", { ascending: false }),
        supabase.from("academic_terms").select("*").eq("scholar_id", scholarId).order("created_at", { ascending: false }),
        supabase.from("profiles").select("*").eq("id", scholarId).single()
    ]);

    return {
        courses: coursesRes.data || [],
        terms: termsRes.data || [],
        profile: profileRes.data,
    };
}

export async function getScholarProgressReports(scholarId: string) {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.from("progress_reports").select("*").eq("scholar_id", scholarId).order("submitted_on", { ascending: false });
    return data || [];
}

export async function getScholarDocuments(scholarId: string) {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.from("documents").select("*").eq("scholar_id", scholarId).order("updated_on", { ascending: false });
    return data || [];
}

export async function getAdminUsers() {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching admin users:", error);
        return [];
    }
    return data;
}

export async function getAdminSponsors() {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from("profiles")
        .select(`
      *,
      donor_details (*)
    `)
        .eq("role", "donor")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching admin sponsors:", error);
        return [];
    }
    return data;
}

export async function getAdminPrograms() {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from("programs")
        .select("*")
        .order("name", { ascending: true });

    if (error) {
        console.error("Error fetching admin programs:", error);
        return [];
    }
    return data;
}

export async function getAdminCohorts() {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from("cohorts")
        .select(`
      *,
      programs (name)
    `)
        .order("year", { ascending: false });

    if (error) {
        console.error("Error fetching admin cohorts:", error);
        return [];
    }
    return data;
}

export async function getAdminFundingLedger() {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from("funding_records")
        .select(`
      *,
      profiles (first_name, last_name),
      programs (name)
    `)
        .order("date", { ascending: false });

    if (error) {
        console.error("Error fetching admin funding ledger:", error);
        return [];
    }
    return data;
}

export async function getAdminApplications() {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from("applications")
        .select(`
      *,
      profiles (first_name, last_name, email)
    `)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching admin applications:", error);
        return [];
    }
    return data;
}

export async function getAdminScholars() {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "scholar")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching admin scholars:", error);
        return [];
    }
    return data;
}

export async function getAdminApplicationById(id: string) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from("applications")
        .select(`
      *,
      profiles (first_name, last_name, email, state_of_origin)
    `)
        .eq("id", id)
        .single();

    if (error) {
        console.error("Error fetching admin application by id:", error);
        return null;
    }

    return data
        ? {
            ...data,
            documents: normalizeApplicationDocuments(data.documents),
        }
        : null;
}

export async function getApplicantDashboardData(userId: string) {
    const supabase = await createSupabaseServerClient();

    const [
        profileRes,
        applicationRes,
        announcementsRes,
        notificationsRes,
        deadlinesRes,
    ] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
        supabase
            .from("applications")
            .select("*, programs(name)")
            .eq("applicant_id", userId)
            .order("updated_at", { ascending: false })
            .limit(1)
            .maybeSingle(),
        supabase.from("announcements").select("*").or("audience.eq.all,audience.eq.applicants").order("created_at", { ascending: false }).limit(5),
        supabase.from("notifications").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(5),
        supabase.from("deadlines").select("*").or(`user_id.is.null,user_id.eq.${userId}`).order("due_date", { ascending: true }).limit(5),
    ]);

    let applicationData = applicationRes.data;

    if (applicationRes.error) {
        // Fallback when relational select fails (for example, missing relationship metadata in some environments).
        const fallbackApplicationRes = await supabase
            .from("applications")
            .select("*")
            .eq("applicant_id", userId)
            .order("updated_at", { ascending: false })
            .limit(1)
            .maybeSingle();

        if (fallbackApplicationRes.error) {
            console.error("Error fetching applicant application:", fallbackApplicationRes.error);
        } else {
            applicationData = fallbackApplicationRes.data;
        }
    }

    const documents = normalizeApplicationDocuments(applicationData?.documents);

    const application = applicationData
        ? {
            ...applicationData,
            step: applicationData.current_step,
            documents,
        }
        : null;

    const deadlines = (deadlinesRes.data || []).map((deadline) => ({
        ...deadline,
        days_left: getDaysUntilDueDate(deadline.due_date),
    }));

    return {
        profile: profileRes.data,
        application,
        announcements: announcementsRes.data || [],
        notifications: notificationsRes.data || [],
        deadlines,
        documents,
    };
}

export async function getNotifications(userId: string) {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
    return data || [];
}

export async function getDeadlines(userId: string) {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase
        .from("deadlines")
        .select("*")
        .or(`user_id.is.null,user_id.eq.${userId}`)
        .order("due_date", { ascending: true });
    return data || [];
}
export async function getPublicHomeData() {
    const supabase = await createSupabaseServerClient();

    const [
        impactRes,
        newsRes,
        partnersRes
    ] = await Promise.all([
        supabase.from("impact_metrics").select("*").is("scholar_id", null).limit(4),
        supabase.from("announcements").select("*").eq("audience", "all").order("created_at", { ascending: false }).limit(3),
        supabase.from("partners").select("*").limit(8)
    ]);

    return {
        impactMetrics: impactRes.data || [],
        news: newsRes.data || [],
        partners: partnersRes.data || []
    };
}

export async function getPublicPrograms() {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.from("programs").select("*").order("name", { ascending: true });
    return data || [];
}

export async function getPublicScholars() {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.from("profiles").select("*").eq("role", "scholar").limit(20);
    return data || [];
}

export async function getPublicImpactDetails() {
    const supabase = await createSupabaseServerClient();

    const [impactMetricsRes, scholarsRes] = await Promise.all([
        supabase.from("impact_metrics").select("*").is("scholar_id", null),
        supabase.from("profiles").select("*").eq("role", "scholar").limit(4)
    ]);

    return {
        impactMetrics: impactMetricsRes.data || [],
        scholars: scholarsRes.data || []
    };
}

export async function changePassword(newPassword: string): Promise<{ error: string | null }> {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return { error: error.message };
    return { error: null };
}

export async function withdrawApplication(userId: string): Promise<{ error: string | null }> {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
        .from("applications")
        .update({ status: "withdrawn" })
        .eq("applicant_id", userId);
    if (error) return { error: error.message };
    return { error: null };
}

export async function updateProfile(
    userId: string,
    data: { first_name?: string; last_name?: string; phone?: string; state_of_origin?: string; avatar_url?: string }
): Promise<{ error: string | null }> {
    const supabase = await createSupabaseServerClient();
    const updatePayload: Record<string, string> = {};
    if (data.first_name !== undefined) updatePayload.first_name = data.first_name;
    if (data.last_name !== undefined) updatePayload.last_name = data.last_name;
    if (data.phone !== undefined) updatePayload.phone = data.phone;
    if (data.state_of_origin !== undefined) updatePayload.state_of_origin = data.state_of_origin;
    if (data.avatar_url !== undefined) updatePayload.avatar_url = data.avatar_url;

    const { error } = await supabase
        .from("profiles")
        .update(updatePayload)
        .eq("id", userId);
    if (error) return { error: error.message };
    return { error: null };
}

export async function submitApplication(): Promise<{ error: string | null }> {
    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        return { error: userError?.message || "You must be signed in to submit your application." };
    }

    const { data: application, error: fetchError } = await supabase
        .from("applications")
        .select("id, status, current_step")
        .eq("applicant_id", user.id)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

    if (fetchError) {
        return { error: getApplicationPermissionErrorMessage(fetchError.message, "submit") };
    }

    if (!application) {
        return { error: "No application found to submit." };
    }

    if (application.status === "submitted") {
        return { error: null };
    }

    const timestamp = new Date().toISOString();
    const { error } = await supabase
        .from("applications")
        .update({
            status: "submitted",
            current_step: Math.max(application.current_step ?? 1, 5),
            submitted_at: timestamp,
            last_saved_at: timestamp,
        })
        .eq("id", application.id);

    if (error) {
        return { error: getApplicationPermissionErrorMessage(error.message, "submit") };
    }

    return { error: null };
}

interface SaveApplicationDocumentInput {
    type: DocumentType;
    slot: string;
    name: string;
    size: number;
}

export async function saveApplicationDocument(
    input: SaveApplicationDocumentInput
): Promise<{ error: string | null }> {
    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        return { error: userError?.message || "You must be signed in to upload documents." };
    }

    const sanitizedSlot = input.slot.trim();
    const sanitizedName = input.name.trim();
    if (!isDocumentType(input.type)) {
        return { error: "Invalid document type." };
    }

    if (!sanitizedSlot) {
        return { error: "Document slot is required." };
    }

    if (!sanitizedName) {
        return { error: "Document name is required." };
    }

    if (!Number.isFinite(input.size) || input.size <= 0) {
        return { error: "Document size must be greater than 0." };
    }

    const { data: existingApplication, error: fetchError } = await supabase
        .from("applications")
        .select("id, current_step, documents")
        .eq("applicant_id", user.id)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

    if (fetchError) {
        return { error: getApplicationDocumentsErrorMessage(fetchError.message, "save") };
    }

    const nextDocument: UploadedDocument = {
        id: crypto.randomUUID(),
        type: input.type,
        slot: sanitizedSlot,
        name: sanitizedName,
        size: input.size,
        uploadedAt: new Date().toISOString(),
        status: "pending",
        owner: "Applicant",
    };

    const nextDocumentKey = getApplicationDocumentKey(nextDocument);

    const nextDocuments = [
        nextDocument,
        ...normalizeApplicationDocuments(existingApplication?.documents).filter(
            (document) => getApplicationDocumentKey(document) !== nextDocumentKey
        ),
    ];

    const timestamp = new Date().toISOString();
    const writeResult = existingApplication
        ? await supabase
            .from("applications")
            .update({
                current_step: Math.max(existingApplication.current_step ?? 1, 4),
                last_saved_at: timestamp,
                documents: nextDocuments,
            })
            .eq("id", existingApplication.id)
        : await supabase.from("applications").insert({
            applicant_id: user.id,
            current_step: 4,
            last_saved_at: timestamp,
            documents: nextDocuments,
        });

    if (writeResult.error) {
        return { error: getApplicationDocumentsErrorMessage(writeResult.error.message, "save") };
    }

    return { error: null };
}

export async function deleteApplicationDocument(documentId: string): Promise<{ error: string | null }> {
    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        return { error: userError?.message || "You must be signed in to delete documents." };
    }

    const sanitizedDocumentId = documentId.trim();
    if (!sanitizedDocumentId) {
        return { error: "Document ID is required." };
    }

    const { data: existingApplication, error: fetchError } = await supabase
        .from("applications")
        .select("id, current_step, documents")
        .eq("applicant_id", user.id)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

    if (fetchError) {
        return { error: getApplicationDocumentsErrorMessage(fetchError.message, "delete") };
    }

    if (!existingApplication) {
        return { error: "No application was found for this account." };
    }

    const nextDocuments = normalizeApplicationDocuments(existingApplication.documents).filter(
        (document) => document.id !== sanitizedDocumentId
    );

    const { error } = await supabase
        .from("applications")
        .update({
            current_step: Math.max(existingApplication.current_step ?? 1, 4),
            last_saved_at: new Date().toISOString(),
            documents: nextDocuments,
        })
        .eq("id", existingApplication.id);

    if (error) {
        return { error: getApplicationDocumentsErrorMessage(error.message, "delete") };
    }

    return { error: null };
}

export async function updateApplicationDocumentStatus(
    applicationId: string,
    documentId: string,
    status: DocumentStatus
): Promise<{ error: string | null }> {
    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        return { error: userError?.message || "You must be signed in to review documents." };
    }

    const sanitizedApplicationId = applicationId.trim();
    const sanitizedDocumentId = documentId.trim();

    if (!sanitizedApplicationId) {
        return { error: "Application ID is required." };
    }

    if (!sanitizedDocumentId) {
        return { error: "Document ID is required." };
    }

    if (!isDocumentStatus(status)) {
        return { error: "Invalid document status." };
    }

    const { error } = await supabase.rpc("update_application_document_status", {
        p_application_id: sanitizedApplicationId,
        p_document_id: sanitizedDocumentId,
        p_status: status,
    });

    if (error) {
        return { error: getApplicationDocumentsErrorMessage(error.message, "review") };
    }

    return { error: null };
}

type ApplicationStepColumn = "personal_info" | "academic_background" | "essays";

export async function saveApplicationStep(
    step: number,
    stepData: Record<string, unknown>,
    isNext = false
): Promise<{ error: string | null }> {
    const stepColumnMap: Record<number, ApplicationStepColumn> = {
        1: "personal_info",
        2: "academic_background",
        3: "essays",
    };

    const stepColumn = stepColumnMap[step];
    if (!stepColumn) {
        return { error: "Invalid application step." };
    }

    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        return { error: userError?.message || "You must be signed in to save this step." };
    }

    if (step === 1) {
        const profileUpdatePayload: Record<string, string> = {};

        const addIfPresentString = (inputKey: string, profileKey: string) => {
            if (!Object.prototype.hasOwnProperty.call(stepData, inputKey)) return;
            const rawValue = stepData[inputKey];
            if (typeof rawValue !== "string") return;
            profileUpdatePayload[profileKey] = rawValue.trim();
        };

        addIfPresentString("firstName", "first_name");
        addIfPresentString("lastName", "last_name");
        addIfPresentString("phone", "phone");
        addIfPresentString("stateOfOrigin", "state_of_origin");

        if (Object.keys(profileUpdatePayload).length > 0) {
            const { error: profileUpdateError } = await supabase
                .from("profiles")
                .update(profileUpdatePayload)
                .eq("id", user.id);

            if (profileUpdateError) {
                console.error("Error updating applicant profile during step save:", profileUpdateError);
                return { error: getProfileSaveErrorMessage(profileUpdateError.message) };
            }
        }
    }

    const { data: existingApplication, error: fetchError } = await supabase
        .from("applications")
        .select("id, current_step")
        .eq("applicant_id", user.id)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

    if (fetchError) {
        return { error: getApplicationPermissionErrorMessage(fetchError.message, "save") };
    }

    const targetStep = isNext ? step + 1 : step;
    const nextCurrentStep = Math.max(existingApplication?.current_step ?? 1, targetStep);
    const payload: Record<string, unknown> = {
        applicant_id: user.id,
        current_step: nextCurrentStep,
        last_saved_at: new Date().toISOString(),
        [stepColumn]: stepData,
    };

    const writeResult = existingApplication
        ? await supabase.from("applications").update(payload).eq("id", existingApplication.id)
        : await supabase.from("applications").insert(payload);

    if (writeResult.error) {
        return { error: getApplicationPermissionErrorMessage(writeResult.error.message, "save") };
    }

    return { error: null };
}

export async function updateApplicationDecision(
    applicationId: string,
    decision: ApplicationStatus,
    notes: string,
    scores: Record<string, number>
): Promise<{ error: string | null }> {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        return { error: "Unauthorized" };
    }

    const { error: appError, data: application } = await supabase
        .from("applications")
        .update({ status: decision, review_notes: notes })
        .eq("id", applicationId)
        .select()
        .single();

    if (appError) {
        return { error: appError.message };
    }

    if (decision === "accepted" && application) {
        const { error: profileError } = await supabase
            .from("profiles")
            .update({ role: "scholar" })
            .eq("id", application.applicant_id);

        if (profileError) {
            return { error: "Application updated, but failed to update user role." };
        }
    }

    return { error: null };
}

export async function allocateFunding(
    sponsorId: string,
    scholarId: string,
    amount: number,
    programId?: string
): Promise<{ error: string | null }> {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        return { error: "Unauthorized" };
    }

    const payload: any = {
        sponsor_id: sponsorId,
        scholar_id: scholarId,
        amount,
        type: "disbursement",
        status: "completed",
    };

    if (programId) {
        payload.program_id = programId;
    }

    const { error } = await supabase
        .from("funding_records")
        .insert(payload);

    if (error) {
        return { error: error.message };
    }

    return { error: null };
}
