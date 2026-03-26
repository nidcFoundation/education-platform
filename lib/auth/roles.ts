import type { SupabaseClient, User } from "@supabase/supabase-js";

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
const AUTH_ROUTES = ["/login", "/signup"];

type RoleMetadata = Record<string, unknown>;
type ProfileRoleRow = {
    role?: unknown;
    account_type?: unknown;
};

function matchesProtectedPrefix(pathname: string, prefix: string): boolean {
    return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

function toAppRole(value: unknown): AppRole | null {
    if (typeof value !== "string") return null;
    return APP_ROLES.includes(value as AppRole) ? (value as AppRole) : null;
}

function extractRoleFromMetadata(metadata: unknown): AppRole | null {
    if (!metadata || typeof metadata !== "object") return null;

    const source = metadata as RoleMetadata;
    return toAppRole(source.role) ?? toAppRole(source.account_type);
}

export function isAuthIntent(value: string | null): value is AuthIntent {
    return value !== null && AUTH_INTENTS.includes(value as AuthIntent);
}

export function getRoleForIntent(intent: AuthIntent): AppRole {
    return intent;
}

export function resolveRoleFromSources(params: {
    profileRole?: unknown;
    profileAccountType?: unknown;
    userMetadata?: unknown;
    appMetadata?: unknown;
}): AppRole {
    return (
        toAppRole(params.profileRole) ??
        toAppRole(params.profileAccountType) ??
        extractRoleFromMetadata(params.userMetadata) ??
        extractRoleFromMetadata(params.appMetadata) ??
        "applicant"
    );
}

export async function resolveUserRoleForSession(
    supabase: SupabaseClient,
    user: Pick<User, "id" | "user_metadata" | "app_metadata">
): Promise<AppRole> {
    const { data: rawProfile, error } = await supabase
        .from("profiles")
        .select("role, account_type")
        .eq("id", user.id)
        .maybeSingle();

    if (error) {
        throw new Error(`Failed to resolve user role for session: ${error.message}`);
    }

    const profile = rawProfile as ProfileRoleRow | null;

    return resolveRoleFromSources({
        profileRole: profile?.role,
        profileAccountType: profile?.account_type,
        userMetadata: user.user_metadata,
        appMetadata: user.app_metadata,
    });
}

export function getSafePostLoginRedirectPath(nextPath: string | null | undefined, role: AppRole): string {
    const defaultPath = getDefaultRedirectPath(role);

    if (!nextPath) return defaultPath;

    const normalizedPath = nextPath.trim();
    if (!normalizedPath.startsWith("/") || normalizedPath.startsWith("//")) return defaultPath;

    const queryIndex = normalizedPath.indexOf("?");
    const hashIndex = normalizedPath.indexOf("#");
    const splitIndex = [queryIndex, hashIndex]
        .filter((value) => value >= 0)
        .sort((a, b) => a - b)[0];
    const pathname = splitIndex === undefined ? normalizedPath : normalizedPath.slice(0, splitIndex);

    if (!pathname || AUTH_ROUTES.includes(pathname)) return defaultPath;
    if (isProtectedPath(pathname) && !canAccessPath(pathname, role)) return defaultPath;

    return normalizedPath;
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
    return extractRoleFromMetadata(metadata) ?? "applicant";
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
