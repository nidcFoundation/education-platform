import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type SupportType = "donor" | "partner";

const SUPPORT_TYPES = new Set<SupportType>(["donor", "partner"]);
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getStringValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      supportType?: unknown;
      name?: unknown;
      email?: unknown;
      message?: unknown;
    };

    const supportType = getStringValue(body.supportType);
    const name = getStringValue(body.name);
    const email = getStringValue(body.email).toLowerCase();
    const message = getStringValue(body.message);

    if (!SUPPORT_TYPES.has(supportType as SupportType)) {
      return Response.json(
        { error: "Select a valid support request type." },
        { status: 400 }
      );
    }

    if (!name || !email || !message) {
      return Response.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    if (!EMAIL_PATTERN.test(email)) {
      return Response.json(
        { error: "Enter a valid email address." },
        { status: 400 }
      );
    }

    if (name.length > 200 || email.length > 320 || message.length > 5000) {
      return Response.json(
        { error: "One or more fields exceed the allowed length." },
        { status: 400 }
      );
    }

    const supabase = createSupabaseAdminClient();
    const { error } = await supabase.from("support_requests").insert({
      support_type: supportType,
      name,
      email,
      message,
    });

    if (error) {
      console.error("Support request insert error", error);
      return Response.json(
        { error: "Unable to save your request right now." },
        { status: 500 }
      );
    }

    return Response.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("Support request route error", error);
    return Response.json(
      { error: "Unable to submit your request right now." },
      { status: 500 }
    );
  }
}
