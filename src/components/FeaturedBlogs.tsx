'use client';
import Link from "next/link";
import { useEffect, useState } from "react";
import type { blog } from "@/types/blog";
import { CircleUser } from "lucide-react";

type FeaturedBlogsProps = {
    showBadge?: boolean;
};

export default function FeaturedBlogs({ showBadge = true }: FeaturedBlogsProps) {

    const [blogs, setBlogs] = useState<blog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalPosts, setTotalPosts] = useState(0);

    useEffect(() => {
        let isMounted = true;

        async function getFeaturedBlogs() {
            try {
                const res = await fetch(`/api/blogs/getBlogs?limit=6&page=${page}`, { method: 'GET' });
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data?.error ?? "Failed to load posts.");
                }
                if (isMounted) {
                    setBlogs(data.result ?? []);
                    setTotalPages(data.meta?.totalPages ?? 1);
                    setTotalPosts(data.meta?.total ?? 0);
                    setError(null);
                }
            } catch (err) {
                if (isMounted) {
                    const message = err instanceof Error ? err.message : "Failed to load posts.";
                    setError(message);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        getFeaturedBlogs();

        return () => {
            isMounted = false;
        };
    }, [page]);

    return (
        <div className="mt-8">
            <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {isLoading && (
                    Array.from({ length: 3 }).map((_, index) => (
                        <div
                            key={`skeleton-${index}`}
                            className="h-48 rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6 animate-pulse"
                        >
                            <div className="h-4 w-2/3 rounded bg-zinc-800" />
                            <div className="mt-4 h-3 w-full rounded bg-zinc-800" />
                            <div className="mt-2 h-3 w-5/6 rounded bg-zinc-800" />
                            <div className="mt-6 h-3 w-1/3 rounded bg-zinc-800" />
                        </div>
                    ))
                )}

                {!isLoading && error && (
                    <div className="col-span-full rounded-2xl border border-red-500/40 bg-zinc-950/70 p-8 text-center text-sm text-red-300">
                        {error}
                    </div>
                )}

                {!isLoading && !error && blogs.length === 0 && (
                    <div className="col-span-full rounded-2xl border border-zinc-800 bg-zinc-950/70 p-8 text-center text-sm text-zinc-400">
                        No featured posts yet. Start the first one above.
                    </div>
                )}

                {!isLoading && blogs.map((blog) => {
                    const words = blog.content?.trim()?.split(/\s+/).filter(Boolean).length ?? 0;
                    const minutes = Math.max(1, Math.ceil(words / 200));
                    return (
                    <article
                        key={blog.slug}
                        className="group flex h-full flex-col justify-between rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-zinc-950 to-zinc-900 p-6 transition hover:-translate-y-1 hover:border-indigo-500/40 hover:shadow-[0_20px_50px_-30px_rgba(79,70,229,0.6)]"
                    >
                        {blog.featuredImage?.url ? (
                            <div className="mb-4 overflow-hidden rounded-xl border border-zinc-800">
                                <img
                                    src={blog.featuredImage.url}
                                    alt={blog.featuredImage.alt ?? blog.title}
                                    className="h-40 w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                                    loading="lazy"
                                />
                            </div>
                        ) : null}
                        <div>
                            {showBadge ? (
                                <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Featured</p>
                            ) : null}
                            <h3 className="mt-3 text-xl font-semibold text-white">{blog.title}</h3>
                            <p className="mt-3 text-sm text-zinc-400 line-clamp-4">{blog.content}</p>
                            <p className="mt-4 text-xs text-zinc-500">{minutes} min read</p>
                        </div>
                        <div className="mt-6 flex items-center justify-between text-xs text-zinc-500">
                            <span>
                                By{" "}
                                <Link
                                    href={`/users/${blog.author}`}
                                    className="text-zinc-300 hover:text-white transition-colors"
                                >
                                    {blog.authorName ?? blog.author}
                                    <CircleUser className="inline ml-1 text-zinc-500 group-hover:text-zinc-300 transition-colors duration-300  h-4 w-4" />
                                </Link>
                            </span>
                            <a
                                href={`/blogs/${blog.slug}`}
                                className="text-indigo-400 group-hover:text-indigo-300"
                            >
                                Read more
                            </a>
                        </div>
                    </article>
                )})}
            </div>
            {!isLoading && totalPages > 1 && (
                <div className="mt-8 flex items-center justify-between text-sm text-zinc-400">
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
    );
}
