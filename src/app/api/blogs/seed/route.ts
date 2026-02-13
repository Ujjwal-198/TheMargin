import { NextResponse } from "next/server";
import { seedBlogs } from "@/lib/blog/blog.query";

export async function GET(req: Request) {
    try {
        const result = await seedBlogs();
        return NextResponse.json({ result });
    } catch (error) {
        return NextResponse.json({ error: "Failed to seed blogs" }, { status: 500 });
    }
}
