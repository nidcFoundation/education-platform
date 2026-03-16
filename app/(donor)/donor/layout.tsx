import { ReactNode } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default function DonorLayout({ children }: { children: ReactNode }) {
    return (
        <DashboardLayout role="donor">
            {children}
        </DashboardLayout>
    );
}
