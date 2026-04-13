import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart } from "lucide-react";

export function Hero() {
    return (
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute top-20 left-10 w-96 h-96 bg-[#c87941] rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#8b6f47] rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-6xl mx-auto relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="animate-fade-in-up">
              <div className="inline-block px-4 py-1.5 bg-[#c87941]/10 text-[#c87941] text-sm font-medium rounded-full mb-6">
                Transforming Lives Through Education
              </div>
            </div>

            <h1 className="font-serif font-bold text-6xl md:text-7xl lg:text-8xl leading-[1.1] mb-8 animate-fade-in-up delay-1">
              Building Nigeria’s Next Generation of System Builders
              <br />
            </h1>

            <p className="text-xl md:text-2xl text-[#5a524d] leading-relaxed mb-12 max-w-3xl mx-auto font-light animate-fade-in-up delay-2">
              A structured system for identifying, developing, and deploying
              individuals committed to building real systems across engineering,
              technology, and infrastructure
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-3">
              <Button className={`px-8 py-4 bg-[#c87941] text-white font-medium rounded-full hover:bg-[#b36935] transition-all hover:shadow-2xl hover:scale-105 flex items-center justify-center gap-2 group`}>
                Join now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <button className="px-8 py-4 bg-white text-[#c87941] font-medium rounded-full border-2 border-[#c87941] hover:bg-[#c87941] hover:text-white transition-all flex items-center justify-center gap-2">
                <Heart className="w-5 h-5" />
                Learn more
              </button>
            </div>
          </div>
        </div>
      </section>
    );
}
