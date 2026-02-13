import { NextResponse } from "next/server";
import { getAuth } from "@/lib/auth.server";
import { Blog } from "@/lib/blog/blog.model";
import { updateBlog, deleteBlog, getBlogBySlug } from "@/lib/blog/blog.query";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

type RouteContext = {
    params: Promise<{
        slug: string;
    }>;
};

export async function GET(req: Request, { params }: RouteContext) {
    try {
        const { slug } = await params;
        const result = await getBlogBySlug(slug);
        if (!result) {
            return NextResponse.json({ error: "Blog not found." }, { status: 404 });
        }
        return NextResponse.json({ result });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch blog." }, { status: 500 });
    }
}

export async function PATCH(req: Request, { params }: RouteContext) {
    try {
        const { slug } = await params;
        const auth = await getAuth();
        if (!auth.isAuthenticated || !auth.user?.id) {
            return NextResponse.json({ error: "Authentication required." }, { status: 401 });
        }

        const existing = await Blog.findOne({ slug }).select("author").lean();
        if (!existing) {
            return NextResponse.json({ error: "Blog not found." }, { status: 404 });
        }

        if (existing.author?.toString?.() !== auth.user.id) {
            return NextResponse.json({ error: "Not authorized." }, { status: 403 });
        }

        const payload = await req.json();
        const updatedData: Record<string, unknown> = {};

        if (typeof payload?.title === "string") {
            updatedData.title = payload.title.trim();
        }
        if (typeof payload?.content === "string") {
            updatedData.content = payload.content.trim();
        }
        if (payload?.status === "PUBLISHED" || payload?.status === "DRAFT") {
            updatedData.status = payload.status;
        }
        if (payload?.featuredImage?.url) {
            updatedData.featuredImage = {
                url: String(payload.featuredImage.url),
                alt: payload?.featuredImage?.alt ? String(payload.featuredImage.alt) : "Featured image",
            };
        }
        if (typeof payload?.slug === "string" && payload.slug.trim()) {
            const nextSlug = payload.slug.trim();
            if (!slugPattern.test(nextSlug)) {
                return NextResponse.json({ error: "Invalid slug format." }, { status: 400 });
            }
            if (nextSlug !== slug) {
                const slugExists = await Blog.findOne({ slug: nextSlug }).select("_id").lean();
                if (slugExists) {
                    return NextResponse.json({ error: "Slug already in use." }, { status: 409 });
                }
            }
            updatedData.slug = nextSlug;
        }

        const result = await updateBlog(slug, updatedData);
        if (!result) {
            return NextResponse.json({ error: "Blog not found." }, { status: 404 });
        }

        return NextResponse.json({ result });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update blog." }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: RouteContext) {
    try {
        const { slug } = await params;
        const auth = await getAuth();
        if (!auth.isAuthenticated || !auth.user?.id) {
            return NextResponse.json({ error: "Authentication required." }, { status: 401 });
        }

        const existing = await Blog.findOne({ slug }).select("author").lean();
        if (!existing) {
            return NextResponse.json({ error: "Blog not found." }, { status: 404 });
        }

        if (existing.author?.toString?.() !== auth.user.id) {
            return NextResponse.json({ error: "Not authorized." }, { status: 403 });
        }

        const result = await deleteBlog(slug);
        if (!result) {
            return NextResponse.json({ error: "Blog not found." }, { status: 404 });
        }

        return NextResponse.json({ result });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete blog." }, { status: 500 });
    }
}
