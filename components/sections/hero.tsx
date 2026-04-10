import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function Hero() {
    return (
        <section className="bg-[#F9F6F3] py-20 lg:py-32 overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    <div className="space-y-8 lg:max-w-xl">
                        <div className="animate-fade-in-up">
                            <div className="inline-block px-4 py-1.5 bg-primary/10 text-forground/10 text-sm text-center rounded-full">
                                Transforming Lives Through Education
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[#1A1A1A] leading-[1.1]">
                                Every Student <br className="max-sm:hidden" />
                                <span className="text-primary">Deserves a Chance</span>
                            </h1>
                            <p className="text-md md:text-xl text-[#4A4A4A] leading-relaxed">
                                We connect talented Nigerian students who face financial barriers with
                                partner universities and funding opportunities — creating pathways to
                                higher education and brighter futures.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-4 items-center">
                            <Link href="/apply">
                                <Button size="lg" className="rounded-full px-8 py-6 text-base font-semibold bg-[#1A1A1A] text-white hover:bg-[#2A2A2A]">
                                    Apply for Scholarship <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="/donate">
                                <Button size="lg" variant="outline" className="rounded-full px-8 py-6 text-base font-semibold border-[#1A1A1A] text-[#1A1A1A] hover:bg-muted/50">
                                    Become a Donor
                                </Button>
                            </Link>
                            <Link href="/partner-with-us" className="text-sm font-semibold text-[#4A4A4A] hover:text-primary transition-colors ml-2">
                                Partner with Us
                            </Link>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-[#D1E8E2]">
                            <Image
                                src="/hero-student.png"
                                alt="Nigerian Student Scholar"
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                        <div className="absolute -z-10 -bottom-10 -right-10 w-64 h-64 rounded-full bg-primary/10 blur-3xl opacity-50" />
                    </div>
                </div>
            </div>
        </section>
    );
}
