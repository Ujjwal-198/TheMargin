import { NextResponse } from "next/server";
import { getUserById } from "@/lib/user/user.query";
import { countPublishedBlogsByAuthor } from "@/lib/blog/blog.query";

type RouteContext = {
    params: Promise<{
        id: string;
    }>;
};

export async function GET(req: Request, { params }: RouteContext) {
    try {
        const { id } = await params;
        const user = await getUserById(id);
        if (!user) {
            return NextResponse.json({ error: "User not found." }, { status: 404 });
        }

        const postsCount = await countPublishedBlogsByAuthor(id);
        return NextResponse.json({
            result: {
                ...user,
                postsCount,
            },
        });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch user." }, { status: 500 });
    }
}
