"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  LogOut,
} from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button, buttonVariants } from "@/components/ui/button";
import { toast } from "sonner";
import Image from "next/image";
import { ThemeToggle } from "./theme-toggle";

interface SidebarProps {
  role?: "applicant" | "scholar" | "donor" | "admin";
}

// Groups nav links into labelled sections per role
const roleSections = {
  applicant: [
    {
      label: "Overview",
      links: [
        { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { href: "/notifications", icon: Bell, label: "Notifications" },
      ],
    },
    {
      label: "Application",
      links: [
        { href: "/application", icon: FileText, label: "My Application" },
      ],
    },
    {
      label: "Account",
      links: [{ href: "/settings", icon: Settings, label: "Settings" }],
    },
  ],
  scholar: [
    {
      label: "Overview",
      links: [
        { href: "/scholar", icon: LayoutDashboard, label: "Dashboard" },
        { href: "/scholar/profile", icon: User, label: "Profile" },
        { href: "/scholar/announcements", icon: Bell, label: "Announcements" },
      ],
    },
    {
      label: "Academic",
      links: [
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
      ],
    },
    {
      label: "Support",
      links: [
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
        { href: "/scholar/messages", icon: Mail, label: "Messages" },
      ],
    },
    {
      label: "Account",
      links: [{ href: "/scholar/settings", icon: Settings, label: "Settings" }],
    },
  ],
  donor: [
    {
      label: "Overview",
      links: [{ href: "/donor", icon: LayoutDashboard, label: "Dashboard" }],
    },
    {
      label: "Impact",
      links: [
        {
          href: "/donor/sponsored-scholars",
          icon: Users,
          label: "Sponsored Scholars",
        },
        {
          href: "/donor/funding-allocation",
          icon: Banknote,
          label: "Funding Allocation",
        },
        {
          href: "/donor/impact-reports",
          icon: ClipboardList,
          label: "Impact Reports",
        },
        {
          href: "/donor/program-outcomes",
          icon: GraduationCap,
          label: "Program Outcomes",
        },
        {
          href: "/donor/annual-reports",
          icon: FileText,
          label: "Annual Reports",
        },
      ],
    },
    {
      label: "Account",
      links: [
        { href: "/donor/messages", icon: Mail, label: "Messages" },
        { href: "/donor/settings", icon: Settings, label: "Settings" },
      ],
    },
  ],
  admin: [
    {
      label: "Overview",
      links: [
        { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
        { href: "/admin/applications", icon: FileText, label: "Applications" },
        { href: "/admin/scholars", icon: Users, label: "Scholars" },
      ],
    },
    {
      label: "Programme",
      links: [
        { href: "/admin/programs", icon: GraduationCap, label: "Programs" },
        { href: "/admin/cohorts", icon: Flag, label: "Cohorts" },
        { href: "/admin/funding", icon: Banknote, label: "Funding" },
        { href: "/admin/sponsors", icon: Briefcase, label: "Sponsors" },
        {
          href: "/admin/impact-reports",
          icon: ClipboardList,
          label: "Impact Reports",
        },
      ],
    },
    {
      label: "System",
      links: [
        { href: "/admin/content", icon: MessageSquare, label: "Content" },
        { href: "/admin/users", icon: User, label: "Users" },
        { href: "/admin/settings", icon: Settings, label: "System Settings" },
      ],
    },
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
    homeHref: "/donor",
    productLabel: "Donor Dashboard",
    userName: "Crescent Impact Fund",
  },
  admin: {
    homeHref: "/admin",
    productLabel: "Admin Console",
    userName: "Programme Admin",
  },
} as const;

export function SidebarContent({ role = "applicant" }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const meta = roleMeta[role];
  const sections = roleSections[role];

  const [userProfile, setUserProfile] = useState<{
    name: string;
    avatarUrl?: string | null;
  }>({
    name: meta.userName,
    avatarUrl: null,
  });

  useEffect(() => {
    let isMounted = true;
    async function fetchProfile() {
      const supabase = getSupabaseBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("first_name, last_name, avatar_url")
        .eq("id", user.id)
        .single();
      if (error) console.error("Sidebar fetchProfile error:", error);
      if (profile && isMounted) {
        setUserProfile({
          name:
            `${profile.first_name || ""} ${profile.last_name || ""}`.trim() ||
            meta.userName,
          avatarUrl: profile.avatar_url,
        });
      }
    }
    fetchProfile();
    const handleProfileUpdate = () => fetchProfile();
    window.addEventListener("profileUpdated", handleProfileUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener("profileUpdated", handleProfileUpdate);
    };
  }, [meta.userName]);

  const handleSignOut = async () => {
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Sign-out failed", { description: error.message });
      return;
    }
    toast.success("Signed out", {
      description: "You have been successfully signed out.",
    });
    router.replace("/login");
    router.refresh();
  };

  const initials = userProfile.name
    ? userProfile.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase()
    : "?";

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="h-14 flex items-center px-4 border-b border-border/50 shrink-0 gap-2.5">
        <Link href={meta.homeHref} className="flex items-center gap-2.5">
          <div className="h-6 w-6 rounded-md bg-primary flex items-center justify-center shrink-0">
            <span className="text-primary-foreground font-bold text-[11px]">
              N
            </span>
          </div>
          <div>
            <p className="font-bold text-xs leading-none tracking-tight">
              Talent Initiative
            </p>
            <p className="text-[9px] uppercase tracking-[0.18em] text-muted-foreground mt-0.5">
              {meta.productLabel}
            </p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 overflow-y-auto">
        {sections.map((section) => (
          <div key={section.label} className="mb-4">
            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-muted-foreground px-2 py-1.5">
              {section.label}
            </p>
            <div className="space-y-px">
              {section.links.map((link) => {
                const homeHref = meta.homeHref;
                const isHome = link.href === homeHref;
                const isActive =
                  pathname === link.href ||
                  (!isHome && pathname.startsWith(`${link.href}/`));
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-2.5 px-2 py-2 rounded-md text-xs font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Footer */}
      <div className="px-2 pb-3 pt-2 py-6 border-t border-border/50 shrink-0">
        {/* User Info */}
        <div className="flex items-center gap-2.5 px-2 py-2 mb-1">
          {userProfile.avatarUrl ? (
            <Image
              src={userProfile.avatarUrl}
              alt="Avatar"
              width={28}
              height={28}
              className="rounded-full object-cover border border-border/50"
            />
          ) : (
            <div className="h-7 w-7 rounded-full bg-muted border border-border/50 flex items-center justify-center shrink-0">
              <span className="text-[10px] font-bold text-muted-foreground">
                {initials}
              </span>
            </div>
          )}

          <div className="min-w-0">
            <p className="text-xs font-medium leading-none truncate">
              {userProfile.name}
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5 capitalize">
              {role}
            </p>
          </div>
        </div>

        {/* Theme Toggle */}
        <div className="flex items-center justify-between px-2 py-2 rounded-md hover:bg-muted/50 transition-colors">
          <span className="text-xs text-muted-foreground">Theme</span>
          <ThemeToggle />
        </div>

        {/* Sign Out */}
        <Button
          onClick={handleSignOut}
          className={
            buttonVariants({ variant: "destructive" }) +
            " w-full rounded-md mt-2"
          }
        >
          <LogOut className="h-3.5 w-3.5 shrink-0 mr-2" />
          Sign out
        </Button>
      </div>
    </div>
  );
}

export function Sidebar({ role = "applicant" }: SidebarProps) {
  return (
    <aside className="w-56 border-r border-border/50 bg-background hidden md:flex flex-col min-h-screen sticky top-0">
      <SidebarContent role={role} />
    </aside>
  );
}
