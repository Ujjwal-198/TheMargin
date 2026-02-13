"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { blog } from "@/types/blog";

type DashboardActionsProps = {
    userId: string;
};

export default function DashboardActions({ userId }: DashboardActionsProps) {
    const router = useRouter();
    const [stats, setStats] = useState({ total: 0, published: 0, drafts: 0 });
    const [isLoading, setIsLoading] = useState(true);

    async function handleLogout() {
        await fetch("/api/logout", { method: "POST" });
        router.replace("/");
        router.refresh();
    }

    useEffect(() => {
        let active = true;

        async function loadStats() {
            try {
                const res = await fetch("/api/blogs/mine", { method: "GET" });
                const data = await res.json();
                if (!res.ok) return;
                const posts: blog[] = data.result ?? [];
                const published = posts.filter((post) => post.status === "PUBLISHED").length;
                const drafts = posts.filter((post) => post.status !== "PUBLISHED").length;
                if (active) {
                    setStats({ total: posts.length, published, drafts });
                }
            } finally {
                if (active) {
                    setIsLoading(false);
                }
            }
        }

        loadStats();
        return () => {
            active = false;
        };
    }, []);

    return (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Profile actions</p>
            <h2 className="mt-2 text-2xl font-semibold">Manage your account</h2>
            <p className="mt-2 text-sm text-zinc-400">
                Jump to your public profile, review your posts, or sign out safely.
            </p>

            <div className="mt-6 grid gap-3 text-sm text-zinc-400 sm:grid-cols-3">
                {isLoading ? (
                    <>
                        <div className="h-16 rounded-xl border border-zinc-800 bg-zinc-950/60 animate-pulse" />
                        <div className="h-16 rounded-xl border border-zinc-800 bg-zinc-950/60 animate-pulse" />
                        <div className="h-16 rounded-xl border border-zinc-800 bg-zinc-950/60 animate-pulse" />
                    </>
                ) : (
                    <>
                        <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 px-4 py-3">
                            <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Total posts</p>
                            <p className="mt-2 text-base text-white">{stats.total}</p>
                        </div>
                        <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 px-4 py-3">
                            <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Published</p>
                            <p className="mt-2 text-base text-white">{stats.published}</p>
                        </div>
                        <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 px-4 py-3">
                            <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Drafts</p>
                            <p className="mt-2 text-base text-white">{stats.drafts}</p>
                        </div>
                    </>
                )}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
                <Link
                    href={`/users/${userId}`}
                    className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
                >
                    View profile
                </Link>
                <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex items-center justify-center rounded-full border border-red-500/50 px-6 py-2 text-sm font-semibold text-red-300 transition hover:border-red-400/70"
                >
                    Log out
                </button>
            </div>
        </div>
    );
}
