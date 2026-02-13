"use client";

import Link from "next/link";

export default function BlogDetailError({ reset }: { reset: () => void }) {
    return (
        <main className="min-h-screen bg-zinc-950 text-white px-6 py-16">
            <div className="mx-auto w-full max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-950/70 p-8 text-center">
                <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">Blog</p>
                <h1 className="mt-3 text-3xl font-semibold">Could not load this post</h1>
                <p className="mt-2 text-sm text-zinc-400">
                    Try again or return to the archive.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <button
                        onClick={reset}
                        className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
                    >
                        Retry
                    </button>
                    <Link
                        href="/blogs"
                        className="inline-flex items-center justify-center rounded-full border border-zinc-700 px-6 py-2 text-sm font-semibold text-white transition hover:border-indigo-500/60 hover:text-indigo-300"
                    >
                        Back to blogs
                    </Link>
                </div>
            </div>
        </main>
    );
}
