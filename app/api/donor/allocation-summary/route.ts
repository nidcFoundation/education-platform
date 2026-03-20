import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getDonorDashboardData } from "@/lib/supabase/actions";

function formatPercent(value: number | null) {
    return value === null ? "N/A" : `${value}%`;
}

export async function GET() {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return new Response("Unauthorized", { status: 401 });
    }

    const { profile, fundingRecords, sponsoredScholars, impactMetrics } = await getDonorDashboardData(user.id);

    const totalAllocated = fundingRecords.reduce((acc, curr) => acc + (curr.amount || 0), 0);

    const summary = [
        "Donor Allocation Summary",
        `Organisation: ${profile.organization || profile.first_name + " " + profile.last_name}`,
        `Donor ID: ${profile.id}`,
        `Total Commitment: N${(totalAllocated / 1000000).toFixed(1)}M`,
        "",
        "Fund Distribution",
        ...fundingRecords.map((r) => `- ${r.programs?.name || "Support Line"}: N${(r.amount / 1000000).toFixed(1)}M`),
        "",
        "Impact Metrics",
        ...impactMetrics.map((metric: any) => `- ${metric.label}: ${metric.value} - ${metric.description}`),
        "",
        "Sponsored Scholars",
        ...sponsoredScholars.map(
            (scholar: any) =>
                `- ${scholar.first_name} ${scholar.last_name}: ${scholar.program || "Tech Track"}, progress ${scholar.progress_score || 0}%`
        ),
        "",
    ].join("\n");

    return new Response(summary, {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Content-Disposition": 'attachment; filename="allocation-summary.txt"',
            "Cache-Control": "no-store",
        },
    });
}
