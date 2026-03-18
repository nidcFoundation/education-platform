import { Suspense } from "react";
import { SignupClient } from "./signup-client";

export default function SignupPage() {
    return (
        <Suspense fallback={
            <div className="w-full max-w-lg py-20 mx-auto text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground animate-pulse">Loading secure signup context...</p>
            </div>
        }>
            <SignupClient />
        </Suspense>
    );
}
