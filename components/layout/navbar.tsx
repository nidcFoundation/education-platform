"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Button, buttonVariants } from "../ui/button";
import { ThemeToggle } from "./theme-toggle";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const linksRef = useRef<HTMLAnchorElement[]>([]);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      if (open) {
        // Prevent body scroll when menu is open
        document.body.style.overflow = "hidden";

        gsap.fromTo(
          overlayRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.3, ease: "power2.out" }
        );
        gsap.fromTo(
          menuRef.current,
          { x: "100%" },
          { x: "0%", duration: 0.4, ease: "power3.out" }
        );
        gsap.fromTo(
          linksRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, stagger: 0.08, delay: 0.2, duration: 0.4 }
        );
      } else {
        document.body.style.overflow = "";

        gsap.to(overlayRef.current, { opacity: 0, duration: 0.25 });
        gsap.to(menuRef.current, {
          x: "100%",
          duration: 0.3,
          ease: "power3.in",
        });
      }
    },
    { dependencies: [open] }
  );

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Apply", href: "/apply" },
    { name: "Donate", href: "/donate" },
    { name: "Transparency", href: "/transparency" },
  ];

  return (
    <>
      <nav className="w-full border-b border-border/50 bg-background/95 backdrop-blur-sm sticky top-0 z-50 px-4 sm:px-8">
        <div className="mx-auto flex items-center justify-between py-3 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">
                N
              </span>
            </div>
            <span className="font-bold text-sm sm:inline-block tracking-tight">
              National Talent Initiative
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-md hover:bg-muted/50"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center gap-6">
            <ThemeToggle />
            <Link href="/apply">
              <Button size="sm" className="rounded-md gap-2 text-sm">
                Apply Now
              </Button>
            </Link>
          </div>

          {/* Mobile Right */}
          <div className="flex md:hidden items-center gap-6">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => setOpen((prev) => !prev)}
              aria-label="Toggle menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Overlay */}
      <div
        ref={overlayRef}
        onClick={() => setOpen(false)}
        className="fixed inset-0 z-40 bg-black/40 md:hidden"
        style={{ opacity: 0, pointerEvents: open ? "auto" : "none" }}
      />

      {/* Mobile Menu */}
      <div
        ref={menuRef}
        className="fixed top-0 right-0 h-full w-full bg-background border-l border-border/50 z-50 flex flex-col md:hidden"
        style={{ transform: "translateX(100%)" }}
      >
        {/* Menu Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
          <Link
            href="/"
            className="flex items-center gap-2"
            onClick={() => setOpen(false)}
          >
            <div className="h-7 w-7 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">
                N
              </span>
            </div>
            <span className="font-bold text-sm tracking-tight">
              National Talent Initiative
            </span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Menu Links */}
        <div className="flex flex-col px-4 py-6 gap-1 flex-1">
          {navLinks.map((link, i) => (
            <Link
              key={link.name}
              href={link.href}
              ref={(el) => {
                if (el) linksRef.current[i] = el;
              }}
              onClick={() => setOpen(false)}
              className="text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 px-3 py-3 rounded-md transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Menu Footer CTA */}
        <div className="px-4 pb-8 pt-4 border-t border-border/50 flex flex-col gap-3">
          <Link href="/apply" onClick={() => setOpen(false)}>
            <Button className="w-full rounded-md gap-2">
              Apply for Scholarship
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link
            href="/donate"
            onClick={() => setOpen(false)}
            className={
              buttonVariants({ variant: "outline" }) + " w-full rounded-md"
            }
          >
            Support a Student
          </Link>
        </div>
      </div>
    </>
  );
}
