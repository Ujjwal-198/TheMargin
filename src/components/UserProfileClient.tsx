"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { blog } from "@/types/blog";

type UserProfile = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    createdAt?: string | Date;
    postsCount: number;
};

type UserProfileClientProps = {
    userId: string;
};

function formatDate(value?: string | Date) {
    if (!value) return "Unknown";
    const date = typeof value === "string" ? new Date(value) : value;
    if (Number.isNaN(date.getTime())) return "Unknown";
    return date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

export default function UserProfileClient({ userId }: UserProfileClientProps) {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [posts, setPosts] = useState<blog[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalPosts, setTotalPosts] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingPosts, setIsLoadingPosts] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const initials = useMemo(() => {
        if (!profile) return "U";
        const first = profile.firstName?.[0] ?? "";
        const last = profile.lastName?.[0] ?? "";
        return `${first}${last}`.toUpperCase() || "U";
    }, [profile]);

    useEffect(() => {
        let active = true;
        async function loadProfile() {
            try {
                const res = await fetch(`/api/users/${userId}`);
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data?.error ?? "Failed to load profile.");
                }
                if (active) {
                    setProfile(data.result);
                }
            } catch (err) {
                const message = err instanceof Error ? err.message : "Something went wrong.";
                setError(message);
            } finally {
                if (active) {
                    setIsLoading(false);
                }
            }
        }

        loadProfile();
        return () => {
            active = false;
        };
    }, [userId]);

    useEffect(() => {
        let active = true;
        async function loadPosts() {
            setIsLoadingPosts(true);
            try {
                const res = await fetch(`/api/users/${userId}/posts?page=${page}&limit=6`);
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data?.error ?? "Failed to load posts.");
                }
                if (active) {
                    setPosts(data.result ?? []);
                    setTotalPages(data.meta?.totalPages ?? 1);
                    setTotalPosts(data.meta?.total ?? 0);
                }
            } catch (err) {
                const message = err instanceof Error ? err.message : "Something went wrong.";
                setError(message);
            } finally {
                if (active) {
                    setIsLoadingPosts(false);
                }
            }
        }

        loadPosts();
        return () => {
            active = false;
        };
    }, [userId, page]);

    if (isLoading) {
        return (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-8 text-sm text-zinc-400">
                Loading profile...
            </div>
        );
    }

    if (!profile || error) {
        return (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-8 text-sm text-zinc-400">
                {error ?? "Profile not found."}
            </div>
        );
    }

    return (
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <section className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-8">
                <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-zinc-800 bg-gradient-to-br from-indigo-500/30 to-zinc-900 text-lg font-semibold text-white">
                        {initials}
                    </div>
                    <div>
                        <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">Author</p>
                        <h1 className="text-2xl font-semibold">{profile.firstName} {profile.lastName}</h1>
                        <p className="text-sm text-zinc-400">{profile.email}</p>
                    </div>
                </div>

                <div className="mt-6 grid gap-4 text-sm text-zinc-400">
                    <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 px-4 py-3">
                        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Joined</p>
                        <p className="mt-2 text-sm text-zinc-200">{formatDate(profile.createdAt)}</p>
                    </div>
                    <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 px-4 py-3">
                        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Posts</p>
                        <p className="mt-2 text-sm text-zinc-200">{profile.postsCount}</p>
                    </div>
                </div>
            </section>

            <section className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-8">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">Writing</p>
                        <h2 className="mt-2 text-2xl font-semibold">Posts by {profile.firstName}</h2>
                    </div>
                    <div className="text-xs text-zinc-500">
                        Page {page} of {totalPages} · {totalPosts} posts
                    </div>
                </div>

                {isLoadingPosts ? (
                    <div className="mt-6 grid gap-4">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <div key={`post-skel-${index}`} className="h-20 rounded-xl border border-zinc-800 bg-zinc-950/60 animate-pulse" />
                        ))}
                    </div>
                ) : posts.length === 0 ? (
                    <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950/60 p-6 text-sm text-zinc-400">
                        No posts yet.
                    </div>
                ) : (
                    <div className="mt-6 flex flex-col gap-4">
                        {posts.map((post) => (
                            <article
                                key={post.slug}
                                className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-4 transition hover:border-indigo-500/40"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h3 className="text-lg font-semibold">{post.title}</h3>
                                        <p className="text-xs text-zinc-500">/{post.slug}</p>
                                        <p className="mt-2 text-sm text-zinc-400 line-clamp-2">{post.content}</p>
                                    </div>
                                    <span className="rounded-full border border-zinc-800 px-3 py-1 text-xs text-zinc-400">
                                        {post.status ?? "DRAFT"}
                                    </span>
                                </div>
                                <div className="mt-4 text-xs">
                                    <Link
                                        href={`/blogs/${post.slug}`}
                                        className="text-indigo-400 hover:text-indigo-300 transition-colors"
                                    >
                                        Read post
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                <div className="mt-6 flex items-center justify-between text-sm">
                    <button
                        type="button"
                        onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                        disabled={page === 1}
                        className="rounded-full border border-zinc-700 px-4 py-2 text-xs text-white transition hover:border-indigo-500/60 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        Previous
                    </button>
                    <button
                        type="button"
                        onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                        disabled={page >= totalPages}
                        className="rounded-full border border-zinc-700 px-4 py-2 text-xs text-white transition hover:border-indigo-500/60 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        Next
                    </button>
                </div>
            </section>
        </div>
    );
}
