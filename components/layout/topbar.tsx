import { Bell, Menu, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SidebarContent } from "./sidebar";
import { ThemeToggle } from "./theme-toggle";

interface TopbarProps {
  role?: "applicant" | "scholar" | "donor" | "admin";
  notificationCount?: number;
}

const searchPlaceholders = {
  applicant: "Search applications, deadlines…",
  scholar: "Search milestones, mentors, messages…",
  donor: "Search scholars, reports, funding…",
  admin: "Search applications, scholars, funding…",
};

const navigationTitles = {
  applicant: "Applicant navigation",
  scholar: "Scholar navigation",
  donor: "Donor navigation",
  admin: "Admin navigation",
};

export function Topbar({ role = "admin", notificationCount = 0 }: TopbarProps) {
  return (
    <header className="h-14 border-b border-border/50 bg-background flex items-center justify-between px-4 md:px-5 sticky top-0 z-30">
      {/* Left: mobile menu trigger + search */}
      <div className="flex items-center gap-3 flex-1">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden h-8 w-8">
              <Menu className="h-4 w-4" />
              <span className="sr-only">Toggle Sidebar</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-56">
            <SheetHeader className="sr-only">
              <SheetTitle>{navigationTitles[role]}</SheetTitle>
              <SheetDescription>
                Browse sections available in the current dashboard.
              </SheetDescription>
            </SheetHeader>
            <SidebarContent role={role} />
          </SheetContent>
        </Sheet>

        {/* Search — desktop only */}
        <div className="relative hidden md:flex items-center w-full max-w-xs">
          <Search className="absolute left-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder={searchPlaceholders[role]}
            className="pl-8 h-8 text-xs bg-muted/40 border-border/40 focus-visible:bg-background w-full"
          />
          <kbd className="absolute right-2.5 text-[10px] text-muted-foreground border border-border/50 rounded px-1 py-px pointer-events-none hidden lg:block">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right: notification bell */}
      <div className="flex items-center gap-2">
        <ThemeToggle />

        <Button
          variant="outline"
          size="icon"
          className="relative h-8 w-8 border-border/50"
          aria-label="Notifications"
        >
          <Bell className="h-3.5 w-3.5" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center border-2 border-background">
              {notificationCount > 9 ? "9+" : notificationCount}
            </span>
          )}
        </Button>
      </div>
    </header>
  );
}
