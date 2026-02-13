import { NextResponse } from "next/server";
import { createBlog, getBlogBySlug } from "@/lib/blog/blog.query";
import { getAuth } from "@/lib/auth.server";

function slugify(input: string) {
    return input
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export async function POST(req: Request) {
    try {
        const auth = await getAuth();
        if (!auth.isAuthenticated || !auth.user?.id) {
            return NextResponse.json({ error: "Authentication required." }, { status: 401 });
        }

        const payload = await req.json();
        const title = typeof payload?.title === "string" ? payload.title.trim() : "";
        const content = typeof payload?.content === "string" ? payload.content.trim() : "";
        const status = payload?.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT";
        const slug = typeof payload?.slug === "string" && payload.slug.trim()
            ? payload.slug.trim()
            : slugify(title);

        if (!title || !content || !slug) {
            return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
        }

        if (!slugPattern.test(slug)) {
            return NextResponse.json({ error: "Invalid slug format." }, { status: 400 });
        }

        const featuredImage = payload?.featuredImage?.url
            ? {
                url: String(payload.featuredImage.url),
                alt: payload?.featuredImage?.alt ? String(payload.featuredImage.alt) : "Featured image",
            }
            : undefined;

        const existing = await getBlogBySlug(slug);
        if (existing) {
            return NextResponse.json({ error: "Slug already in use." }, { status: 409 });
        }

        const created = await createBlog({
            title,
            content,
            slug,
            author: auth.user.id,
            status,
            featuredImage,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const hydrated = await getBlogBySlug(created.slug);
        return NextResponse.json({ result: hydrated ?? created }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create blog post." }, { status: 500 });
    }
}
