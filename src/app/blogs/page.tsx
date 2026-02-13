import FeaturedBlogs from "@/components/FeaturedBlogs";

export default function BlogsPage() {
    return (
        <main className="min-h-screen bg-zinc-950 text-white">
            <section className="relative overflow-hidden border-b border-zinc-900">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.18),_transparent_55%)]" />
                <div className="relative mx-auto flex max-w-6xl flex-col gap-6 px-6 py-16">
                    <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">Library</p>
                    <h1 className="text-4xl font-semibold md:text-5xl">All posts on the margin</h1>
                    <p className="max-w-2xl text-sm text-zinc-400 md:text-base">
                        Browse the latest essays, product notes, and quiet reflections. Every post keeps the focus on clarity.
                    </p>
                </div>
            </section>

            <section className="mx-auto w-full max-w-6xl px-6 py-12">
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">Browse</p>
                        <h2 className="text-3xl font-semibold">The archive</h2>
                        <p className="text-sm text-zinc-400">Every post, ordered by time, focused on clarity.</p>
                    </div>
                </div>
                <FeaturedBlogs showBadge={false} />
            </section>
        </main>
    );
}
