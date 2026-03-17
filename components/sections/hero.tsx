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
                        <div className="space-y-6">
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[#1A1A1A] leading-[1.1]">
                                Building Nigeria&apos;s Most Critical <br />
                                <span className="text-primary">Talent Infrastructure</span>
                            </h1>
                            <p className="text-lg md:text-xl text-[#4A4A4A] leading-relaxed">
                                A national commitment to identify, fund, and deploy exceptional Nigerian talent — transforming brilliance into measurable impact across every sector of the economy.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <Link href="/apply">
                                <Button size="lg" className="rounded-full px-8 py-6 text-base font-semibold bg-[#1A1A1A] text-white hover:bg-[#2A2A2A]">
                                    Apply Now <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="/about">
                                <Button size="lg" variant="ghost" className="rounded-full px-8 py-6 text-base font-semibold text-[#1A1A1A]">
                                    About the Initiative
                                </Button>
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
