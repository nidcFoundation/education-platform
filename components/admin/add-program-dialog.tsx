"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createProgram } from "@/lib/supabase/actions";

export function AddProgramDialog() {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);

        const formData = new FormData(event.currentTarget);
        const data = {
            name: formData.get("name") as string,
            title: formData.get("title") as string,
            program_lead: formData.get("lead") as string,
            total_budget: Number(formData.get("budget")) || 0,
        };

        const result = await createProgram(data);

        setIsLoading(false);

        if (result.error) {
            alert(`Failed to add program: ${result.error}`);
            return;
        }

        alert(`Program created: ${data.name} is now active.`);

        setOpen(false);
        router.refresh();
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add Program
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={onSubmit}>
                    <DialogHeader>
                        <DialogTitle>Create New Program</DialogTitle>
                        <DialogDescription>
                            Initialize a new programme track with an approved budget and accountable lead.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">System Name</Label>
                            <Input id="name" name="name" required placeholder="e.g. data-science-2026" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="title">Display Title</Label>
                            <Input id="title" name="title" required placeholder="e.g. Applied Data Science Track" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="lead">Programme Lead</Label>
                            <Input id="lead" name="lead" required placeholder="Name of director or manager..." />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="budget">Approved Total Budget (₦)</Label>
                            <Input id="budget" name="budget" type="number" required min="0" defaultValue="0" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Create Program
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
