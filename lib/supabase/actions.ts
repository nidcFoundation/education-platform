"use server";

import { createSupabaseServerClient } from "./server";
import { Scholar, Milestone, Announcement, ImpactMetric, FundingRecord } from "@/types";

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
        scholarsRes,
        impactRes
    ] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", donorId).single(),
        supabase.from("donor_details").select("*").eq("id", donorId).single(),
        supabase.from("funding_records").select("*, programs(name)").eq("sponsor_id", donorId),
        supabase.from("profiles").select("*").eq("role", "scholar").limit(5), // Improved for demo
        supabase.from("impact_metrics").select("*").limit(10) // Showing global impact for donors
    ]);

    return {
        profile: { ...profileRes.data, ...detailsRes.data },
        fundingRecords: fundingRes.data || [],
        sponsoredScholars: scholarsRes.data || [],
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
    return data;
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
        // documents table is scholar-scoped (scholar_id); skip query for applicants
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

    const application = applicationData
        ? {
            ...applicationData,
            step: applicationData.current_step,
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
        documents: [],
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
