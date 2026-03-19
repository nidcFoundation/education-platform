"use server";

import { createSupabaseServerClient } from "./server";
import { Scholar, Milestone, Announcement, ImpactMetric, FundingRecord } from "@/types";

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
        programsRes
    ] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "scholar"),
        supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "applicant"),
        supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "donor"),
        supabase.from("applications").select("*, profiles(first_name, last_name)").order("created_at", { ascending: false }).limit(10),
        supabase.from("cohorts").select("*").order("year", { ascending: false }),
        supabase.from("programs").select("*")
    ]);

    const counts = {
        scholars: scholarsCount.count || 0,
        applicants: applicantsCount.count || 0,
        donors: donorsCount.count || 0,
    };

    return {
        counts,
        applications: applicationsRes.data || [],
        cohorts: cohortsRes.data || [],
        programs: programsRes.data || [],
    };
}

export async function getDonorDashboardData(donorId: string) {
    const supabase = await createSupabaseServerClient();

    const [
        profileRes,
        fundingRes,
        scholarsRes,
        impactRes
    ] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", donorId).single(),
        supabase.from("funding_records").select("*").eq("sponsor_id", donorId),
        supabase.from("profiles").select("*").eq("role", "scholar").limit(5), // Improved for demo
        supabase.from("impact_metrics").select("*").limit(10) // Showing global impact for donors
    ]);

    return {
        profile: profileRes.data,
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
      profiles (first_name, last_name, email, state)
    `)
        .eq("id", id)
        .single();

    if (error) {
        console.error("Error fetching admin application by id:", error);
        return null;
    }
    return data;
}
