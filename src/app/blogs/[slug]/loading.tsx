export default function BlogLoading() {
    return (
        <main className="min-h-screen bg-zinc-950 text-white px-6 py-16">
            <div className="mx-auto w-full max-w-3xl space-y-6">
                <div className="h-4 w-1/4 rounded bg-zinc-800/60 animate-pulse" />
                <div className="h-10 w-3/4 rounded bg-zinc-800/60 animate-pulse" />
                <div className="h-64 rounded-2xl border border-zinc-800 bg-zinc-950/60 animate-pulse" />
                <div className="space-y-3">
                    <div className="h-4 w-full rounded bg-zinc-800/60 animate-pulse" />
                    <div className="h-4 w-11/12 rounded bg-zinc-800/60 animate-pulse" />
                    <div className="h-4 w-10/12 rounded bg-zinc-800/60 animate-pulse" />
                </div>
            </div>
        </main>
    );
}
