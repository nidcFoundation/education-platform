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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { createSponsor } from "@/lib/supabase/actions";

export function AddSponsorDialog() {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);

        const formData = new FormData(event.currentTarget);
        const data = {
            first_name: formData.get("firstName") as string,
            last_name: formData.get("lastName") as string,
            email: formData.get("email") as string,
            category: formData.get("category") as string,
            investment_focus: formData.get("focus") as string,
            commitment: Number(formData.get("commitment")) || 0,
        };

        const result = await createSponsor(data);

        setIsLoading(false);

        if (result.error) {
            alert(`Failed to add sponsor: ${result.error}`);
            return;
        }

        alert(`Sponsor added: ${data.first_name} ${data.last_name} has been boarded as a donor.`);

        setOpen(false);
        router.refresh();
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add Sponsor
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={onSubmit}>
                    <DialogHeader>
                        <DialogTitle>Add New Sponsor</DialogTitle>
                        <DialogDescription>
                            Board a new institutional or private donor. Their profile will be created automatically.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="firstName">First name</Label>
                                <Input id="firstName" name="firstName" required placeholder="Jane" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="lastName">Last name</Label>
                                <Input id="lastName" name="lastName" required placeholder="Doe" />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email address</Label>
                            <Input id="email" name="email" type="email" required placeholder="contact@foundation.org" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="category">Sponsor Category</Label>
                            <Select name="category" required defaultValue="Institutional">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Institutional">Institutional</SelectItem>
                                    <SelectItem value="Corporate">Corporate</SelectItem>
                                    <SelectItem value="Private">Private</SelectItem>
                                    <SelectItem value="Government">Government</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="focus">Investment Focus</Label>
                            <Input id="focus" name="focus" required placeholder="e.g. Female Tech Leaders" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="commitment">Initial Commitment (₦)</Label>
                            <Input id="commitment" name="commitment" type="number" required min="0" defaultValue="0" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Create Sponsor
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
