"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const subtitleRef = useRef<HTMLParagraphElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLDivElement | null>(null);
  const glow1 = useRef<HTMLDivElement | null>(null);
  const glow2 = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(titleRef.current, { y: 80, opacity: 0, duration: 1 })
        .from(
          subtitleRef.current,
          { y: 40, opacity: 0, duration: 0.8 },
          "-=0.6"
        )
        .from(
          ctaRef.current?.children || [],
          { y: 30, opacity: 0, stagger: 0.15, duration: 0.6 },
          "-=0.5"
        )
        .from(
          imageRef.current,
          { scale: 0.9, opacity: 0, duration: 1.2 },
          "-=0.8"
        );

      gsap.to(glow1.current, {
        x: 60,
        y: -40,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(glow2.current, {
        x: -50,
        y: 50,
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(imageRef.current, {
        y: -80,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          scrub: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden pt-24 md:pt-32 pb-20 md:pb-24 px-4 sm:px-6"
    >
      {/* Background Glow */}
      <div className="absolute inset-0 -z-10">
        <div
          ref={glow1}
          className="absolute top-20 left-10 w-[300px] md:w-[400px] h-[300px] md:h-[400px] bg-primary/20 blur-3xl rounded-full"
        />
        <div
          ref={glow2}
          className="absolute bottom-20 right-10 w-[300px] md:w-[400px] h-[300px] md:h-[400px] bg-orange-400/20 blur-3xl rounded-full"
        />
      </div>

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* ── Text Section ── */}
        <div className="text-center md:text-left order-1">
          {/* Editorial label */}
          <p className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-3 justify-center md:justify-start mb-5">
            <span className="inline-block w-7 h-px bg-primary" />
            Transforming Lives Through Education
          </p>

          {/* Headline — scaled down for mobile */}
          <h1
            ref={titleRef}
            className="font-serif font-bold text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight tracking-tight mb-5"
          >
            Every Student
            <br />
            Deserves
            <br />
            <span className="text-muted-foreground font-medium">a Chance.</span>
          </h1>

          <p
            ref={subtitleRef}
            className="text-base md:text-lg text-muted-foreground mb-8 max-w-lg mx-auto md:mx-0 leading-relaxed"
          >
            We connect talented Nigerian students with funding and universities
            — unlocking access to higher education and life-changing
            opportunities.
          </p>

          {/* CTAs */}
          <div
            ref={ctaRef}
            className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start mb-8"
          >
            <Link href="/apply" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto px-7 py-5 text-sm rounded-md flex items-center justify-center gap-2 group">
                Apply for Scholarship
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/donate" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full sm:w-auto px-7 py-5 text-sm rounded-md flex items-center justify-center gap-2"
              >
                <Heart className="w-4 h-4" />
                Support a Student
              </Button>
            </Link>
          </div>

          {/* Stats row */}
          <div className="flex border-y border-border/50 divide-x divide-border/50 max-w-sm mx-auto md:mx-0">
            {[
              { value: "5,000+", label: "Students" },
              { value: "₦200M+", label: "Funding" },
              { value: "20+", label: "Universities" },
            ].map((stat, i) => (
              <div
                key={i}
                className={`flex-1 py-3 ${
                  i === 0 ? "pr-4" : i === 2 ? "pl-4" : "px-4"
                }`}
              >
                <div className="text-lg font-bold tracking-tight text-foreground leading-none">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Image Section ── */}
        {/* pb-8 gives clearance so the absolutely-positioned floating card doesn't overflow */}
        <div
          ref={imageRef}
          className="relative flex justify-center order-2 pb-8 sm:pb-10 mt-4 md:mt-0"
        >
          <div className="relative w-full max-w-md md:max-w-none">
            <Image
              src="/hero-students.png"
              alt="Students celebrating scholarship"
              width={600}
              height={500}
              className="rounded-xl shadow-xl w-full object-cover"
            />

            {/* Floating card — hidden on very small screens to prevent overflow */}
            <div className="hidden sm:block absolute -bottom-5 -left-4 md:-left-5 bg-background border border-border rounded-xl p-3 md:p-4 shadow-md min-w-[150px] md:min-w-[160px]">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                Scholarships Awarded
              </p>
              <p className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
                ₦200M+
              </p>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500" />
                <span className="text-[11px] text-green-600 dark:text-green-400 font-medium">
                  Active programme
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
