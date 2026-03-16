"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    FileText,
    Users,
    Settings,
    GraduationCap,
    Banknote,
    Bell,
    Briefcase,
    ClipboardList,
    Flag,
    Mail,
    MessageSquare,
    User,
} from "lucide-react";

interface SidebarProps {
    role?: "applicant" | "scholar" | "donor" | "admin";
}

export function Sidebar({ role = "applicant" }: SidebarProps) {
    const pathname = usePathname();

    const roleLinks = {
      applicant: [
        { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { href: "/application", icon: FileText, label: "My Application" },
        { href: "/notifications", icon: Bell, label: "Notifications" },
        { href: "/settings", icon: Settings, label: "Settings" },
      ],
      scholar: [
        { href: "/scholar", icon: LayoutDashboard, label: "Dashboard" },
        { href: "/scholar/profile", icon: User, label: "Profile" },
        {
          href: "/scholar/academic-journey",
          icon: GraduationCap,
          label: "Academic Journey",
        },
        { href: "/scholar/milestones", icon: Flag, label: "Milestones" },
        {
          href: "/scholar/progress-reports",
          icon: ClipboardList,
          label: "Progress Reports",
        },
        {
          href: "/scholar/mentor-feedback",
          icon: MessageSquare,
          label: "Mentor Feedback",
        },
        {
          href: "/scholar/funding-overview",
          icon: Banknote,
          label: "Funding Overview",
        },
        {
          href: "/scholar/opportunities",
          icon: Briefcase,
          label: "Opportunities",
        },
        { href: "/scholar/documents", icon: FileText, label: "Documents" },
        { href: "/scholar/announcements", icon: Bell, label: "Announcements" },
        { href: "/scholar/messages", icon: Mail, label: "Messages" },
        { href: "/scholar/settings", icon: Settings, label: "Settings" },
      ],
      donor: [
        { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { href: "/funding", icon: Banknote, label: "Funding" },
        { href: "/settings", icon: Settings, label: "Settings" },
      ],
      admin: [
        { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { href: "/admin/applications", icon: FileText, label: "Applications" },
        { href: "/admin/scholars", icon: Users, label: "Scholars" },
        {
          href: "/admin/funding",
          icon: Banknote,
          label: "Funding Distribution",
        },
        { href: "/settings", icon: Settings, label: "Settings" },
      ],
    } as const;

    const roleMeta = {
      applicant: {
        homeHref: "/dashboard",
        productLabel: "Applicant Portal",
        userName: "John Doe",
      },
      scholar: {
        homeHref: "/scholar",
        productLabel: "Scholar Portal",
        userName: "Amara Okafor",
      },
      donor: {
        homeHref: "/dashboard",
        productLabel: "Funding Portal",
        userName: "Donor Partner",
      },
      admin: {
        homeHref: "/dashboard",
        productLabel: "Admin Console",
        userName: "Programme Admin",
      },
    } as const;
    const links = roleLinks[role];
    const meta = roleMeta[role];

    return (
        <aside className="w-64 border-r bg-background hidden md:flex flex-col min-h-screen sticky top-0">
            <div className="h-16 flex items-center px-6 border-b">
                <Link href={meta.homeHref} className="flex items-center space-x-2">
                    <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
                        <span className="text-primary-foreground font-bold text-sm">N</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-sm leading-none">Talent Initiative</span>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-1">{meta.productLabel}</span>
                    </div>
                </Link>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                {links.map((link) => {
                    const isScholarHomeLink = role === "scholar" && link.href === meta.homeHref;
                    const isActive =
                        pathname === link.href ||
                        (!isScholarHomeLink && pathname.startsWith(`${link.href}/`));
                    const Icon = link.icon;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            <Icon className="h-4 w-4" />
                            {link.label}
                        </Link>
                    );
                })}
            </nav>
            <div className="p-4 border-t">
                <div className="flex items-center gap-3 px-3 py-2">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium leading-none">{meta.userName}</span>
                        <span className="text-xs text-muted-foreground mt-1 capitalize">{role}</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}
