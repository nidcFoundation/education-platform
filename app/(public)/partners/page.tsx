import { SectionWrapper } from "@/components/sections/section-wrapper";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, Globe2, Landmark, Handshake, ArrowRight } from "lucide-react";
import { getPublicHomeData } from "@/lib/supabase/actions";
import Link from "next/link";

interface Partner {
    id: string;
    name?: string;
    first_name?: string;
    last_name?: string;
    type?: string;
    tier?: string;
}

const typeIconMap: Record<string, typeof Globe2> = {
    "Academic Institution": Building2,
    "Government": Landmark,
    "Private Sector": Handshake,
    "Government Enterprise": Landmark,
    "International": Globe2,
};

const tierColorMap: Record<string, string> = {
    "Founding": "bg-primary/10 text-primary border-primary/20",
    "Core": "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400",
    "Strategic": "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400",
    "Corporate": "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400",
    "Development Partner": "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400",
};

export default async function PartnersPage() {
    const { partners } = await getPublicHomeData();

    return (
        <div className="flex flex-col w-full">
            {/* Hero */}
            <section className="bg-primary/5 py-20 pb-12 border-b">
                <div className="container mx-auto px-4 max-w-4xl space-y-6">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                        Partners & Institutions
                    </h1>
                    <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
                        The Initiative is anchored by a coalition of leading academic institutions, government agencies, and private-sector organizations united by a shared commitment to national development.
                    </p>
                    <Link href="#become-partner">
                        <Button size="lg" variant="outline">
                            Become a Partner <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Partner Types */}
            <SectionWrapper className="bg-background" title="Partnership Tiers">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
                    {[
                        { tier: "Founding", desc: "Institutional founders who provide endowment capital and foundational academic infrastructure." },
                        { tier: "Strategic", desc: "Government ministries and national agencies that provide policy alignment and regulatory backbone." },
                        { tier: "Corporate", desc: "Private sector organizations providing placements, internships, and co-funding for specialist tracks." },
                        { tier: "Development Partner", desc: "International development finance institutions that provide multilateral funding and global networks." },
                    ].map((pt, i) => (
                        <Card key={i} className="border-border/50">
                            <CardContent className="pt-6 space-y-3">
                                <Badge variant="outline" className={tierColorMap[pt.tier]}>{pt.tier}</Badge>
                                <p className="text-sm text-muted-foreground leading-relaxed">{pt.desc}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </SectionWrapper>

            {/* Partner Directory */}
            <SectionWrapper title="Partner Directory" className="bg-muted/20 border-t" description="Our growing coalition of institutional partners across academia, government, and industry.">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
                    {partners.map((partner: Partner) => {
                        const Icon = (partner.type && typeIconMap[partner.type]) || Globe2;
                        const partnerName = partner.name || `${partner.first_name || ""} ${partner.last_name || ""}`.trim() || "Anonymous Partner";
                        return (
                            <Card key={partner.id} className="border-border/50 hover:border-primary/40 transition-colors">
                                <CardContent className="pt-6 flex items-start gap-4">
                                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                        <Icon className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold leading-tight mb-1">{partnerName}</h3>
                                        <p className="text-xs text-muted-foreground mb-2">{partner.type || "Institutional Partner"}</p>
                                        <Badge variant="outline" className={`text-xs ${(partner.tier && tierColorMap[partner.tier]) || ""}`}>
                                            {partner.tier || "Strategic Partner"}
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                    {partners.length === 0 && (
                        <p className="col-span-full text-center text-muted-foreground py-12">No institutional partners listed yet.</p>
                    )}
                </div>
            </SectionWrapper>

            {/* What partners get */}
            <SectionWrapper
                title="Partnership Benefits"
                description="Why leading organizations partner with the National Talent Development Initiative."
                className="bg-background border-t"
            >
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
                    {[
                        { title: "Access to Elite Talent", desc: "Priority access to a pipeline of the nation's highest performing young professionals, pre-vetted and rigorously trained." },
                        { title: "Brand & Reputation", desc: "Association with a nationally recognized initiative that demonstrates tangible commitment to human capital development." },
                        { title: "Co-Research Opportunities", desc: "Collaborate with scholars and partner universities on R&D projects with direct sectoral applications." },
                        { title: "Policy Influence", desc: "Representation in the NTDI advisory board, shaping scholarship priorities and national talent strategy." },
                        { title: "Tax Incentives", desc: "Corporate partners qualify for government-recognized CSR tax benefits on all verified scholarship contributions." },
                        { title: "Transparent Impact Reporting", desc: "Receive detailed annual reports on how your contributions are utilized and the outcomes achieved." },
                    ].map((b, i) => (
                        <div key={i} className="space-y-2">
                            <div className="h-1 w-12 bg-primary rounded-full mb-4" />
                            <h3 className="font-bold text-lg">{b.title}</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">{b.desc}</p>
                        </div>
                    ))}
                </div>
            </SectionWrapper>

            {/* Become a Partner CTA */}
            <section id="become-partner" className="py-20 bg-primary text-primary-foreground border-t">
                <div className="container mx-auto px-4 text-center max-w-3xl space-y-6">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Partner With Us</h2>
                    <p className="text-lg text-primary-foreground/80">
                        Join the coalition building Nigeria's most important talent infrastructure. We are selective — and we build partnerships that last.
                    </p>
                    <Link href="/contact">
                        <Button size="lg" variant="secondary" className="h-14 px-8 text-base font-semibold">
                            Submit a Partnership Enquiry <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
