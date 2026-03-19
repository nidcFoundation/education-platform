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
        documentsRes
    ] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
        supabase.from("applications").select("*").eq("applicant_id", userId).maybeSingle(),
        supabase.from("announcements").select("*").or("audience.eq.all,audience.eq.applicants").order("created_at", { ascending: false }).limit(5),
        supabase.from("notifications").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(5),
        supabase.from("deadlines").select("*").or(`user_id.is.null,user_id.eq.${userId}`).order("due_date", { ascending: true }).limit(5),
        supabase.from("documents").select("*").eq("scholar_id", userId).order("updated_at", { ascending: false })
    ]);

    const application = applicationRes.data
        ? {
            ...applicationRes.data,
            step: applicationRes.data.current_step,
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
        documents: documentsRes.data || [],
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
