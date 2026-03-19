import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionWrapper } from "@/components/sections/section-wrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    ArrowRight, BookOpen, GraduationCap, Building2, Users, Target, CheckCircle2, Globe, TrendingUp,
    Zap, HeartPulse, Leaf, Cog, Calendar, Briefcase,
} from "lucide-react";
import { getPublicHomeData } from "@/lib/supabase/actions";
import { Hero } from "@/components/sections/hero";

export default async function HomePage() {
    const { impactMetrics, news, partners } = await getPublicHomeData();

    const impactNumbers = impactMetrics.length > 0 ? impactMetrics.map(m => ({
        value: m.value + (m.unit || ""),
        label: m.label,
        sub: m.description || ""
    })) : [
        { value: "36", label: "States Covered", sub: "Across the federation" },
        { value: "100%", label: "Transparency", sub: "Fully verifiable" }
    ];

    const focusAreas = [
        { title: "Clean Energy", icon: Zap, desc: "Powering Nigeria's industrial future with sustainable solar and grid innovations." },
        { title: "Public Health", icon: HeartPulse, desc: "Building resilient health systems through bio-medical engineering and data." },
        { title: "Agriculture", icon: Leaf, desc: "Scaling food security with climate-smart tech and supply chain optimizations." },
        { title: "Manufacturing", icon: Cog, desc: "Driving the next era of local production and advanced robotics." },
    ];

    const spotlightScholars = [
        { name: "Amara Okafor", state: "Anambra", discipline: "Data Science for Public Systems", quote: "The Initiative gave me the infrastructure to compete globally, while keeping my roots firmly Nigerian." },
        { name: "Chukwuemeka Okoro", state: "Enugu", discipline: "Bio-Medical Engineering", quote: "From a public secondary school in Enugu to the National Health Institute — this program builds bridges others don't even see." },
        { name: "Zainab Yusuf", state: "Kaduna", discipline: "Cybersecurity & Digital Trust", quote: "I applied not knowing if I stood a chance. The selection process was the most rigorous and fair process I have ever experienced." },
    ];

    return (
        <div className="flex flex-col w-full">
            <Hero />

            {/* ── Mission Statement ──────────────────────────────────────────── */}
            <SectionWrapper className="bg-background border-b border-border/50">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="space-y-6">
                        <p className="text-xs font-bold uppercase tracking-widest text-primary">Our Mission</p>
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-snug">
                            Every exceptional Nigerian student deserves access to world-class education — regardless of where they were born.
                        </h2>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            We systematically identify and support the nation's brightest minds across all 36 states, providing full scholarships, mentorship, and guaranteed career pathways in critical national sectors.
                        </p>
                        <ul className="space-y-3">
                            {[
                                "Merit-based selection across all 36 states + FCT",
                                "Full scholarships — tuition, housing, and monthly stipend",
                                "Guaranteed post-graduation career deployment",
                                "Continuous leadership and national impact training",
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                                    <span className="text-foreground font-medium">{item}</span>
                                </li>
                            ))}
                        </ul>
                        <Link href="/about">
                            <Button variant="outline" className="mt-2">
                                Read Our Full Mission <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {impactNumbers.slice(0, 4).map((stat, i) => (
                            <Card key={i} className="border-border/50 text-center p-6">
                                <div className="text-3xl md:text-4xl font-extrabold text-primary mb-1">{stat.value}</div>
                                <div className="font-semibold text-sm mb-1">{stat.label}</div>
                                <div className="text-xs text-muted-foreground">{stat.sub}</div>
                            </Card>
                        ))}
                    </div>
                </div>
            </SectionWrapper>

            {/* ── National Problem Overview ──────────────────────────────────── */}
            <SectionWrapper
                className="bg-muted/30"
                title="The Challenge We Are Solving"
                description="Nigeria is home to an abundance of raw talent that lacks the infrastructure to thrive globally. The costs of inaction are compounding."
            >
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                    {[
                        { icon: Users, title: "The Access Gap", desc: "Over 1.9 million qualified students are unable to access tertiary education annually due to financial constraints, independent of academic excellence." },
                        { icon: TrendingUp, title: "Economic Leakage", desc: "Without structured talent pipelines, Nigeria loses billions annually to brain drain — top talent educated aboard who do not return to drive national growth." },
                        { icon: Building2, title: "Institutional Deficit", desc: "Top-tier organisations face sustained challenges sourcing globally competitive local talent, slowing innovation and national productivity growth." },
                    ].map((item, i) => (
                        <Card key={i} className="bg-background border-border/50 hover:shadow-md transition-all">
                            <CardHeader>
                                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                    <item.icon className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle className="text-xl">{item.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </SectionWrapper>

            {/* ── How the Initiative Works ───────────────────────────────────── */}
            <SectionWrapper
                title="How The Initiative Works"
                description="A structured four-phase ecosystem designed to systematically elevate and deploy national talent."
                className="bg-background"
            >
                <div className="grid md:grid-cols-4 gap-5 mt-8">
                    {[
                        { step: "01", title: "Identify", icon: Target, desc: "Rigorous nationwide assessments designed to surface exceptional talent regardless of economic background." },
                        { step: "02", title: "Fund", icon: Globe, desc: "Comprehensive financial support via transparent endowments — tuition, housing, and monthly stipends, fully covered." },
                        { step: "03", title: "Nurture", icon: GraduationCap, desc: "World-class education complemented with intensive mentorship, leadership development, and policy training." },
                        { step: "04", title: "Deploy", icon: Briefcase, desc: "Strategic placement into key national economic sectors to drive immediate, measurable impact." },
                    ].map((item, i) => (
                        <div key={i} className="relative p-6 border rounded-xl bg-card hover:border-primary/50 transition-colors group">
                            <div className="text-5xl font-extrabold text-muted/50 mb-4 group-hover:text-primary/10 transition-colors">{item.step}</div>
                            <item.icon className="h-6 w-6 text-primary mb-4" />
                            <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
                <div className="mt-10 text-center">
                    <Link href="/how-it-works">
                        <Button variant="outline" size="lg">Read Full Process Details</Button>
                    </Link>
                </div>
            </SectionWrapper>

            {/* ── Focus Areas ────────────────────────────────────────────────── */}
            <SectionWrapper
                className="bg-primary text-primary-foreground"
                title="Strategic Focus Areas"
                description="Our educational pathways are directly mapped to Nigeria's most critical national development needs."
            >
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
                    {focusAreas.map((item, i) => (
                        <Card key={i} className="bg-primary-foreground/10 border-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/15 transition-colors">
                            <CardHeader className="pb-2">
                                <item.icon className="h-8 w-8 mb-3 opacity-90" />
                                <CardTitle className="text-lg font-bold">{item.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-primary-foreground/70">{item.desc}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <div className="mt-10 text-center">
                    <Link href="/programs">
                        <Button variant="secondary" size="lg">Explore All Programs</Button>
                    </Link>
                </div>
            </SectionWrapper>

            {/* ── Impact Metrics ─────────────────────────────────────────────── */}
            <SectionWrapper className="bg-background" title="Our Verifiable Impact">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-8">
                    {impactNumbers.map((metric, i) => (
                        <div key={i} className="text-center space-y-2 p-4 rounded-xl border border-border/50">
                            <div className="text-4xl md:text-5xl font-extrabold text-primary">{metric.value}</div>
                            <div className="text-sm font-semibold">{metric.label}</div>
                            <div className="text-xs text-muted-foreground">{metric.sub}</div>
                        </div>
                    ))}
                </div>
                <div className="mt-10 text-center">
                    <Link href="/impact">
                        <Button variant="outline" size="lg">View Full Transparency Dashboard</Button>
                    </Link>
                </div>
            </SectionWrapper>

            {/* ── Scholar Spotlights ─────────────────────────────────────────── */}
            <SectionWrapper
                className="bg-muted/20 border-t"
                title="Scholar Stories"
                description="Real scholars. Real outcomes. Real national impact."
            >
                <div className="grid md:grid-cols-3 gap-6 mt-8">
                    {spotlightScholars.map((scholar, i) => (
                        <Card key={i} className="border-border/50 flex flex-col">
                            <CardContent className="pt-8 flex-1 space-y-4">
                                <div className="text-4xl text-muted-foreground/20 font-black leading-none">"</div>
                                <p className="text-base text-foreground/90 leading-relaxed italic">{scholar.quote}</p>
                            </CardContent>
                            <CardContent className="pb-6 pt-0">
                                <div className="flex items-center gap-3 mt-4 pt-4 border-t">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                                        {scholar.name.split(" ").map(n => n[0]).join("")}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm">{scholar.name}</p>
                                        <p className="text-xs text-muted-foreground">{scholar.discipline} · {scholar.state} State</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <div className="mt-10 text-center">
                    <Link href="/scholars">
                        <Button variant="outline" size="lg">View All Scholars</Button>
                    </Link>
                </div>
            </SectionWrapper>

            {/* ── Partner Institutions ───────────────────────────────────────── */}
            <SectionWrapper
                className="bg-background border-t"
                title="Institutional Partners"
                description="Our programs are backed by leading universities, government agencies, and Nigeria's most impactful corporations."
            >
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-8">
                    {partners.length > 0 ? partners.map((partner) => (
                        <div key={partner.id} className="flex flex-col items-center justify-center text-center p-4 rounded-xl border border-border/50 hover:border-primary/40 transition-colors min-h-[90px]">
                            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                                <Building2 className="h-4 w-4 text-primary" />
                            </div>
                            <p className="text-xs font-medium leading-tight">{partner.first_name} {partner.last_name}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">{partner.role}</p>
                        </div>
                    )) : (
                        <p className="col-span-full text-center text-sm text-muted-foreground py-8">No partners listed yet.</p>
                    )}
                </div>
                <div className="mt-10 text-center">
                    <Link href="/partners">
                        <Button variant="outline" size="lg">View All Partners</Button>
                    </Link>
                </div>
            </SectionWrapper>

            {/* ── Latest Updates ─────────────────────────────────────────────── */}
            <SectionWrapper
                className="bg-muted/20 border-t"
                title="Latest News & Updates"
                action={
                    <Link href="/news">
                        <Button variant="ghost" className="text-primary">
                            View All <ArrowRight className="ml-1 h-4 w-4" />
                        </Button>
                    </Link>
                }
            >
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                    {news.map((article) => (
                        <Card key={article.id} className="border-border/50 hover:border-primary/40 transition-colors overflow-hidden flex flex-col">
                            <div className="aspect-video bg-muted/50 relative flex items-center justify-center">
                                <div className="text-muted-foreground/15 text-8xl font-black">{article.priority[0]}</div>
                                <Badge variant="secondary" className="absolute top-3 left-3 text-xs">{article.priority} Priority</Badge>
                            </div>
                            <CardContent className="pt-4 flex-1 flex flex-col gap-2">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(article.created_at).toLocaleDateString()}
                                </div>
                                <h3 className="font-bold text-sm leading-snug line-clamp-2">{article.title}</h3>
                                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed flex-1">{article.summary}</p>
                                <Button variant="ghost" className="p-0 h-auto text-xs text-primary font-medium self-start mt-2">
                                    Read More <ArrowRight className="ml-1 h-3 w-3" />
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                    {news.length === 0 && (
                        <p className="col-span-full text-center text-sm text-muted-foreground py-8">No news updates yet.</p>
                    )}
                </div>
            </SectionWrapper>

            {/* ── Call to Apply ──────────────────────────────────────────────── */}
            <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[80%] rounded-full bg-white blur-[100px]" />
                </div>
                <div className="container mx-auto px-4 text-center max-w-3xl relative z-10 space-y-6">
                    <Badge className="bg-primary-foreground/20 text-primary-foreground border-none hover:bg-primary-foreground/20">
                        Applications Close April 30, 2026
                    </Badge>
                    <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Are you the next NTDI Scholar?</h2>
                    <p className="text-xl text-primary-foreground/80 leading-relaxed">
                        Selection is entirely merit-based. Academic excellence + national commitment + character = your candidacy. The nation is watching for its next leaders.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
                        <Link href="/apply">
                            <Button size="lg" variant="secondary" className="h-14 px-10 text-lg font-semibold">
                                Begin Application
                            </Button>
                        </Link>
                        <Link href="/programs">
                            <Button size="lg" variant="outline" className="h-14 px-10 text-lg border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10">
                                Review Eligibility
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
