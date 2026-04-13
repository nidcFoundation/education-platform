'use client'

import Link from 'next/link'
import { useState, useRef } from 'react'
import { Menu, X } from 'lucide-react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Button, buttonVariants } from '../ui/button'
import { ThemeToggle } from './theme-toggle'

export default function Navbar() {
    const [open, setOpen] = useState(false)

    const menuRef = useRef<HTMLDivElement | null>(null)
    const linksRef = useRef<HTMLDivElement[]>([])

    // GSAP Animation
    useGSAP(
        () => {
            if (open) {
                gsap.fromTo(
                    menuRef.current,
                    { x: '100%' },
                    { x: '0%', duration: 0.4, ease: 'power3.out' }
                )

                gsap.fromTo(
                    linksRef.current,
                    { opacity: 0, y: 20 },
                    {
                        opacity: 1,
                        y: 0,
                        stagger: 0.1,
                        delay: 0.2,
                        duration: 0.4,
                    }
                )
            } else {
                gsap.to(menuRef.current, {
                    x: '100%',
                    duration: 0.3,
                    ease: 'power3.in',
                })
            }
        },
        { dependencies: [open] }
    )

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Apply', href: '/apply' },
        { name: 'Donate', href: '/donate' },
        { name: 'Transparency', href: '/transparency' },
    ]

    return (
      <nav className="w-full border-b bg-background sticky top-0 z-50 px-8">
        <div className="mx-auto flex items-center justify-between py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">
                N
              </span>
            </div>
            <span className="hidden font-bold sm:inline-block">
              National Talent Initiative
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex gap-6">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href}>
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="flex-center gap-4">
            <ThemeToggle />
          

            <Button
              className="md:hidden"
              onClick={() => setOpen((prev) => !prev)}
            >
              {open ? <X /> : <Menu />}
            </Button>
          </div>

          {/* Mobile Menu Button */}
        </div>

        {/* Mobile Menu */}
        <div
          ref={menuRef}
          className="fixed top-0 right-0 h-full w-full bg-white shadow-lg p-6 flex flex-col gap-6 md:hidden"
          style={{ transform: "translateX(100%)" }}
        >
          {navLinks.map((link, i) => (
            <Link
              key={link.name}
              href={link.href}
              ref={(el) => {
                if (el) linksRef.current[i] = el;
              }}
              onClick={() => setOpen(false)}
              className="text-lg font-medium"
            >
              {link.name}
            </Link>
          ))}

          <Link
            href="/donate"
            className={buttonVariants({
              variant: "default",
            })}
          >
            Donate
          </Link>
        </div>
      </nav>
    );
}