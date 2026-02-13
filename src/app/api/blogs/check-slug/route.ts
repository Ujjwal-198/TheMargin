import { NextResponse } from "next/server";
import { getBlogBySlug } from "@/lib/blog/blog.query";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const slug = searchParams.get("slug")?.trim() ?? "";

        if (!slug) {
            return NextResponse.json({ available: false, error: "Slug is required." }, { status: 400 });
        }

        const existing = await getBlogBySlug(slug);
        return NextResponse.json({ available: !existing });
    } catch (error) {
        return NextResponse.json({ available: false, error: "Failed to check slug." }, { status: 500 });
    }
}
