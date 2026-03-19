import { SectionWrapper } from "@/components/sections/section-wrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Download, Activity, PieChart, BarChart3, TrendingUp, Users, GraduationCap, MapPin } from "lucide-react";
import { getPublicImpactDetails } from "@/lib/supabase/actions";
import Link from "next/link";

const sectorBreakdown = [
    { sector: "Technology & Software", count: 340, pct: 40 },
    { sector: "Healthcare & Biotech", count: 212, pct: 25 },
    { sector: "Clean Energy", count: 127, pct: 15 },
    { sector: "Manufacturing & Robotics", count: 85, pct: 10 },
    { sector: "Others", count: 86, pct: 10 },
];

const fundingBreakdown = [
    { label: "Tuition & Fees", pct: 60 },
    { label: "Living Stipends", pct: 25 },
    { label: "Research Grants", pct: 10 },
    { label: "Leadership Bootcamps", pct: 5 },
];

export default async function ImpactPage() {
    const { impactMetrics, scholars } = await getPublicImpactDetails();

    const statCards = impactMetrics.length > 0 ? impactMetrics.map(m => ({
        title: m.label,
        value: m.value + (m.unit || ""),
        icon: Activity,
        trend: "↑ YoY",
        sub: m.description || ""
    })) : [
        { title: "Total Scholars", value: "1,250", icon: Users, trend: "+12%", sub: "Active: 890 · Graduated: 360" },
        { title: "States Represented", value: "36 + FCT", icon: MapPin, trend: "100%", sub: "Full national representation" },
        { title: "Graduation Rate", value: "98.2%", icon: TrendingUp, trend: "+1.1%", sub: "Industry-leading outcome" },
    ];

    return (
        <div className="flex flex-col w-full">
            {/* Hero */}
            <section className="bg-primary/5 py-20 pb-12 border-b">
                <div className="container mx-auto px-4 max-w-4xl space-y-5">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Impact & Transparency</h1>
                    <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
                        Live metrics, funding utilisation, and verifiable outcomes. We hold ourselves absolutely accountable to the public, our scholars, and our institutional partners.
                    </p>
                    <div className="flex flex-wrap gap-2 text-sm">
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">All data as of March 2026</Badge>
                        <Badge variant="outline">Annual audit by Deloitte Nigeria</Badge>
                    </div>
                </div>
            </section>

            {/* Impact Dashboard — Metric Cards */}
            <SectionWrapper title="Live Impact Dashboard" className="bg-background">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mt-8">
                    {statCards.map((stat, i) => (
                        <Card key={i} className="border-border/50 hover:shadow-sm transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                                <stat.icon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{stat.value}</div>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-emerald-600 text-xs font-semibold">{stat.trend}</span>
                                    <span className="text-xs text-muted-foreground">{stat.sub}</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </SectionWrapper>

            {/* Sector Placements Breakdown */}
            <SectionWrapper title="Scholar Placement by Sector" className="bg-muted/20 border-t" description="Where our graduates are actively driving national impact.">
                <div className="grid md:grid-cols-2 gap-12 mt-8 items-start">
                    <div className="space-y-5">
                        {sectorBreakdown.map((sector, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-medium">{sector.sector}</span>
                                    <span className="text-muted-foreground">{sector.count} scholars ({sector.pct}%)</span>
                                </div>
                                <Progress value={sector.pct} className="h-2" />
                            </div>
                        ))}
                    </div>
                    <Card className="border-border/50">
                        <CardContent className="p-6">
                            <h3 className="font-bold text-lg mb-4">Cohort Summary</h3>
                            <div className="space-y-4">
                                {[
                                    { label: "Active Scholars", value: scholars.length.toString(), color: "bg-primary" },
                                    { label: "States Covered", value: "36", color: "bg-emerald-500" },
                                    { label: "Fully Employed", value: "85%", color: "bg-blue-500" },
                                    { label: "In Postgrad Study", value: "15%", color: "bg-purple-500" },
                                ].map((row, i) => (
                                    <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                                        <div className="flex items-center gap-2">
                                            <div className={`h-2.5 w-2.5 rounded-full ${row.color}`} />
                                            <span className="text-sm">{row.label}</span>
                                        </div>
                                        <span className="font-bold">{row.value}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </SectionWrapper>

            {/* Funding Utilisation */}
            <SectionWrapper title="Funding Utilisation" description="100% of donor contributions are routed directly to scholar support. Operational costs are covered by foundational endowments." className="bg-background border-t">
                <div className="grid md:grid-cols-2 gap-12 mt-8 items-center">
                    <div className="space-y-6">
                        {fundingBreakdown.map((item, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between text-sm font-medium">
                                    <span>{item.label}</span>
                                    <span className="text-primary font-bold">{item.pct}%</span>
                                </div>
                                <Progress value={item.pct} className="h-3" />
                            </div>
                        ))}
                        <Card className="bg-muted/30 border-none shadow-none mt-6">
                            <CardContent className="p-5 space-y-2">
                                <p className="text-sm font-semibold">Total Deployed to Date</p>
                                <p className="text-3xl font-extrabold text-primary">₦18.6 Billion</p>
                                <p className="text-xs text-muted-foreground">Across 5 cohorts, 36 states, 45 partner institutions</p>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="bg-muted/30 rounded-2xl border border-dashed border-border p-8 aspect-video flex flex-col items-center justify-center text-center space-y-3">
                        <BarChart3 className="h-12 w-12 text-muted-foreground/40" />
                        <p className="font-semibold text-muted-foreground">Interactive Chart Visualization</p>
                        <p className="text-sm text-muted-foreground/70">Capital deployment across 36 states (Recharts integration)</p>
                    </div>
                </div>
            </SectionWrapper>

            {/* Scholar Outcomes */}
            <SectionWrapper title="Scholar Outcomes" description="Tracking real impact — from first intake to national deployment." className="bg-muted/20 border-t">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
                    {scholars.map((scholar) => (
                        <Card key={scholar.id} className="border-border/50 hover:border-primary/40 transition-colors">
                            <CardContent className="p-5">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                                        {scholar.first_name?.[0]}{scholar.last_name?.[0]}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-semibold text-sm truncate">{scholar.first_name} {scholar.last_name}</p>
                                        <Badge variant="outline" className="text-xs capitalize mt-0.5">Scholar</Badge>
                                    </div>
                                </div>
                                <div className="space-y-1.5 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1.5"><GraduationCap className="h-3.5 w-3.5 shrink-0" />STEM Leadership</div>
                                    <div className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 shrink-0" />{scholar.state_of_origin} State</div>
                                    <div className="flex items-start gap-1.5 mt-2 pt-2 border-t">
                                        <Activity className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                                        <span className="font-medium text-foreground">Future Leader</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {scholars.length === 0 && (
                        <p className="col-span-full text-center text-muted-foreground py-12">No outcomes recorded yet.</p>
                    )}
                </div>
                <div className="mt-8 text-center">
                    <Link href="/scholars">
                        <Button variant="outline" size="lg">View Full Scholar Directory</Button>
                    </Link>
                </div>
            </SectionWrapper>

            {/* Annual Reports */}
            <SectionWrapper title="Annual Reports & Audited Financials" description="Every report is independently audited and published in full. No exceptions." className="bg-background border-t">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                    {[2025, 2024, 2023].map((year) => (
                        <Card key={year} className="hover:border-primary/50 transition-colors cursor-pointer group">
                            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                    <Activity className="h-7 w-7 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl">{year} Annual Report</h3>
                                    <p className="text-sm text-muted-foreground mt-1">Fully audited financials, placement data & outcomes</p>
                                </div>
                                <Button variant="outline" className="w-full mt-2">
                                    <Download className="mr-2 h-4 w-4" /> Download PDF
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </SectionWrapper>
        </div>
    );
}
