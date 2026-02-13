import UserProfileClient from "@/components/UserProfileClient";

type PageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function UserProfilePage({ params }: PageProps) {
    const { id } = await params;

    return (
        <main className="min-h-screen bg-zinc-950 text-white">
            <section className="relative overflow-hidden border-b border-zinc-900">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.18),_transparent_55%)]" />
                <div className="relative mx-auto flex max-w-6xl flex-col gap-6 px-6 py-16">
                    <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">Profile</p>
                    <h1 className="text-4xl font-semibold md:text-5xl">Author profile</h1>
                    <p className="max-w-2xl text-sm text-zinc-400 md:text-base">
                        Learn more about the writer and browse their latest posts.
                    </p>
                </div>
            </section>

            <section className="mx-auto w-full max-w-6xl px-6 py-12">
                <UserProfileClient userId={id} />
            </section>
        </main>
    );
}
