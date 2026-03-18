export const AUTH_INTENTS = ["applicant", "donor", "partner"] as const;

export type AuthIntent = (typeof AUTH_INTENTS)[number];

export const APP_ROLES = [
    "applicant",
    "donor",
    "scholar",
    "admin",
    "reviewer",
    "partner",
] as const;

export type AppRole = (typeof APP_ROLES)[number];

const APPLICANT_PREFIXES = ["/dashboard", "/application", "/status", "/notifications", "/settings"];
const ADMIN_ROLES: AppRole[] = ["admin", "reviewer", "partner"];

function matchesProtectedPrefix(pathname: string, prefix: string): boolean {
    return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export function isAuthIntent(value: string | null): value is AuthIntent {
    return value !== null && AUTH_INTENTS.includes(value as AuthIntent);
}

export function getRoleForIntent(intent: AuthIntent): AppRole {
    return intent;
}

export function getDefaultRedirectPath(role?: string | null): string {
    switch (role) {
        case "admin":
        case "partner":
        case "reviewer":
            return "/admin";
        case "donor":
            return "/donor";
        case "scholar":
            return "/scholar";
        case "applicant":
        default:
            return "/dashboard";
    }
}

export function getRoleFromMetadata(metadata: unknown): AppRole {
    if (metadata && typeof metadata === "object") {
        const candidateRole = "role" in metadata ? metadata.role : null;
        if (typeof candidateRole === "string" && APP_ROLES.includes(candidateRole as AppRole)) {
            return candidateRole as AppRole;
        }

        const candidateType = "account_type" in metadata ? metadata.account_type : null;
        if (typeof candidateType === "string" && APP_ROLES.includes(candidateType as AppRole)) {
            return candidateType as AppRole;
        }
    }

    return "applicant";
}

export function isProtectedPath(pathname: string): boolean {
    if (matchesProtectedPrefix(pathname, "/admin")) return true;
    if (matchesProtectedPrefix(pathname, "/donor")) return true;
    if (matchesProtectedPrefix(pathname, "/scholar")) return true;

    return APPLICANT_PREFIXES.some((prefix) => matchesProtectedPrefix(pathname, prefix));
}

export function canAccessPath(pathname: string, role: AppRole): boolean {
    if (matchesProtectedPrefix(pathname, "/admin")) {
        return ADMIN_ROLES.includes(role);
    }

    if (matchesProtectedPrefix(pathname, "/donor")) {
        return role === "donor";
    }

    if (matchesProtectedPrefix(pathname, "/scholar")) {
        return role === "scholar";
    }

    if (APPLICANT_PREFIXES.some((prefix) => matchesProtectedPrefix(pathname, prefix))) {
        return role === "applicant";
    }

    return true;
}
