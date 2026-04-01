"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, MoreHorizontal, ShieldAlert, Sparkles, UserCheck, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updateProfile } from "@/lib/supabase/actions";

interface UserActionsDropdownProps {
    userId: string;
    currentRole: string;
    currentStatus: string;
}

export function UserActionsDropdown({ userId, currentRole, currentStatus }: UserActionsDropdownProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    async function handleUpdate(changes: { role?: string; status?: string }) {
        setIsLoading(true);
        const { error } = await updateProfile(userId, changes as any);
        setIsLoading(false);

        if (error) {
            alert(`Failed to update user: ${error}`);
            return;
        }

        router.refresh();
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" disabled={isLoading}>
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Manage Access</DropdownMenuLabel>
                <DropdownMenuSeparator />

                {currentStatus === "pending" && (
                    <DropdownMenuItem onClick={() => handleUpdate({ status: "active" })}>
                        <UserCheck className="mr-2 h-4 w-4 text-emerald-600" />
                        Activate Account
                    </DropdownMenuItem>
                )}
                {currentStatus === "active" && (
                    <DropdownMenuItem onClick={() => handleUpdate({ status: "suspended" })}>
                        <UserX className="mr-2 h-4 w-4 text-red-600" />
                        Suspend Account
                    </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />
                <DropdownMenuLabel>Change Role</DropdownMenuLabel>

                {currentRole !== "applicant" && (
                    <DropdownMenuItem onClick={() => handleUpdate({ role: "applicant" })}>
                        Demote to Applicant
                    </DropdownMenuItem>
                )}
                {currentRole !== "scholar" && (
                    <DropdownMenuItem onClick={() => handleUpdate({ role: "scholar" })}>
                        <Sparkles className="mr-2 h-4 w-4 text-sky-600" />
                        Promote to Scholar
                    </DropdownMenuItem>
                )}
                {currentRole !== "reviewer" && (
                    <DropdownMenuItem onClick={() => handleUpdate({ role: "reviewer" })}>
                        Make Reviewer
                    </DropdownMenuItem>
                )}
                {currentRole !== "admin" && (
                    <DropdownMenuItem onClick={() => handleUpdate({ role: "admin" })}>
                        <ShieldAlert className="mr-2 h-4 w-4 text-amber-600" />
                        Grant Admin
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
