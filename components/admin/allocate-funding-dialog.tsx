"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { allocateFunding } from "@/lib/supabase/actions";
import { Loader2, Plus } from "lucide-react";

interface Profile {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
}

interface Sponsor extends Profile {
    donor_details?: {
        commitment: string;
    };
}

interface Program {
    id: string;
    name: string;
}

interface AllocateFundingDialogProps {
    sponsors: Sponsor[];
    scholars: Profile[];
    programs: Program[];
}

export function AllocateFundingDialog({ sponsors, scholars, programs }: AllocateFundingDialogProps) {
    const [open, setOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const [sponsorId, setSponsorId] = useState("");
    const [scholarId, setScholarId] = useState("");
    const [programId, setProgramId] = useState("none");
    const [amount, setAmount] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSaving(true);

        try {
            const parsedAmount = parseFloat(amount);
            if (isNaN(parsedAmount) || parsedAmount <= 0) {
                throw new Error("Please enter a valid amount.");
            }
            if (!sponsorId || !scholarId) {
                throw new Error("Please select both a sponsor and a scholar.");
            }

            const { error: submitError } = await allocateFunding(
                sponsorId,
                scholarId,
                parsedAmount,
                programId === "none" ? undefined : programId
            );

            if (submitError) throw new Error(submitError);

            setOpen(false);
            setSponsorId("");
            setScholarId("");
            setAmount("");
            setProgramId("none");
            router.refresh();
        } catch (err: any) {
            setError(err.message || "Failed to allocate funds.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Allocate Funds
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Allocate Funds</DialogTitle>
                        <DialogDescription>
                            Map a donor&apos;s financial gift to a specific scholar. This will create a completed disbursement record.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        {error && <p className="text-sm font-medium text-destructive">{error}</p>}

                        <div className="space-y-2">
                            <Label htmlFor="sponsor">Sponsor</Label>
                            <Select value={sponsorId} onValueChange={setSponsorId} required>
                                <SelectTrigger id="sponsor">
                                    <SelectValue placeholder="Select perfectly capable sponsor..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {sponsors.map((s) => (
                                        <SelectItem key={s.id} value={s.id}>
                                            {s.first_name} {s.last_name} {s.donor_details?.commitment ? `(${s.donor_details.commitment})` : ''}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="scholar">Scholar</Label>
                            <Select value={scholarId} onValueChange={setScholarId} required>
                                <SelectTrigger id="scholar">
                                    <SelectValue placeholder="Select recipient scholar..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {scholars.map((s) => (
                                        <SelectItem key={s.id} value={s.id}>
                                            {s.first_name} {s.last_name} ({s.email})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="program">Program (Optional)</Label>
                            <Select value={programId} onValueChange={setProgramId}>
                                <SelectTrigger id="program">
                                    <SelectValue placeholder="Select associated program..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                    {programs.map((p) => (
                                        <SelectItem key={p.id} value={p.id}>
                                            {p.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="amount">Amount (₦)</Label>
                            <Input
                                id="amount"
                                type="number"
                                min="0"
                                step="1000"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="Enter disbursement amount"
                                required
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isSaving}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSaving}>
                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Allocate
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
