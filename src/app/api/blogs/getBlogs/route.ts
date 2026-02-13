import { countPublishedBlogs, getAllBlogs, getBlogs, getPublishedBlogsPaginated } from "@/lib/blog/blog.query";
import { NextResponse } from "next/server";
// Ensure User model is registered
import { UserModel } from "@/lib/user/user.model";


export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const limitParam = searchParams.get("limit");
        const pageParam = searchParams.get("page");
        const limit = limitParam ? Number.parseInt(limitParam, 10) : undefined;
        const page = pageParam ? Number.parseInt(pageParam, 10) : 1;

        if (limit) {
            const [result, total] = await Promise.all([
                getPublishedBlogsPaginated(page, limit),
                countPublishedBlogs(),
            ]);
            const totalPages = limit > 0 ? Math.ceil(total / limit) : 1;
            return NextResponse.json({
                result,
                meta: {
                    total,
                    totalPages,
                    page,
                    limit,
                },
            });
        }

        const result = await getAllBlogs();
        return NextResponse.json({ result });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to fetch blogs";
        console.error("Blog fetch error:", errorMessage);
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
