import { v2 as cloudinary } from "cloudinary";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME as string;
const API_KEY = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY as string;
const API_SECRET = process.env.CLOUDINARY_API_SECRET as string;

if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
    throw new Error("Missing required Cloudinary environment variables");
}

cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET,
});

export async function POST(request: Request) {
    try {
        const supabase = await createSupabaseServerClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { paramsToSign } = body;

        const signature = cloudinary.utils.api_sign_request(
            paramsToSign,
            API_SECRET
        );

        return Response.json({ signature });
    } catch (error) {
        console.error("Cloudinary signing error", error);
        return Response.json({ error: "Failed to sign" }, { status: 500 });
    }
}
