import type { User } from "@supabase/supabase-js";

function getStringValue(source: Record<string, unknown>, key: string) {
    const value = source[key];
    return typeof value === "string" && value.trim() ? value.trim() : null;
}

function formatNameSegment(value: string) {
    return value
        .split(/[\s._-]+/)
        .filter(Boolean)
        .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
        .join(" ");
}

export function buildProfileFallback(user: User) {
    const metadata = typeof user.user_metadata === "object" && user.user_metadata !== null
        ? user.user_metadata as Record<string, unknown>
        : {};

    const emailLocalPart = user.email?.split("@")[0] ?? "applicant.user";
    const emailName = formatNameSegment(emailLocalPart) || "Applicant User";
    const [emailFirstName = "Applicant", ...emailLastNameParts] = emailName.split(" ");

    const fullName = getStringValue(metadata, "full_name");
    const fullNameParts = fullName ? fullName.split(/\s+/).filter(Boolean) : [];

    const firstName =
        getStringValue(metadata, "first_name") ??
        fullNameParts[0] ??
        emailFirstName;

    const lastName =
        getStringValue(metadata, "last_name") ??
        (fullNameParts.length > 1 ? fullNameParts.slice(1).join(" ") : null) ??
        (emailLastNameParts.join(" ") || "User");

    return {
        id: user.id,
        email: user.email ?? "",
        first_name: firstName,
        last_name: lastName,
        phone: getStringValue(metadata, "phone"),
        state_of_origin: getStringValue(metadata, "state_of_origin"),
        role: getStringValue(metadata, "role") ?? "applicant",
        account_type: getStringValue(metadata, "account_type") ?? "applicant",
        status: "active",
    };
}