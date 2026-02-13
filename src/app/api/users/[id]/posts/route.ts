import { NextResponse } from "next/server";
import { countPublishedBlogsByAuthor, getPublishedBlogsByAuthorPaginated } from "@/lib/blog/blog.query";

type RouteContext = {
    params: Promise<{
        id: string;
    }>;
};

export async function GET(req: Request, { params }: RouteContext) {
    try {
        const { id } = await params;
        const { searchParams } = new URL(req.url);
        const limitParam = searchParams.get("limit");
        const pageParam = searchParams.get("page");

        const limit = limitParam ? Number.parseInt(limitParam, 10) : 6;
        const page = pageParam ? Number.parseInt(pageParam, 10) : 1;

        const [posts, total] = await Promise.all([
            getPublishedBlogsByAuthorPaginated(id, page, limit),
            countPublishedBlogsByAuthor(id),
        ]);

        const totalPages = limit > 0 ? Math.ceil(total / limit) : 1;

        return NextResponse.json({
            result: posts,
            meta: {
                total,
                totalPages,
                page,
                limit,
            },
        });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch posts." }, { status: 500 });
    }
}
