export default function UserProfileLoading() {
    return (
        <main className="min-h-screen bg-zinc-950 text-white px-6 py-16">
            <div className="mx-auto w-full max-w-6xl space-y-8">
                <div className="h-8 w-1/3 rounded bg-zinc-800/60 animate-pulse" />
                <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                    <div className="h-64 rounded-2xl border border-zinc-800 bg-zinc-950/60 animate-pulse" />
                    <div className="h-64 rounded-2xl border border-zinc-800 bg-zinc-950/60 animate-pulse" />
                </div>
            </div>
        </main>
    );
}
