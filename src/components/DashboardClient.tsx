"use client";

import { useEffect, useMemo, useState } from "react";
import type { blog } from "@/types/blog";

type FormState = {
    title: string;
    slug: string;
    content: string;
    status: "DRAFT" | "PUBLISHED";
    featuredImageUrl: string;
    featuredImageAlt: string;
};

const initialState: FormState = {
    title: "",
    slug: "",
    content: "",
    status: "DRAFT",
    featuredImageUrl: "",
    featuredImageAlt: "",
};

function slugify(input: string) {
    return input
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

export default function DashboardClient() {
    const [blogs, setBlogs] = useState<blog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalPosts, setTotalPosts] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [form, setForm] = useState<FormState>(initialState);
    const [activeSlug, setActiveSlug] = useState<string | null>(null);

    const isEditing = Boolean(activeSlug);
    const resolvedSlug = useMemo(() => {
        if (isEditing) {
            return form.slug.trim();
        }
        return slugify(form.title);
    }, [form.slug, form.title, isEditing]);

    async function loadBlogs() {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/blogs/mine?limit=6&page=${page}`, { method: "GET" });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data?.error ?? "Failed to fetch blogs.");
            }
            setBlogs(data.result ?? []);
            setTotalPages(data.meta?.totalPages ?? 1);
            setTotalPosts(data.meta?.total ?? 0);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Something went wrong.";
            setError(message);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadBlogs();
    }, [page]);

    function resetForm() {
        setForm(initialState);
        setActiveSlug(null);
        setSuccess(null);
        setError(null);
    }

    function handleEdit(blogItem: blog) {
        setActiveSlug(blogItem.slug);
        setForm({
            title: blogItem.title ?? "",
            slug: blogItem.slug ?? "",
            content: blogItem.content ?? "",
            status: blogItem.status ?? "DRAFT",
            featuredImageUrl: blogItem.featuredImage?.url ?? "",
            featuredImageAlt: blogItem.featuredImage?.alt ?? "",
        });
        setSuccess(null);
        setError(null);
    }

    async function handleDelete(slug: string) {
        setError(null);
        setSuccess(null);
        const confirmed = window.confirm("Delete this blog post?");
        if (!confirmed) return;

        try {
            const res = await fetch(`/api/blogs/${slug}`, { method: "DELETE" });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data?.error ?? "Failed to delete blog.");
            }
            setBlogs((prev) => prev.filter((item) => item.slug !== slug));
            if (activeSlug === slug) {
                resetForm();
            }
            setSuccess("Blog deleted.");
        } catch (err) {
            const message = err instanceof Error ? err.message : "Something went wrong.";
            setError(message);
        }
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);
        setSuccess(null);

        if (!form.title.trim() || !resolvedSlug.trim() || !form.content.trim()) {
            setError("Title, slug, and content are required.");
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                title: form.title.trim(),
                slug: resolvedSlug.trim(),
                content: form.content.trim(),
                status: form.status,
                featuredImage: form.featuredImageUrl.trim()
                    ? { url: form.featuredImageUrl.trim(), alt: form.featuredImageAlt.trim() || "Featured image" }
                    : undefined,
            };

            const res = await fetch(isEditing ? `/api/blogs/${activeSlug}` : "/api/blogs/create", {
                method: isEditing ? "PATCH" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data?.error ?? "Failed to save blog.");
            }

            if (isEditing) {
                setBlogs((prev) => prev.map((item) => (item.slug === activeSlug ? data.result : item)));
                setSuccess("Blog updated.");
            } else {
                setBlogs((prev) => [data.result, ...prev].slice(0, 6));
                setSuccess("Blog created.");
            }
            resetForm();
        } catch (err) {
            const message = err instanceof Error ? err.message : "Something went wrong.";
            setError(message);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Your posts</p>
                        <h2 className="mt-2 text-2xl font-semibold">Manage your writing</h2>
                    </div>
                    <button
                        className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                        onClick={loadBlogs}
                        type="button"
                    >
                        Refresh
                    </button>
                </div>

                {isLoading ? (
                    <div className="mt-6 grid gap-4">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <div key={`dashboard-skeleton-${index}`} className="h-24 rounded-xl border border-zinc-800 bg-zinc-950/60 animate-pulse" />
                        ))}
                    </div>
                ) : blogs.length === 0 ? (
                    <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950/60 p-6 text-sm text-zinc-400">
                        You have not published anything yet. Create your first post on the right.
                    </div>
                ) : (
                    <div className="mt-6 flex flex-col gap-4">
                        {blogs.map((item) => (
                            <article
                                key={item.slug}
                                className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-4 transition hover:border-indigo-500/40"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h3 className="text-lg font-semibold">{item.title}</h3>
                                        <p className="text-xs text-zinc-500">/{item.slug}</p>
                                        <p className="mt-2 text-sm text-zinc-400 line-clamp-2">{item.content}</p>
                                    </div>
                                    <span className="rounded-full border border-zinc-800 px-3 py-1 text-xs text-zinc-400">
                                        {item.status ?? "DRAFT"}
                                    </span>
                                </div>
                                <div className="mt-4 flex flex-wrap gap-3 text-xs text-zinc-500">
                                    <button
                                        type="button"
                                        className="rounded-full border border-zinc-800 px-3 py-1 text-zinc-300 hover:border-indigo-500/60"
                                        onClick={() => handleEdit(item)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        type="button"
                                        className="rounded-full border border-red-500/40 px-3 py-1 text-red-300 hover:border-red-400/70"
                                        onClick={() => handleDelete(item.slug)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                {!isLoading && totalPages > 1 && (
                    <div className="mt-6 flex items-center justify-between text-sm text-zinc-400">
                        <button
                            type="button"
                            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                            disabled={page === 1}
                            className="rounded-full border border-zinc-700 px-4 py-2 text-xs text-white transition hover:border-indigo-500/60 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            Previous
                        </button>
                        <span className="text-xs">Page {page} of {totalPages} · {totalPosts} posts</span>
                        <button
                            type="button"
                            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                            disabled={page >= totalPages}
                            className="rounded-full border border-zinc-700 px-4 py-2 text-xs text-white transition hover:border-indigo-500/60 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                    {isEditing ? "Edit post" : "New post"}
                </p>
                <h2 className="mt-2 text-2xl font-semibold">
                    {isEditing ? "Update your draft" : "Publish a new idea"}
                </h2>
                <p className="mt-2 text-sm text-zinc-400">
                    Keep your slug clean and your content focused. Publish when ready.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 grid gap-6">
                    <label className="flex flex-col gap-2 text-sm text-zinc-300">
                        Title
                        <input
                            type="text"
                            value={form.title}
                            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                            className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-white placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                            placeholder="A quiet update"
                        />
                    </label>

                    <label className="flex flex-col gap-2 text-sm text-zinc-300">
                        Slug
                        <input
                            type="text"
                            value={resolvedSlug}
                            disabled
                            className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-white placeholder:text-zinc-600 disabled:cursor-not-allowed disabled:opacity-60"
                        />
                    </label>

                    <label className="flex flex-col gap-2 text-sm text-zinc-300">
                        Content
                        <textarea
                            rows={6}
                            value={form.content}
                            onChange={(event) => setForm((prev) => ({ ...prev, content: event.target.value }))}
                            className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-white placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                            placeholder="Write your post..."
                        />
                    </label>

                    <div className="grid gap-4 md:grid-cols-2">
                        <label className="flex flex-col gap-2 text-sm text-zinc-300">
                            Status
                            <select
                                value={form.status}
                                onChange={(event) =>
                                    setForm((prev) => ({ ...prev, status: event.target.value as FormState["status"] }))
                                }
                                className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                            >
                                <option value="DRAFT">Draft</option>
                                <option value="PUBLISHED">Published</option>
                            </select>
                        </label>

                        <label className="flex flex-col gap-2 text-sm text-zinc-300">
                            Featured Image URL
                            <input
                                type="url"
                                value={form.featuredImageUrl}
                                onChange={(event) =>
                                    setForm((prev) => ({ ...prev, featuredImageUrl: event.target.value }))
                                }
                                className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-white placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                                placeholder="https://..."
                            />
                        </label>
                    </div>

                    <label className="flex flex-col gap-2 text-sm text-zinc-300">
                        Featured Image Alt
                        <input
                            type="text"
                            value={form.featuredImageAlt}
                            onChange={(event) =>
                                setForm((prev) => ({ ...prev, featuredImageAlt: event.target.value }))
                            }
                            className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-white placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                            placeholder="Short image description"
                        />
                    </label>

                    {error ? <p className="text-sm text-red-400">{error}</p> : null}
                    {success ? <p className="text-sm text-emerald-400">{success}</p> : null}

                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSubmitting ? "Saving..." : isEditing ? "Update post" : "Create post"}
                        </button>
                        {isEditing ? (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="inline-flex items-center justify-center rounded-full border border-zinc-700 px-6 py-2 text-sm font-semibold text-white transition hover:border-indigo-500/60 hover:text-indigo-300"
                            >
                                Cancel edit
                            </button>
                        ) : null}
                    </div>
                </form>
            </div>
        </div>
    );
}
