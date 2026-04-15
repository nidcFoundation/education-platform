import { ReactNode } from "react";
import { Footer } from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";

export default function PublicLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />
            <main className="flex-1 flex flex-col">
                {children}
            </main>
            <Footer />
        </div>
    );
}
