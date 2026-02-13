"use client";

import Link from "next/link";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    return (
        <main className="min-h-screen bg-zinc-950 text-white px-6 py-16">
            <div className="mx-auto w-full max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-950/70 p-8 text-center">
                <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">Something went wrong</p>
                <h1 className="mt-3 text-3xl font-semibold">We hit a quiet snag</h1>
                <p className="mt-2 text-sm text-zinc-400">
                    {error?.message ?? "An unexpected error occurred. Please try again."}
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <button
                        onClick={reset}
                        className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
                    >
                        Try again
                    </button>
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center rounded-full border border-zinc-700 px-6 py-2 text-sm font-semibold text-white transition hover:border-indigo-500/60 hover:text-indigo-300"
                    >
                        Back home
                    </Link>
                </div>
            </div>
        </main>
    );
}
