import { Sponsor, FundingRecord } from "@/types";

export const mockSponsors: Sponsor[] = [
    {
        id: "sp-1",
        name: "Crescent Impact Fund",
        category: "International Development",
        commitment: "₦18.5M",
        focusAreaIds: ["fa-tech", "fa-health"],
        status: "Active",
    },
    {
        id: "sp-2",
        name: "NITDA Innovation Fund",
        category: "Government Agency",
        commitment: "₦42.0M",
        focusAreaIds: ["fa-tech"],
        status: "Active",
    },
    {
        id: "sp-3",
        name: "Sustainable Africa Trust",
        category: "Corporate Foundation",
        commitment: "₦25.6M",
        focusAreaIds: ["fa-energy"],
        status: "Renewal due",
    },
];

export const mockFundingRecords: FundingRecord[] = [
    {
        id: "fund-1",
        sponsorId: "sp-1",
        programId: "prog-tech",
        amount: "₦5.0M",
        type: "disbursement",
        status: "Disbursed",
        date: "2026-01-15",
    },
    {
        id: "fund-2",
        sponsorId: "sp-2",
        programId: "prog-tech",
        amount: "₦10.5M",
        type: "commitment",
        status: "Committed",
        date: "2026-02-20",
    },
    {
        id: "fund-3",
        sponsorId: "sp-1",
        scholarId: "usr-5",
        amount: "₦350,000",
        type: "stipend",
        status: "Disbursed",
        date: "2026-03-01",
    },
];
