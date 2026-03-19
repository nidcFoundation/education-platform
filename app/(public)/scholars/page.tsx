import { SectionWrapper } from "@/components/sections/section-wrapper";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Trophy, MapPin, Briefcase, GraduationCap, Quote } from "lucide-react";
import { getPublicScholars } from "@/lib/supabase/actions";
import Link from "next/link";

const cohorts = ["All", "2023", "2024", "2025"];
const disciplines = ["All", "Technology", "Healthcare", "Energy", "Engineering"];

const spotlights = [
    {
        name: "Aisha Mohammed",
        state: "Kano",
        discipline: "Software Engineering",
        cohort: "2024",
        placement: "FinTech Innovation Hub",
        quote: "The NTDI gave me access to an education I could never have funded. But more than that, it gave me a sense of responsibility to use that education purposefully.",
        achievement: "Led a team that built an open-source payments API now processing ₦40M monthly",
    },
    {
        name: "Chukwuemeka Okoro",
        state: "Enugu",
        discipline: "Bio-Medical Engineering",
        cohort: "2023",
        placement: "National Health Institute",
        quote: "From a public secondary school in Enugu to a senior role at the National Health Institute — this programme builds bridges that others don't even see yet.",
        achievement: "Developed a low-cost diagnostic device now deployed in 14 rural health clinics",
    },
];

const statusColorMap: Record<string, string> = {
    active: "bg-emerald-100 text-emerald-800 border-emerald-200",
    graduated: "bg-blue-100 text-blue-800 border-blue-200",
    suspended: "bg-red-100 text-red-800 border-red-200",
};

export default async function ScholarsPage() {
    const scholars = await getPublicScholars();

    return (
        <div className="flex flex-col w-full">
            {/* Hero */}
            <section className="bg-primary/5 py-20 pb-12 border-b">
                <div className="container mx-auto px-4 max-w-4xl text-center space-y-5">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Our Scholars</h1>
                    <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                        Meet the exceptional minds the NTDI has identified, funded, and deployed to build the future of Nigeria.
                    </p>
                    <div className="flex justify-center gap-4 flex-wrap pt-2 text-sm">
                        <div className="text-center">
                            <div className="text-2xl font-bold">{scholars.length.toLocaleString()}+</div>
                            <div className="text-muted-foreground text-xs">Total Scholars</div>
                        </div>
                        <div className="w-px h-10 bg-border self-center" />
                        <div className="text-center">
                            <div className="text-2xl font-bold">36</div>
                            <div className="text-muted-foreground text-xs">States Represented</div>
                        </div>
                        <div className="w-px h-10 bg-border self-center" />
                        <div className="text-center">
                            <div className="text-2xl font-bold">5</div>
                            <div className="text-muted-foreground text-xs">Cohorts</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Scholar Spotlights */}
            <SectionWrapper title="Scholar Spotlight" description="Extraordinary individuals building extraordinary outcomes." className="bg-background">
                <div className="grid md:grid-cols-2 gap-8 mt-8">
                    {spotlights.map((scholar, i) => (
                        <Card key={i} className="border-border/50 hover:shadow-md transition-shadow overflow-hidden">
                            <div className="bg-primary/5 p-8 border-b">
                                <Quote className="h-8 w-8 text-primary/30 mb-4" />
                                <p className="text-base italic leading-relaxed text-foreground/90">&ldquo;{scholar.quote}&rdquo;</p>
                            </div>
                            <CardContent className="p-6 space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-base font-bold text-primary shrink-0">
                                        {scholar.name.split(" ").map(n => n[0]).join("")}
                                    </div>
                                    <div>
                                        <h3 className="font-bold">{scholar.name}</h3>
                                        <p className="text-sm text-muted-foreground">{scholar.discipline} · Cohort {scholar.cohort} · {scholar.state} State</p>
                                    </div>
                                </div>
                                <div className="bg-muted/30 rounded-lg p-4 text-sm">
                                    <p className="font-semibold text-xs uppercase tracking-wider text-primary mb-1">Key Achievement</p>
                                    <p className="text-muted-foreground">{scholar.achievement}</p>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Briefcase className="h-3.5 w-3.5" />
                                    <span>Currently at: <strong className="text-foreground">{scholar.placement}</strong></span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </SectionWrapper>

            {/* Scholar Directory with filters */}
            <SectionWrapper title="Scholar Directory" className="bg-muted/20 border-t">
                {/* Search & Filters */}
                <div className="space-y-4 mt-6 mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input className="pl-9 h-11 bg-background w-full" placeholder="Search by name, state, or discipline..." />
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <span className="text-xs font-semibold text-muted-foreground self-center mr-2 uppercase tracking-wider">Cohort:</span>
                        {cohorts.map((c, i) => (
                            <Button key={i} variant={i === 0 ? "default" : "secondary"} size="sm" className="rounded-full text-xs h-7">{c}</Button>
                        ))}
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {scholars.map((scholar) => (
                        <Card key={scholar.id} className="overflow-hidden border-border/50 hover:border-primary/50 transition-colors">
                            <div className="aspect-square bg-muted relative">
                                <div className="absolute inset-0 flex items-center justify-center bg-primary/5 font-bold text-4xl text-primary/20">
                                    {scholar.first_name?.[0]}{scholar.last_name?.[0]}
                                </div>
                                <div className="absolute top-3 right-3">
                                    <Badge variant="outline" className={`text-xs ${statusColorMap[scholar.status] ?? ""}`}>2025</Badge>
                                </div>
                            </div>
                            <CardContent className="p-4">
                                <h3 className="font-bold text-base mb-0.5 truncate">{scholar.first_name} {scholar.last_name}</h3>
                                <Badge variant="outline" className={`text-[10px] mb-3 capitalize bg-emerald-100 text-emerald-800 border-emerald-200`}>Scholar</Badge>
                                <div className="space-y-2 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1.5">
                                        <Trophy className="h-3.5 w-3.5 shrink-0" />
                                        <span className="truncate">STEM Leadership</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                                        <span>{scholar.state_of_origin || "Lagos"} State</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 pt-1 border-t">
                                        <Briefcase className="h-3.5 w-3.5 shrink-0" />
                                        <span className="text-primary font-medium truncate">Candidate</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {scholars.length === 0 && (
                        <p className="col-span-full text-center text-muted-foreground py-12">No scholars found.</p>
                    )}
                </div>
            </SectionWrapper>

            {/* Achievements */}
            <SectionWrapper title="Collective Achievements" description="What our scholars have accomplished as a cohort." className="bg-background border-t">
                <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 mt-8">
                    {[
                        { value: "850+", label: "Career Placements", sub: "Within 6 months" },
                        { value: "28", label: "Startup Founders", sub: "Active businesses" },
                        { value: "₦2.4B", label: "Economic Value", sub: "Generated by alumni" },
                        { value: "15", label: "Research Papers", sub: "Published & indexed" },
                    ].map((stat, i) => (
                        <div key={i} className="p-6 border rounded-xl text-center hover:border-primary/40 transition-colors">
                            <div className="text-3xl font-extrabold text-primary mb-1">{stat.value}</div>
                            <div className="font-semibold text-sm">{stat.label}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">{stat.sub}</div>
                        </div>
                    ))}
                </div>
            </SectionWrapper>

            {/* CTA */}
            <section className="bg-muted/30 border-t py-20">
                <div className="container mx-auto px-4 text-center max-w-2xl space-y-5">
                    <h2 className="text-3xl font-bold tracking-tight">Join the Next Cohort</h2>
                    <p className="text-lg text-muted-foreground">Applications for the 2025 cohort are now open. Are you ready to be listed among Nigeria&apos;s most exceptional scholars?</p>
                    <Link href="/apply">
                        <Button size="lg" className="h-12 px-8 font-semibold">Apply Now</Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
