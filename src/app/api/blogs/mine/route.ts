import { NextResponse } from "next/server";
import { getAuth } from "@/lib/auth.server";
import { countBlogsByAuthor, getBlogsByAuthor, getBlogsByAuthorPaginated } from "@/lib/blog/blog.query";

export async function GET(req: Request) {
    try {
        const auth = await getAuth();
        if (!auth.isAuthenticated || !auth.user?.id) {
            return NextResponse.json({ error: "Authentication required." }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const limitParam = searchParams.get("limit");
        const pageParam = searchParams.get("page");

        const limit = limitParam ? Number.parseInt(limitParam, 10) : undefined;
        const page = pageParam ? Number.parseInt(pageParam, 10) : 1;

        if (limit) {
            const [result, total] = await Promise.all([
                getBlogsByAuthorPaginated(auth.user.id, page, limit),
                countBlogsByAuthor(auth.user.id),
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

        const result = await getBlogsByAuthor(auth.user.id);
        return NextResponse.json({ result });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch blogs." }, { status: 500 });
    }
}
