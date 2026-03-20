import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionWrapper } from "@/components/sections/section-wrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    CheckCircle2,
    ArrowRight,
    FileText,
    Users,
    GraduationCap,
    Calendar,
    ChevronDown,
    AlertCircle,
} from "lucide-react";
import {
    eligibilityRequirements,
    requiredDocuments as documentsData,
    applicationTimeline,
    publicFAQs as mockFAQs,
} from "@/lib/constants";

const iconMap: Record<string, any> = {
    FileText,
    Users,
    GraduationCap,
};

const requiredDocuments = documentsData.map(doc => ({
    ...doc,
    icon: iconMap[doc.icon] || FileText
}));

export default function ApplyPage() {
    return (
        <div className="flex flex-col w-full">
            {/* Hero */}
            <section className="bg-primary py-20 pb-16 text-primary-foreground relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[80%] rounded-full bg-white blur-[100px]" />
                </div>
                <div className="container mx-auto px-4 max-w-4xl relative z-10 space-y-6">
                    <Badge className="bg-primary-foreground/20 text-primary-foreground border-none hover:bg-primary-foreground/20">
                        Applications Open: 2025 Cohort
                    </Badge>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                        Apply for the Initiative
                    </h1>
                    <p className="text-xl text-primary-foreground/80 leading-relaxed max-w-3xl">
                        Selection is purely merit-based. If you have the talent, drive, and commitment to serve Nigeria, this platform was built for you.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 pt-2">
                        <Link href="/signup?intent=applicant">
                            <Button size="lg" variant="secondary" className="h-12 px-8 font-semibold">
                                Start Application <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                        <a href="#eligibility">
                            <Button size="lg" variant="outline" className="h-12 px-8 border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10">
                                Check Eligibility
                            </Button>
                        </a>
                    </div>
                </div>
            </section>

            {/* Deadline Alert */}
            <div className="bg-amber-50 border-b border-amber-200 py-4">
                <div className="container mx-auto px-4 flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
                    <p className="text-sm font-medium text-amber-800">
                        <strong>Application Deadline: April 30, 2026.</strong> The online portal closes at 11:59 PM WAT. All submissions must be complete — no extensions will be granted.
                    </p>
                </div>
            </div>

            {/* Eligibility */}
            <div id="eligibility">
                <SectionWrapper
                    title="Eligibility Requirements"
                    description="Candidates must satisfy all of the following criteria to be considered for the selection process."
                    className="bg-background"
                >
                    <div className="grid md:grid-cols-2 gap-6 mt-8">
                        {eligibilityRequirements.map((req, i) => (
                            <div key={i} className="flex gap-4 p-5 rounded-lg border bg-muted/20">
                                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                                <div>
                                    <h4 className="font-semibold mb-1">{req.label}</h4>
                                    <p className="text-sm text-muted-foreground">{req.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </SectionWrapper>
            </div>

            {/* Application Process Timeline */}
            <SectionWrapper
                title="Application Process"
                description="Five structured phases ensure a rigorous, fair, and transparent selection process."
                className="bg-muted/20 border-t"
            >
                <div className="max-w-3xl mx-auto mt-8">
                    <div className="relative border-l-2 border-primary/20 pl-8 space-y-10">
                        {applicationTimeline.map((item, i) => (
                            <div key={i} className="relative">
                                <div className={`absolute -left-[41px] top-1 h-6 w-6 rounded-full border-2 flex items-center justify-center ${item.isCompleted ? "bg-primary border-primary" : item.isActive ? "bg-background border-primary ring-4 ring-primary/20" : "bg-background border-muted-foreground/30"
                                    }`}>
                                    {item.isCompleted && <CheckCircle2 className="h-3 w-3 text-primary-foreground" />}
                                    {item.isActive && <div className="w-2 h-2 rounded-full bg-primary" />}
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-1">
                                    <span className="text-xs font-bold uppercase tracking-widest text-primary">{item.phase}</span>
                                    <Calendar className="h-3.5 w-3.5 text-muted-foreground hidden sm:block" />
                                    <span className="text-xs text-muted-foreground">{item.date}</span>
                                </div>
                                <h3 className={`text-xl font-bold mt-1.5 ${item.isActive ? "text-primary" : ""}`}>{item.title}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            </SectionWrapper>

            {/* Required Documents */}
            <SectionWrapper
                title="Required Documents"
                description="All documents must be uploaded digitally through the online portal. Physical submissions are not accepted."
                className="bg-background border-t"
            >
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
                    {requiredDocuments.map((doc, i) => (
                        <Card key={i} className="border-border/50 hover:border-primary/40 transition-colors">
                            <CardContent className="pt-6 flex gap-4">
                                <div className="h-9 w-9 rounded-md bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                    <doc.icon className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-1 text-sm">{doc.label}</h4>
                                    <p className="text-xs text-muted-foreground leading-relaxed">{doc.desc}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </SectionWrapper>

            {/* FAQ */}
            <SectionWrapper
                title="Frequently Asked Questions"
                className="bg-muted/20 border-t"
            >
                <div className="max-w-3xl mx-auto mt-8 space-y-4">
                    {mockFAQs.map((faq, i) => (
                        <Card key={i} className="border-border/50">
                            <CardHeader className="py-5">
                                <CardTitle className="text-base font-semibold flex justify-between items-start gap-4">
                                    <span>{faq.q}</span>
                                    <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                                </CardTitle>
                            </CardHeader>
                            <Separator />
                            <CardContent className="pt-5">
                                <p className="text-muted-foreground text-sm leading-relaxed">{faq.a}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </SectionWrapper>

            {/* CTA */}
            <section className="bg-primary text-primary-foreground py-20">
                <div className="container mx-auto px-4 text-center max-w-3xl space-y-6">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Ready to Apply?</h2>
                    <p className="text-lg text-primary-foreground/80">
                        The application portal is open. Begin your journey today — a nation is waiting for your contribution.
                    </p>
                    <Link href="/signup?intent=applicant">
                        <Button size="lg" variant="secondary" className="h-14 px-10 text-lg font-semibold">
                            Open Application Portal <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                    <p className="text-sm text-primary-foreground/60">Deadline: April 30, 2026 at 11:59 PM WAT</p>
                </div>
            </section>
        </div>
    );
}
