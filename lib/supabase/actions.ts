"use server";

import type { SupabaseClient } from "@supabase/supabase-js";
import { createSupabaseAdminClient } from "./admin";
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
type ServerSupabaseClient = Awaited<ReturnType<typeof createSupabaseServerClient>>;
type PublicSupabaseClient = SupabaseClient<any, "public", any>;

function getProgramName(program: unknown): string {
    if (!program || typeof program !== "object") return "";

    const source = program as Record<string, unknown>;
    const name = typeof source.name === "string" ? source.name.trim() : "";
    if (name) return name;

    return typeof source.title === "string" ? source.title.trim() : "";
}

function normalizeProgramRecord<T>(program: T): T {
    const normalizedName = getProgramName(program);

    if (!program || typeof program !== "object" || !normalizedName) {
        return program;
    }

    const source = program as Record<string, unknown>;
    if (typeof source.name === "string" && source.name.trim().length > 0) {
        return program;
    }

    return {
        ...source,
        name: normalizedName,
    } as T;
}

function normalizeProgramsList<T>(programs: T[] | null | undefined): T[] {
    return (programs || []).map((program) => normalizeProgramRecord(program));
}

function normalizeProgramsRelation<T>(rows: T[] | null | undefined): T[] {
    return (rows || []).map((row) => {
        if (!row || typeof row !== "object") {
            return row;
        }

        const source = row as Record<string, unknown>;
        if (!source.programs || typeof source.programs !== "object") {
            return row;
        }

        return {
            ...source,
            programs: normalizeProgramRecord(source.programs),
        } as T;
    });
}

function getNumericValue(value: unknown): number | null {
    if (typeof value === "number" && Number.isFinite(value)) {
        return value;
    }

    if (typeof value === "string") {
        const trimmedValue = value.trim();
        if (!trimmedValue) {
            return null;
        }

        const parsedValue = Number(trimmedValue);
        return Number.isFinite(parsedValue) ? parsedValue : null;
    }

    return null;
}

function getTrimmedString(value: unknown): string | null {
    if (typeof value !== "string") {
        return null;
    }

    const trimmedValue = value.trim();
    return trimmedValue ? trimmedValue : null;
}

function normalizeCohortRecord<T>(cohort: T): T {
    if (!cohort || typeof cohort !== "object") {
        return cohort;
    }

    const source = cohort as Record<string, unknown>;
    const normalizedPrograms =
        source.programs && typeof source.programs === "object"
            ? normalizeProgramRecord(source.programs)
            : null;
    const reviewCompletionPercentage =
        getNumericValue(source.review_completion_percentage) ??
        getNumericValue(source.review_completion) ??
        0;
    const fundingReleased =
        getNumericValue(source.funding_released) ??
        0;
    const readinessStatus =
        getTrimmedString(source.readiness_status) ??
        getTrimmedString(source.readiness) ??
        "planned";

    return {
        ...source,
        programs: normalizedPrograms,
        review_completion_percentage: reviewCompletionPercentage,
        funding_released: fundingReleased,
        readiness_status: readinessStatus,
    } as T;
}

function normalizeCohortsList<T>(rows: T[] | null | undefined): T[] {
    return (rows || []).map((row) => normalizeCohortRecord(row));
}

function isMissingRelationshipError(error: unknown, fromTable: string, toTable: string): boolean {
    if (!error || typeof error !== "object") {
        return false;
    }

    const source = error as Record<string, unknown>;
    const message = typeof source.message === "string" ? source.message : "";
    const details = typeof source.details === "string" ? source.details : "";

    if (source.code !== "PGRST200") {
        return false;
    }

    return (
        (message.includes(`'${fromTable}'`) && message.includes(`'${toTable}'`)) ||
        (details.includes(`'${fromTable}'`) && details.includes(`'${toTable}'`))
    );
}

function isTablePermissionError(error: unknown, table: string): boolean {
    if (!error || typeof error !== "object") {
        return false;
    }

    const source = error as Record<string, unknown>;
    const message = typeof source.message === "string"
        ? source.message.toLocaleLowerCase()
        : "";

    return source.code === "42501" && message.includes(`permission denied for table ${table.toLocaleLowerCase()}`);
}

async function runWithTablePermissionFallback<T>(
    supabase: ServerSupabaseClient,
    table: string,
    query: (client: PublicSupabaseClient) => Promise<{ data: T; error: unknown }>
): Promise<{ data: T; error: unknown }> {
    const primaryResult = await query(supabase);

    if (!isTablePermissionError(primaryResult.error, table)) {
        return primaryResult;
    }

    return await query(createSupabaseAdminClient());
}

async function getCohortYearMap(
    supabase: ServerSupabaseClient,
    cohortIds: Array<string | null | undefined>
): Promise<Map<string, string | number | null>> {
    const uniqueCohortIds = Array.from(
        new Set(
            cohortIds
                .map((cohortId) => getTrimmedString(cohortId))
                .filter((cohortId): cohortId is string => Boolean(cohortId))
        )
    );

    if (uniqueCohortIds.length === 0) {
        return new Map();
    }

    const { data, error } = await runWithTablePermissionFallback(
        supabase,
        "cohorts",
        (client) =>
            client
                .from("cohorts")
                .select("id, year")
                .in("id", uniqueCohortIds)
    );

    if (error) {
        console.error("Error fetching cohort years:", formatSupabaseError(error));
        return new Map();
    }

    return new Map(
        (data || []).flatMap((row) => {
            if (!row || typeof row !== "object") {
                return [];
            }

            const source = row as Record<string, unknown>;
            const id = getTrimmedString(source.id);
            if (!id) {
                return [];
            }

            return [[id, getCohortYear(source)]];
        })
    );
}

async function hydrateRowsWithCohortYears<T>(
    supabase: ServerSupabaseClient,
    rows: T[] | null | undefined
): Promise<T[]> {
    const cohortYearMap = await getCohortYearMap(
        supabase,
        (rows || []).flatMap((row) => {
            if (!row || typeof row !== "object") {
                return [];
            }

            const source = row as Record<string, unknown>;
            const hasCohortYear = source.cohort_year !== undefined && source.cohort_year !== null;
            const cohortId = getTrimmedString(source.cohort_id);

            return !hasCohortYear && cohortId ? [cohortId] : [];
        })
    );

    if (cohortYearMap.size === 0) {
        return rows || [];
    }

    return (rows || []).map((row) => {
        if (!row || typeof row !== "object") {
            return row;
        }

        const source = row as Record<string, unknown>;
        const cohortId = getTrimmedString(source.cohort_id);

        if (!cohortId || !cohortYearMap.has(cohortId)) {
            return row;
        }

        return {
            ...source,
            cohort_year: cohortYearMap.get(cohortId) ?? null,
        } as T;
    });
}

async function getAdminCohortsData(
    supabase: ServerSupabaseClient
) {
    const cohortsWithProgramsRes = await runWithTablePermissionFallback(
        supabase,
        "cohorts",
        (client) =>
            client
                .from("cohorts")
                .select(`
      *,
      programs (*)
    `)
                .order("year", { ascending: false })
    );

    if (!cohortsWithProgramsRes.error) {
        return normalizeCohortsList(cohortsWithProgramsRes.data);
    }

    if (!isMissingRelationshipError(cohortsWithProgramsRes.error, "cohorts", "programs")) {
        console.error(
            "Error fetching admin cohorts:",
            formatSupabaseError(cohortsWithProgramsRes.error)
        );
        return [];
    }

    const fallbackCohortsRes = await runWithTablePermissionFallback(
        supabase,
        "cohorts",
        (client) =>
            client
                .from("cohorts")
                .select("*")
                .order("year", { ascending: false })
    );

    if (fallbackCohortsRes.error) {
        console.error(
            "Error fetching admin cohorts:",
            formatSupabaseError(fallbackCohortsRes.error)
        );
        return [];
    }

    return normalizeCohortsList(fallbackCohortsRes.data);
}

function getCohortYear(cohort: unknown): string | number | null {
    if (!cohort || typeof cohort !== "object") return null;

    const source = cohort as Record<string, unknown>;
    if (typeof source.year === "number" || typeof source.year === "string") {
        return source.year;
    }

    return null;
}

function getReviewScoreTotal(reviewScores: unknown): number | null {
    if (!reviewScores || typeof reviewScores !== "object") {
        return null;
    }

    const scores = Object.values(reviewScores as Record<string, unknown>)
        .filter((value): value is number => typeof value === "number" && Number.isFinite(value));

    if (scores.length === 0) {
        return null;
    }

    return scores.reduce((sum, value) => sum + value, 0);
}

function normalizeAdminApplicationRecord<T>(application: T): T {
    if (!application || typeof application !== "object") {
        return application;
    }

    const source = application as Record<string, unknown>;
    const programChoice = (source.programChoice || source.program_choice || getProgramChoiceFromAcademicBackground(source.academic_background)) as string | null;
    const normalizedPrograms =
        source.programs && typeof source.programs === "object"
            ? normalizeProgramRecord(source.programs)
            : programChoice
                ? { name: programChoice }
                : source.programs;
    const normalizedDocuments = normalizeApplicationDocuments(source.documents);
    const normalizedScore =
        typeof source.score === "number" && Number.isFinite(source.score)
            ? source.score
            : getReviewScoreTotal(source.review_scores);
    const normalizedCohortYear =
        source.cohort_year ?? getCohortYear(source.cohorts);

    return {
        ...source,
        programs: normalizedPrograms,
        documents: normalizedDocuments,
        score: normalizedScore,
        cohort_year: normalizedCohortYear,
        program_name: getProgramName(normalizedPrograms) || programChoice,
    } as T;
}

const REVIEW_QUEUE_STATUSES = new Set<ApplicationStatus>([
    "submitted",
    "under_review",
    "shortlisted",
    "interview_stage",
]);

const SUBMITTED_APPLICATION_STATUSES = new Set<ApplicationStatus>([
    "submitted",
    "under_review",
    "shortlisted",
    "interview_stage",
    "accepted",
    "rejected",
]);

const REVIEW_COMPLETED_STATUSES = new Set<ApplicationStatus>([
    "shortlisted",
    "interview_stage",
    "accepted",
    "rejected",
]);

const ACCEPTED_APPLICATION_STATUSES = new Set<ApplicationStatus>(["accepted"]);

function getProgramChoiceFromAcademicBackground(value: unknown): string | null {
    if (!value || typeof value !== "object") {
        return null;
    }

    const source = value as Record<string, unknown>;
    return getTrimmedString(source.programChoice);
}

function normalizeComparisonText(value: unknown): string {
    return (getTrimmedString(value) || "")
        .toLocaleLowerCase()
        .replace(/\s+/g, " ");
}

function getApplicationStatusValue(value: unknown): ApplicationStatus | null {
    if (typeof value !== "string") {
        return null;
    }

    const normalizedStatus = value.trim() as ApplicationStatus;
    return normalizedStatus ? normalizedStatus : null;
}

function isSubmittedApplicationStatus(value: unknown): boolean {
    const status = getApplicationStatusValue(value);
    return status ? SUBMITTED_APPLICATION_STATUSES.has(status) : false;
}

function isReviewQueueApplicationStatus(value: unknown): boolean {
    const status = getApplicationStatusValue(value);
    return status ? REVIEW_QUEUE_STATUSES.has(status) : false;
}

function isReviewCompletedApplicationStatus(value: unknown): boolean {
    const status = getApplicationStatusValue(value);
    return status ? REVIEW_COMPLETED_STATUSES.has(status) : false;
}

function isAcceptedApplicationStatus(value: unknown): boolean {
    const status = getApplicationStatusValue(value);
    return status ? ACCEPTED_APPLICATION_STATUSES.has(status) : false;
}

async function resolveProgramAndCohortSelection(
    supabase: ServerSupabaseClient,
    programChoiceValue: unknown
): Promise<{ programId: string | null; cohortId: string | null; programName: string | null }> {
    const desiredProgramName = getTrimmedString(programChoiceValue);
    if (!desiredProgramName) {
        return {
            programId: null,
            cohortId: null,
            programName: null,
        };
    }

    const { data: programs, error: programsError } = await supabase
        .from("programs")
        .select("*");

    if (programsError) {
        console.error(
            "Error resolving program selection:",
            formatSupabaseError(programsError)
        );
        return {
            programId: null,
            cohortId: null,
            programName: desiredProgramName,
        };
    }

    const matchedProgram = sortProgramsByName(normalizeProgramsList(programs)).find((program) =>
        normalizeComparisonText(getProgramName(program)) === normalizeComparisonText(desiredProgramName)
    );

    if (!matchedProgram || typeof (matchedProgram as Record<string, unknown>).id !== "string") {
        return {
            programId: null,
            cohortId: null,
            programName: desiredProgramName,
        };
    }

    const programId = ((matchedProgram as Record<string, unknown>).id as string).trim();
    const { data: latestCohort, error: cohortError } = await runWithTablePermissionFallback(
        supabase,
        "cohorts",
        (client) =>
            client
                .from("cohorts")
                .select("id")
                .eq("program_id", programId)
                .order("year", { ascending: false })
                .limit(1)
                .maybeSingle()
    );

    if (cohortError) {
        console.error(
            "Error resolving cohort selection:",
            formatSupabaseError(cohortError)
        );
    }

    return {
        programId,
        cohortId: typeof latestCohort?.id === "string" ? latestCohort.id : null,
        programName: getProgramName(matchedProgram) || desiredProgramName,
    };
}

function mergeAdminCohortsWithApplicationRollups<T>(
    cohorts: T[] | null | undefined,
    applications: Array<Record<string, unknown>>
): T[] {
    const normalizedCohorts = normalizeCohortsList(cohorts);
    const directApplicationsByCohortId = new Map<string, Array<Record<string, unknown>>>();
    const unassignedApplicationsByProgramId = new Map<string, Array<Record<string, unknown>>>();
    const cohortCountByProgramId = new Map<string, number>();

    normalizedCohorts.forEach((cohort) => {
        if (!cohort || typeof cohort !== "object") {
            return;
        }

        const source = cohort as Record<string, unknown>;
        const programId = getTrimmedString(source.program_id);
        if (!programId) {
            return;
        }

        cohortCountByProgramId.set(programId, (cohortCountByProgramId.get(programId) || 0) + 1);
    });

    applications.forEach((application) => {
        const cohortId = getTrimmedString(application.cohort_id);
        const programId = getTrimmedString(application.program_id);

        if (cohortId) {
            const existing = directApplicationsByCohortId.get(cohortId) || [];
            existing.push(application);
            directApplicationsByCohortId.set(cohortId, existing);
            return;
        }

        if (programId) {
            const existing = unassignedApplicationsByProgramId.get(programId) || [];
            existing.push(application);
            unassignedApplicationsByProgramId.set(programId, existing);
        }
    });

    return normalizedCohorts.map((cohort) => {
        if (!cohort || typeof cohort !== "object") {
            return cohort;
        }

        const source = cohort as Record<string, unknown>;
        const cohortId = getTrimmedString(source.id);
        const programId = getTrimmedString(source.program_id);
        const directlyAssignedApplications = cohortId
            ? directApplicationsByCohortId.get(cohortId) || []
            : [];
        const legacyProgramAssignedApplications =
            programId && cohortCountByProgramId.get(programId) === 1
                ? unassignedApplicationsByProgramId.get(programId) || []
                : [];
        const combinedApplications = Array.from(
            new Map(
                [...directlyAssignedApplications, ...legacyProgramAssignedApplications]
                    .map((application) => [getTrimmedString(application.id) || crypto.randomUUID(), application])
            ).values()
        );
        const hasMappedApplications = combinedApplications.length > 0;
        const derivedApplicantsCount = combinedApplications.filter((application) =>
            isSubmittedApplicationStatus(application.status)
        ).length;
        const derivedActiveScholarsCount = combinedApplications.filter((application) =>
            isAcceptedApplicationStatus(application.status)
        ).length;
        const derivedReviewCompletion =
            derivedApplicantsCount > 0
                ? Math.round(
                    (combinedApplications.filter((application) =>
                        isReviewCompletedApplicationStatus(application.status)
                    ).length / derivedApplicantsCount) * 100
                )
                : 0;
        const derivedReadinessStatus =
            derivedActiveScholarsCount > 0
                ? "live"
                : combinedApplications.some((application) =>
                    isReviewQueueApplicationStatus(application.status)
                )
                    ? "review"
                    : "planned";

        return normalizeCohortRecord({
            ...source,
            applicants_count: hasMappedApplications
                ? derivedApplicantsCount
                : getNumericValue(source.applicants_count) ?? 0,
            active_scholars_count: hasMappedApplications
                ? derivedActiveScholarsCount
                : getNumericValue(source.active_scholars_count) ?? 0,
            review_completion_percentage: hasMappedApplications
                ? derivedReviewCompletion
                : getNumericValue(source.review_completion_percentage) ??
                getNumericValue(source.review_completion) ??
                0,
            readiness_status:
                getTrimmedString(source.readiness_status) ??
                getTrimmedString(source.readiness) ??
                (hasMappedApplications ? derivedReadinessStatus : "planned"),
        }) as T;
    });
}

async function fetchAdminApplicationsData(
    supabase: ServerSupabaseClient
) {
    const { data, error } = await supabase
        .from("applications")
        .select(`
      *,
      profiles (first_name, last_name, email),
      cohorts (year),
      programs (*)
    `)
        .order("created_at", { ascending: false });

    if (!error) {
        return (data || []).map((application) => normalizeAdminApplicationRecord(application));
    }

    const canRetryWithoutCohortsRelation =
        isTablePermissionError(error, "cohorts") ||
        isMissingRelationshipError(error, "applications", "cohorts");

    if (!canRetryWithoutCohortsRelation) {
        console.error(
            "Error fetching admin applications:",
            formatSupabaseError(error)
        );
        return [];
    }

    const fallbackRes = await supabase
        .from("applications")
        .select(`
      *,
      profiles (first_name, last_name, email),
      programs (*)
    `)
        .order("created_at", { ascending: false });

    if (fallbackRes.error) {
        console.error(
            "Error fetching admin applications:",
            formatSupabaseError(fallbackRes.error)
        );
        return [];
    }

    const hydratedApplications = await hydrateRowsWithCohortYears(supabase, fallbackRes.data);
    return hydratedApplications.map((application) => normalizeAdminApplicationRecord(application));
}

function sortProgramsByName<T>(programs: T[]): T[] {
    return [...programs].sort((a, b) =>
        getProgramName(a).localeCompare(getProgramName(b), undefined, { sensitivity: "base" })
    );
}

function formatSupabaseError(error: unknown): string {
    if (!error || typeof error !== "object") {
        return String(error || "Unknown error");
    }

    const source = error as Record<string, unknown>;
    const parts = [
        typeof source.message === "string" ? `message=${source.message}` : "",
        typeof source.details === "string" && source.details ? `details=${source.details}` : "",
        typeof source.hint === "string" && source.hint ? `hint=${source.hint}` : "",
        typeof source.code === "string" && source.code ? `code=${source.code}` : "",
    ].filter(Boolean);

    if (parts.length > 0) {
        return parts.join(" | ");
    }

    try {
        return JSON.stringify(source);
    } catch {
        return "Unknown Supabase error";
    }
}

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
            const uploadedAtSource =
                typeof source.uploadedAt === "string"
                    ? source.uploadedAt
                    : typeof source.updated_on === "string"
                        ? source.updated_on
                        : typeof source.created_at === "string"
                            ? source.created_at
                            : "";

            if (!id || !name || !uploadedAtSource) {
                return [];
            }

            const normalizedDocument: UploadedDocument = {
                id,
                type: isDocumentType(source.type) ? source.type : "other",
                name,
                size: typeof source.size === "number" && Number.isFinite(source.size) ? source.size : 0,
                uploadedAt: uploadedAtSource,
                status: isDocumentStatus(source.status) ? source.status : "pending",
            };

            if (typeof source.slot === "string" && source.slot.trim()) {
                normalizedDocument.slot = source.slot.trim();
            }

            if (typeof source.owner === "string" && source.owner.trim()) {
                normalizedDocument.owner = source.owner.trim();
            }

            if (typeof source.url === "string" && source.url.trim()) {
                normalizedDocument.url = source.url.trim();
            }

            if (typeof source.publicId === "string" && source.publicId.trim()) {
                normalizedDocument.publicId = source.publicId.trim();
            }

            if (typeof source.mimeType === "string" && source.mimeType.trim()) {
                normalizedDocument.mimeType = source.mimeType.trim();
            }

            return [normalizedDocument];
        })
        .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
}

function getApplicationDocumentsErrorMessage(rawMessage?: string, action: "save" | "delete" = "save") {
    const message = (rawMessage || "").toLowerCase();
    const isPermissionError =
        message.includes("permission denied") ||
        message.includes("row-level security") ||
        message.includes("violates row-level security policy");
    const isMissingDocumentsColumn =
        message.includes("documents") &&
        (message.includes("schema cache") || message.includes("column"));

    if (isMissingDocumentsColumn) {
        return "Application document storage is not set up yet. Run the latest database migrations and try again.";
    }

    if (isPermissionError) {
        return action === "delete"
            ? "You do not have permission to delete application documents right now. Please contact support or run the latest database migrations."
            : "You do not have permission to save application documents right now. Please contact support or run the latest database migrations.";
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
        donorsCount,
        applications,
        baseCohorts,
        programsRes,
        fundingRes
    ] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "scholar"),
        supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "donor"),
        fetchAdminApplicationsData(supabase),
        getAdminCohortsData(supabase),
        supabase.from("programs").select("*"),
        supabase.from("donor_details").select("commitment")
    ]);

    const nonDraftApplications = applications.filter((application) =>
        application.status !== "draft"
    );
    const reviewQueueApplications = nonDraftApplications.filter((application) =>
        isReviewQueueApplicationStatus(application.status)
    );
    const cohorts = mergeAdminCohortsWithApplicationRollups(baseCohorts, applications);
    const averageReviewCompletion = cohorts.length > 0
        ? Math.round(
            cohorts.reduce((sum: number, cohort: Record<string, unknown>) =>
                sum + (getNumericValue(cohort.review_completion_percentage) || 0), 0
            ) / cohorts.length
        )
        : 0;
    const counts = {
        scholars: scholarsCount.count || 0,
        applicants: nonDraftApplications.length,
        donors: donorsCount.count || 0,
    };

    const totalFunding = fundingRes.data?.reduce((sum, d) => sum + (Number(d.commitment) || 0), 0) || 0;

    return {
        counts,
        applicationCounts: {
            total: applications.length,
            reviewQueue: reviewQueueApplications.length,
            drafts: applications.length - nonDraftApplications.length,
        },
        averageReviewCompletion,
        totalFunding,
        applications: applications.slice(0, 10), // Show everything recent, including drafts
        cohorts,
        programs: sortProgramsByName(normalizeProgramsList(programsRes.data)),
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
        supabase.from("funding_records").select("*, programs(*)").eq("sponsor_id", donorId),
        supabase.from("impact_metrics").select("*").limit(10) // Showing global impact for donors
    ]);

    const scholarIds = Array.from(new Set(
        (fundingRes.data || [])
            .map((fr: { scholar_id?: string | null }) => fr.scholar_id)
            .filter(Boolean)
    ));

    let sponsoredScholars: Array<Record<string, unknown>> = [];
    if (scholarIds.length > 0) {
        const { data } = await supabase.from("profiles").select("*").in("id", scholarIds);
        sponsoredScholars = data || [];
    }

    return {
        profile: { ...profileRes.data, ...detailsRes.data },
        fundingRecords: normalizeProgramsRelation(fundingRes.data),
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
        .select("*");

    if (error) {
        console.error("Error fetching admin programs:", formatSupabaseError(error));
        return [];
    }
    return sortProgramsByName(normalizeProgramsList(data));
}

export async function getAdminCohorts() {
    const supabase = await createSupabaseServerClient();
    const [cohorts, applications] = await Promise.all([
        getAdminCohortsData(supabase),
        fetchAdminApplicationsData(supabase),
    ]);

    return mergeAdminCohortsWithApplicationRollups(cohorts, applications);
}

export async function getAdminFundingLedger() {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from("funding_records")
        .select(`
      *,
      profiles (first_name, last_name),
      programs (*)
    `)
        .order("date", { ascending: false });

    if (error) {
        console.error("Error fetching admin funding ledger:", formatSupabaseError(error));
        return [];
    }
    return normalizeProgramsRelation(data);
}

export async function getAdminApplications() {
    const supabase = await createSupabaseServerClient();
    return fetchAdminApplicationsData(supabase);
}

export async function getAdminScholars() {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from("profiles")
        .select(`
            *,
            applications (
                program_id,
                cohort_id,
                programs (title),
                cohorts (year)
            )
        `)
        .eq("role", "scholar")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching admin scholars:", error);
        return [];
    }

    return (data || []).map(profile => {
        const application = (profile.applications as any[])?.[0];
        return {
            ...profile,
            program: application?.programs?.title,
            cohort: application?.cohorts?.year,
            progress_score: (profile as any).progress_score || 0, // Fallback if not in schema
        };
    });
}

export async function getAdminScholarManagementData() {
    const supabase = await createSupabaseServerClient();

    // Fetch scholars with their primary application info
    const scholars = await getAdminScholars();

    // Fetch pending milestones for "Milestones Due" count
    const { count: milestonesDueCount } = await supabase
        .from("milestones")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending")
        .lt("due_date", new Date().toISOString());

    // Fetch funding records to calculate total disbursement
    const { data: fundingRecords } = await supabase
        .from("funding_records")
        .select("amount, status")
        .eq("status", "completed");

    const totalDisbursed = (fundingRecords || []).reduce((sum, record) => sum + (Number(record.amount) || 0), 0);

    // Calculate health breakdown based on progress scores
    const healthBreakdown = {
        onTrack: scholars.filter(s => (s as any).progress_score >= 70).length,
        atRisk: scholars.filter(s => (s as any).progress_score >= 40 && (s as any).progress_score < 70).length,
        offTrack: scholars.filter(s => (s as any).progress_score < 40).length,
    };

    const totalScholars = scholars.length || 1;
    const healthPercentages = [
        { label: "On Track", value: Math.round((healthBreakdown.onTrack / totalScholars) * 100), color: "var(--primary)" },
        { label: "At Risk", value: Math.round((healthBreakdown.atRisk / totalScholars) * 100), color: "#f59e0b" },
        { label: "Off Track", value: Math.round((healthBreakdown.offTrack / totalScholars) * 100), color: "#ef4444" },
    ];

    return {
        scholars,
        metrics: {
            activeScholars: scholars.length,
            milestonesDue: milestonesDueCount || 0,
            placementWatchlist: 0, // Still placeholder until placements table exists
            fundingWatchlist: 0, // Still placeholder
            totalDisbursed,
        },
        healthPercentages,
    };
}

export async function getAdminApplicationById(id: string) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from("applications")
        .select(`
      *,
      profiles (first_name, last_name, email, state_of_origin),
      cohorts (year),
      programs (*)
    `)
        .eq("id", id)
        .single();

    if (!error) {
        return data ? normalizeAdminApplicationRecord(data) : null;
    }

    const canRetryWithoutCohortsRelation =
        isTablePermissionError(error, "cohorts") ||
        isMissingRelationshipError(error, "applications", "cohorts");

    if (!canRetryWithoutCohortsRelation) {
        console.error("Error fetching admin application by id:", formatSupabaseError(error));
        return null;
    }

    const fallbackRes = await supabase
        .from("applications")
        .select(`
      *,
      profiles (first_name, last_name, email, state_of_origin),
      programs (*)
    `)
        .eq("id", id)
        .single();

    if (fallbackRes.error) {
        console.error("Error fetching admin application by id:", formatSupabaseError(fallbackRes.error));
        return null;
    }

    const [hydratedApplication] = await hydrateRowsWithCohortYears(supabase, [fallbackRes.data]);
    return hydratedApplication ? normalizeAdminApplicationRecord(hydratedApplication) : null;
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
            .select("*, programs(*), cohorts(year)")
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
        // Fallback when relational selects fail (for example, missing relationship metadata or a missing cohorts table grant).
        const fallbackWithProgramsRes = await supabase
            .from("applications")
            .select("*, programs(*)")
            .eq("applicant_id", userId)
            .order("updated_at", { ascending: false })
            .limit(1)
            .maybeSingle();

        if (!fallbackWithProgramsRes.error) {
            const [hydratedApplication] = await hydrateRowsWithCohortYears(supabase, [fallbackWithProgramsRes.data]);
            applicationData = hydratedApplication || null;
        } else {
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
                const [hydratedApplication] = await hydrateRowsWithCohortYears(supabase, [fallbackApplicationRes.data]);
                applicationData = hydratedApplication || null;
            }
        }
    }

    const documents = normalizeApplicationDocuments(applicationData?.documents);
    const normalizedProgram =
        applicationData?.programs && typeof applicationData.programs === "object"
            ? normalizeProgramRecord(applicationData.programs)
            : null;
    const programName =
        getProgramName(normalizedProgram) ||
        (applicationData?.programChoice || applicationData?.program_choice || getProgramChoiceFromAcademicBackground(applicationData?.academic_background));

    const application = applicationData
        ? {
            ...applicationData,
            step: applicationData.current_step,
            documents,
            programs: normalizedProgram,
            program_name: programName,
            cohort_year: applicationData.cohort_year ?? getCohortYear(applicationData.cohorts),
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
    const { data, error } = await supabase.from("programs").select("*");

    if (error) {
        console.error("Error fetching public programs:", formatSupabaseError(error));
        return [];
    }

    return sortProgramsByName(normalizeProgramsList(data));
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
        .select("id, status, current_step, academic_background, program_id, cohort_id")
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

    const selection = await resolveProgramAndCohortSelection(
        supabase,
        getProgramChoiceFromAcademicBackground(application.academic_background)
    );
    const shouldSyncProgramSelection =
        (selection.programId !== null && selection.programId !== application.program_id) ||
        (selection.cohortId !== null && selection.cohortId !== application.cohort_id);

    if (application.status === "submitted" && !shouldSyncProgramSelection) {
        return { error: null };
    }

    const timestamp = new Date().toISOString();
    const { error } = await supabase
        .from("applications")
        .update({
            ...(application.status === "submitted"
                ? {}
                : {
                    status: "submitted",
                    current_step: Math.max(application.current_step ?? 1, 5),
                    submitted_at: timestamp,
                    last_saved_at: timestamp,
                }),
            ...(selection.programId !== null ? { program_id: selection.programId } : {}),
            ...(selection.cohortId !== null ? { cohort_id: selection.cohortId } : {}),
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
    url: string;
    publicId: string;
    mimeType?: string;
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
        return { error: userError?.message || "You must be signed in to save this document." };
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
        slot: input.slot,
        name: input.name,
        size: input.size,
        uploadedAt: new Date().toISOString(),
        status: "pending",
        owner: "Applicant",
        url: input.url,
        publicId: input.publicId,
        mimeType: input.mimeType,
    };

    const nextDocuments = [
        nextDocument,
        ...normalizeApplicationDocuments(existingApplication?.documents).filter(
            (document) => document.slot !== input.slot
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
        return { error: userError?.message || "You must be signed in to delete this document." };
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
        (document) => document.id !== documentId
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

    if (step === 2) {
        const programSelection = await resolveProgramAndCohortSelection(
            supabase,
            getProgramChoiceFromAcademicBackground(stepData)
        );

        payload.program_id = programSelection.programId;
        payload.cohort_id = programSelection.cohortId;
    }

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
    applicantId: string,
    decision: ApplicationStatus,
    notes: string,
    scores: Record<string, number>,
    cohortId?: string | null
): Promise<{ error: string | null }> {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        return { error: "Unauthorized" };
    }

    const sanitizedApplicationId = applicationId.trim();
    const sanitizedApplicantId = applicantId.trim();

    if (!sanitizedApplicationId) {
        return { error: "Application ID is required." };
    }

    if (!sanitizedApplicantId) {
        return { error: "Applicant ID is required." };
    }

    const rpcPayload = {
        p_application_id: sanitizedApplicationId,
        p_applicant_id: sanitizedApplicantId,
        p_decision: decision,
        p_notes: notes,
        p_scores: scores,
        p_cohort_id: cohortId || null,
    };
    console.log("Calling update_application_decision RPC with:", rpcPayload);

    const { error: rpcError } = await supabase.rpc("update_application_decision", rpcPayload);

    if (rpcError) {
        console.error("RPC Error:", rpcError);
        return { error: rpcError.message };
    }

    console.log("RPC Success for decision:", decision);
    return { error: null };
}

export async function updateApplicationDocumentStatus(
    applicationId: string,
    documentId: string,
    status: DocumentStatus
): Promise<{ error: string | null }> {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        return { error: "Unauthorized" };
    }

    const sanitizedApplicationId = applicationId.trim();
    if (!sanitizedApplicationId) {
        return { error: "Application ID is required." };
    }

    const sanitizedDocumentId = documentId.trim();
    if (!sanitizedDocumentId) {
        return { error: "Document ID is required." };
    }

    const { error: rpcError } = await supabase.rpc("update_application_document_status", {
        p_application_id: sanitizedApplicationId,
        p_document_id: sanitizedDocumentId,
        p_status: status,
    });

    if (rpcError) {
        return { error: rpcError.message };
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

    const sanitizedSponsorId = typeof sponsorId === "string" ? sponsorId.trim() : "";
    if (!sanitizedSponsorId) {
        return { error: "Sponsor ID is required." };
    }

    const sanitizedScholarId = typeof scholarId === "string" ? scholarId.trim() : "";
    if (!sanitizedScholarId) {
        return { error: "Scholar ID is required." };
    }

    const sanitizedAmount = Number(amount);
    if (!Number.isFinite(sanitizedAmount) || sanitizedAmount <= 0) {
        return { error: "Amount must be a finite number greater than 0." };
    }

    let sanitizedProgramId: string | undefined;
    if (programId !== undefined) {
        sanitizedProgramId = typeof programId === "string" ? programId.trim() : "";

        if (!sanitizedProgramId) {
            return { error: "Program ID must be a non-empty string when provided." };
        }
    }

    const payload: Record<string, string | number> = {
        sponsor_id: sanitizedSponsorId,
        scholar_id: sanitizedScholarId,
        amount: sanitizedAmount,
        type: "disbursement",
        status: "completed",
    };

    if (sanitizedProgramId) {
        payload.program_id = sanitizedProgramId;
    }

    const { error } = await supabase
        .from("funding_records")
        .insert(payload);

    if (error) {
        return { error: error.message };
    }

    return { error: null };
}
export async function getAvailableCohorts() {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from("cohorts")
        .select(`
            id,
            year,
            program_id,
            programs (title)
        `)
        .order("year", { ascending: false });

    if (error) {
        console.error("Error fetching available cohorts:", formatSupabaseError(error));
        return [];
    }

    return (data || []).map(row => ({
        id: row.id,
        year: row.year,
        programId: row.program_id,
        programName: (row.programs as any)?.title || "Unknown Program"
    }));
}
