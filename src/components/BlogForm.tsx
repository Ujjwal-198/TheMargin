

"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type FormState = {
    title: string;
    content: string;
    status: "DRAFT" | "PUBLISHED";
    featuredImageUrl: string;
    featuredImageAlt: string;
};

function slugify(input: string) {
    return input
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

const initialState: FormState = {
    title: "",
    content: "",
    status: "DRAFT",
    featuredImageUrl: "",
    featuredImageAlt: "",
};

type BlogFormProps = {
    isAuthenticated: boolean;
    authorId: string | null;
};

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export default function BlogForm({ isAuthenticated, authorId }: BlogFormProps) {
    const [form, setForm] = useState<FormState>(initialState);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [slugStatus, setSlugStatus] = useState<"idle" | "checking" | "available" | "unavailable">("idle");

    const suggestedSlug = useMemo(() => slugify(form.title), [form.title]);
    const resolvedSlug = suggestedSlug;

    useEffect(() => {
        let active = true;
        if (!resolvedSlug) {
            setSlugStatus("idle");
            return;
        }

        setSlugStatus("checking");
        const timeout = setTimeout(async () => {
            try {
                const res = await fetch(`/api/blogs/check-slug?slug=${resolvedSlug}`);
                const data = await res.json();
                if (!active) return;
                if (res.ok && data.available) {
                    setSlugStatus("available");
                } else {
                    setSlugStatus("unavailable");
                }
            } catch {
                if (active) setSlugStatus("idle");
            }
        }, 400);

        return () => {
            active = false;
            clearTimeout(timeout);
        };
    }, [resolvedSlug]);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);
        setSuccess(null);

        if (!isAuthenticated) {
            setError("Please log in to publish a blog post.");
            return;
        }

        if (!form.title.trim() || !resolvedSlug.trim() || !form.content.trim()) {
            setError("Title, slug, and content are required.");
            return;
        }

        if (!slugPattern.test(resolvedSlug)) {
            setError("Slug can only contain lowercase letters, numbers, and hyphens.");
            return;
        }
        if (slugStatus === "unavailable") {
            setError("Slug already exists. Try a different title.");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch("/api/blogs/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: form.title.trim(),
                    slug: resolvedSlug.trim(),
                    content: form.content.trim(),
                    status: form.status,
                    featuredImage: form.featuredImageUrl.trim()
                        ? { url: form.featuredImageUrl.trim(), alt: form.featuredImageAlt.trim() || "Featured image" }
                        : undefined,
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data?.error ?? "Failed to create blog post.");
            }

            setSuccess("Blog post created successfully.");
            setForm(initialState);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Something went wrong.";
            setError(message);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <section className="w-full max-w-4xl mx-auto px-4 py-10">
            <div className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-zinc-950 to-zinc-900 p-8 shadow-[0_0_60px_-35px_rgba(99,102,241,0.8)]">
                <div className="flex flex-col gap-2">
                    <p className="text-sm uppercase tracking-[0.35em] text-zinc-500">Create</p>
                    <h2 className="text-3xl font-semibold text-white">New Blog Post</h2>
                    <p className="text-sm text-zinc-400 max-w-2xl">
                        Draft a fresh idea, choose a clean slug, and publish it to The Margin. You must be logged in to publish.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-1 gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <label className="flex flex-col gap-2 text-sm text-zinc-300">
                            Title
                            <input
                                type="text"
                                value={form.title}
                                onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                                placeholder="Designing with negative space"
                                className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-white placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                            />
                        </label>

                        <label className="flex flex-col gap-2 text-sm text-zinc-300">
                            Slug
                            <input
                                type="text"
                                value={resolvedSlug}
                                disabled
                                aria-disabled="true"
                                placeholder={suggestedSlug || "designing-with-negative-space"}
                                className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-white placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                            />
                            {suggestedSlug ? (
                                <span className="text-xs text-zinc-500">Suggested: {suggestedSlug}</span>
                            ) : null}
                            {resolvedSlug && (
                                <span
                                    className={`text-xs ${slugStatus === "available"
                                        ? "text-emerald-400"
                                        : slugStatus === "unavailable"
                                            ? "text-red-400"
                                            : "text-zinc-500"
                                        }`}
                                >
                                    {slugStatus === "checking" && "Checking availability..."}
                                    {slugStatus === "available" && "Slug is available"}
                                    {slugStatus === "unavailable" && "Slug already exists"}
                                    {slugStatus === "idle" && "Slug is required"}
                                </span>
                            )}
                        </label>
                    </div>

                    <label className="flex flex-col gap-2 text-sm text-zinc-300">
                        Content
                        <textarea
                            value={form.content}
                            onChange={(event) => setForm((prev) => ({ ...prev, content: event.target.value }))}
                            placeholder="Write your post in a focused, margin-first voice..."
                            rows={6}
                            className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-white placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                        />
                    </label>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <label className="flex flex-col gap-2 text-sm text-zinc-300">
                            Status
                            <select
                                value={form.status}
                                onChange={(event) =>
                                    setForm((prev) => ({ ...prev, status: event.target.value as FormState["status"] }))
                                }
                                className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                            >
                                <option value="DRAFT">Draft</option>
                                <option value="PUBLISHED">Published</option>
                            </select>
                        </label>

                        <div className="flex flex-col gap-2 text-sm text-zinc-300">
                            Publish Preview
                            <div className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-500">
                                /{resolvedSlug || "your-slug"}
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 text-sm text-zinc-300">
                            Author
                            <div className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-500">
                                {isAuthenticated ? `Signed in as ${authorId ?? "unknown user"}` : "Not authenticated"}
                            </div>
                            {!isAuthenticated ? (
                                <Link href="/login" className="text-xs text-indigo-400 hover:text-indigo-300">
                                    Log in to publish
                                </Link>
                            ) : null}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <label className="flex flex-col gap-2 text-sm text-zinc-300">
                            Featured Image URL
                            <input
                                type="url"
                                value={form.featuredImageUrl}
                                onChange={(event) => setForm((prev) => ({ ...prev, featuredImageUrl: event.target.value }))}
                                placeholder="https://..."
                                className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-white placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                            />
                        </label>

                        <label className="flex flex-col gap-2 text-sm text-zinc-300">
                            Featured Image Alt
                            <input
                                type="text"
                                value={form.featuredImageAlt}
                                onChange={(event) => setForm((prev) => ({ ...prev, featuredImageAlt: event.target.value }))}
                                placeholder="Short image description"
                                className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-white placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                            />
                        </label>
                    </div>

                    {error ? <p className="text-sm text-red-400">{error}</p> : null}
                    {success ? <p className="text-sm text-emerald-400">{success}</p> : null}

                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <p className="text-xs text-zinc-500">Tip: keep slugs short, lowercase, and readable.</p>
                        <button
                            type="submit"
                            disabled={isSubmitting || !isAuthenticated}
                            className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSubmitting ? "Publishing..." : "Create Post"}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}
