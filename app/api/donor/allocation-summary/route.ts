import {
    cohortSuccessRates,
    donorProfile,
    fundDistribution,
    impactMetrics,
    sponsoredScholars,
} from "@/mock-data/donor";

function formatPercent(value: number | null) {
    return value === null ? "N/A" : `${value}%`;
}

export async function GET() {
    const summary = [
        "Donor Allocation Summary",
        `Organisation: ${donorProfile.organization}`,
        `Donor ID: ${donorProfile.donorId}`,
        `Commitment Window: ${donorProfile.pledgeWindow}`,
        `Total Commitment: ${donorProfile.totalCommitment}`,
        "",
        "Fund Distribution",
        ...fundDistribution.map((item) => `- ${item.label}: ${item.value}% (${item.meta})`),
        "",
        "Impact Metrics",
        ...impactMetrics.map((metric) => `- ${metric.label}: ${metric.value} - ${metric.description}`),
        "",
        "Cohort Success Rates",
        ...cohortSuccessRates.map(
            (cohort) =>
                `- ${cohort.cohort}: retention ${formatPercent(cohort.retention)}, graduation ${formatPercent(cohort.graduation)}, placement ${formatPercent(cohort.placement)}`
        ),
        "",
        "Sponsored Scholars",
        ...sponsoredScholars.map(
            (scholar) =>
                `- ${scholar.name}: ${scholar.program}, allocated ${scholar.allocation}, used ${scholar.used}, progress ${scholar.progressScore}%`
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
