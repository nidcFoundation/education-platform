import { SectionWrapper } from "@/components/sections/section-wrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Monitor, HeartPulse, Leaf, Cog, ArrowRight, BookOpen, Brain, Briefcase, CheckCircle2 } from "lucide-react";
import { getPublicPrograms } from "@/lib/supabase/actions";

const iconMap: Record<string, typeof Monitor> = {
    tech: Monitor,
    health: HeartPulse,
    energy: Leaf,
    manufacturing: Cog,
};

const scholarExpectations = [
    { title: "Academic Performance", desc: "Maintain a minimum CGPA of 3.5/5.0 (or equivalent) across all academic years." },
    { title: "Leadership Participation", desc: "Attend all quarterly national bootcamps focused on governance, policy, and ethics." },
    { title: "Monthly Progress Reports", desc: "Submit structured monthly academic and personal development reports to the programme office." },
    { title: "National Service Commitment", desc: "Fulfil a minimum of 36 months of post-graduation service in a designated national sector." },
    { title: "Community Engagement", desc: "Lead at least one verified community impact project per academic year." },
];

export default async function ProgramsPage() {
    const programs = await getPublicPrograms();

    return (
        <div className="flex flex-col w-full">
            {/* Hero */}
            <section className="bg-primary/5 py-20 pb-12 border-b">
                <div className="container mx-auto px-4 max-w-5xl space-y-5">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Focus Areas & Programs</h1>
                    <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
                        Our curriculum and scholar support structures are intentionally designed to address Nigeria&apos;s most pressing socio-economic and technological gaps.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3 text-sm">
                        {["All", "Technology", "Healthcare", "Energy", "Manufacturing"].map((cat, i) => (
                            <Badge key={i} variant={i === 0 ? "default" : "outline"} className="cursor-pointer rounded-full text-xs">{cat}</Badge>
                        ))}
                    </div>
                </div>
            </section>

            {/* Focus Area Grid */}
            <SectionWrapper title="Strategic Disciplines" className="bg-background">
                <div className="grid md:grid-cols-2 gap-8 mt-8">
                    {programs.map((program) => {
                        const focusAreaId = program.focusAreaId ?? program.focus_area_id ?? "";
                        const categoryKey = (typeof focusAreaId === "string" ? focusAreaId.split("-")[1] : "") || "tech";
                        const Icon = iconMap[categoryKey] ?? Monitor;
                        return (
                            <Card key={program.id} className="border-border/50 bg-card hover:shadow-lg transition-shadow overflow-hidden">
                                <CardHeader className="pb-4">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                            <Icon className="h-6 w-6" />
                                        </div>
                                        <Badge variant={program.status === "active" ? "default" : "secondary"} className="capitalize">
                                            {program.status}
                                        </Badge>
                                    </div>
                                    <CardTitle className="text-2xl">{program.name}</CardTitle>
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mt-1">
                                        <span>{program.campuses?.join(", ") || "Nationwide"}</span>
                                        <span>·</span>
                                        <span>4 Years</span>
                                        <span>·</span>
                                        <span>{program.capacity || 200} scholars</span>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <p className="text-muted-foreground leading-relaxed">{program.description}</p>
                                    <div className="space-y-2">
                                        <h4 className="text-xs font-bold uppercase tracking-widest text-primary">Key Focus</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {program.tags?.map((tag: string, j: number) => (
                                                <Badge key={j} variant="secondary" className="bg-muted text-muted-foreground rounded-md">{tag}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-600">Expected Outcomes</h4>
                                        <ul className="space-y-1.5">
                                            {[
                                                "Advanced technical mastery in designated field",
                                                "Socio-economic impact via service deployment",
                                                "Strategic leadership capacity building"
                                            ].map((outcome, j) => (
                                                <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                                                    <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                                                    {outcome}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                    {programs.length === 0 && (
                        <p className="col-span-full text-center text-muted-foreground py-12">No programs currently listed.</p>
                    )}
                </div>
            </SectionWrapper>

            {/* Learning Pathways */}
            <SectionWrapper
                className="bg-muted/30 border-t"
                title="Learning Pathways"
                description="Beyond academic study, every NTDI scholar receives a comprehensive 360-degree development experience."
            >
                <div className="grid sm:grid-cols-3 gap-8 mt-10">
                    {[
                        { title: "Academic Excellence", icon: BookOpen, desc: "Full tuition coverage at tier-1 partner universities. Dedicated academic tutors, exam preparation support, and direct access to faculty mentors." },
                        { title: "Leadership Training", icon: Brain, desc: "Quarterly bootcamps on governance, ethics, public policy, and national strategic thought. All led by distinguished practitioners." },
                        { title: "Career Deployment", icon: Briefcase, desc: "Direct placement into Nigeria's leading organisations through our vetted corporate and public sector network, commencing in the third year." },
                    ].map((path, i) => (
                        <div key={i} className="flex flex-col items-center text-center p-8 rounded-2xl bg-background border space-y-4">
                            <div className="h-16 w-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shadow-sm">
                                <path.icon className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold">{path.title}</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">{path.desc}</p>
                        </div>
                    ))}
                </div>
            </SectionWrapper>

            {/* Scholar Expectations */}
            <SectionWrapper
                title="Scholar Expectations"
                description="Selection into the Initiative is a privilege and a responsibility. We set — and maintain — the highest standards."
                className="bg-background border-t"
            >
                <div className="max-w-3xl mt-8 space-y-4">
                    {scholarExpectations.map((item, i) => (
                        <div key={i} className="flex gap-4 p-5 rounded-xl border border-border/50 bg-muted/20 hover:border-primary/30 transition-colors">
                            <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                            <div>
                                <h4 className="font-semibold mb-0.5">{item.title}</h4>
                                <p className="text-sm text-muted-foreground">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </SectionWrapper>

            {/* CTA */}
            <section className="py-20 bg-primary text-primary-foreground">
                <div className="container mx-auto px-4 max-w-3xl space-y-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Verify Your Eligibility</h2>
                    <p className="text-lg opacity-80">
                        The selection process is the most rigorous and merit-based in Nigeria. Only the most dedicated and brilliant candidates are chosen.
                    </p>
                    <Link href="/apply">
                        <Button size="lg" variant="secondary" className="h-14 px-8 text-lg font-semibold">
                            Review Requirements & Apply <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
