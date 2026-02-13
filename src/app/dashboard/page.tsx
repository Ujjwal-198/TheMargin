import Link from "next/link";
import { getAuth } from "@/lib/auth.server";
import DashboardClient from "@/components/DashboardClient";
import DashboardActions from "@/components/DashboardActions";

export default async function Dashboard() {
    const auth = await getAuth();

    if (!auth.isAuthenticated) {
        return (
            <main className="min-h-screen w-full bg-zinc-950 text-white px-6 py-16">
                <div className="mx-auto w-full max-w-3xl rounded-2xl border border-zinc-800 bg-zinc-950/70 p-8 text-center">
                    <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">Dashboard</p>
                    <h1 className="mt-3 text-3xl font-semibold">Sign in to manage your posts</h1>
                    <p className="mt-2 text-sm text-zinc-400">
                        Log in to access your drafts, published posts, and editing tools.
                    </p>
                    <div className="mt-6 flex flex-wrap justify-center gap-3">
                        <Link
                            href="/login"
                            className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
                        >
                            Sign in
                        </Link>
                        <Link
                            href="/signup"
                            className="inline-flex items-center justify-center rounded-full border border-zinc-700 px-6 py-2 text-sm font-semibold text-white transition hover:border-indigo-500/60 hover:text-indigo-300"
                        >
                            Create account
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen w-full bg-zinc-950 text-white px-6 py-12">
            <div className="mx-auto w-full max-w-6xl">
                <div className="mb-10 flex flex-col gap-2">
                    <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">Dashboard</p>
                    <h1 className="text-4xl font-semibold">Your writing workspace</h1>
                    <p className="text-sm text-zinc-400">
                        Manage drafts, publish new ideas, and keep your content in motion.
                    </p>
                </div>
                <div className="mb-10">
                    <DashboardActions userId={auth.user?.id ?? ""} />
                </div>
                <DashboardClient />
            </div>
        </main>
    );
}
