export default function AboutPage() {
    return (
        <main className="min-h-screen bg-zinc-950 text-white">
            <section className="relative overflow-hidden border-b border-zinc-900">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.18),_transparent_55%)]" />
                <div className="relative mx-auto flex max-w-6xl flex-col gap-6 px-6 py-16">
                    <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">About</p>
                    <h1 className="text-4xl font-semibold md:text-5xl">The Margin is built for focus</h1>
                    <p className="max-w-2xl text-sm text-zinc-400 md:text-base">
                        We believe good writing needs space. The Margin is a minimal publishing tool that
                        keeps the interface quiet so ideas can lead.
                    </p>
                </div>
            </section>

            <section className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-12 md:grid-cols-2">
                <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6">
                    <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Philosophy</p>
                    <h2 className="mt-3 text-2xl font-semibold">Quiet UI, loud ideas</h2>
                    <p className="mt-3 text-sm text-zinc-400">
                        We keep the design restrained, the navigation simple, and the typography generous.
                        The goal is to help you ship words that matter.
                    </p>
                </div>
                <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6">
                    <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Craft</p>
                    <h2 className="mt-3 text-2xl font-semibold">Tools that respect your flow</h2>
                    <p className="mt-3 text-sm text-zinc-400">
                        Drafts, publishing, and discovery — all designed to remove friction and keep you
                        in the margin between idea and execution.
                    </p>
                </div>
            </section>
        </main>
    );
}
