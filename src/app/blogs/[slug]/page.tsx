import Link from "next/link";
import BlogReader from "@/components/BlogReader";
import { getBlogBySlug } from "@/lib/blog/blog.query";
import { getAuth } from "@/lib/auth.server";

type PageProps = {
    params: Promise<{
        slug: string;
    }>;
};

export default async function BlogDetailsPage({ params }: PageProps) {
    const { slug } = await params;
    const blog = await getBlogBySlug(slug);

    const auth = await getAuth();
    const isOwner = auth.isAuthenticated && auth.user?.id === blog?.author;

    if (!blog || (blog.status !== "PUBLISHED" && !isOwner)) {
        return (
            <main className="min-h-screen bg-zinc-950 text-white px-6 py-20">
                <div className="mx-auto w-full max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-950/70 p-8 text-center">
                    <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">Not found</p>
                    <h1 className="mt-3 text-3xl font-semibold">This post is missing</h1>
                    <p className="mt-2 text-sm text-zinc-400">The story you are looking for does not exist.</p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-zinc-950 text-white">
            <section className="relative overflow-hidden border-b border-zinc-900">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.18),_transparent_55%)]" />
                <div className="relative mx-auto flex max-w-6xl flex-col gap-6 px-6 py-16">
                    <nav className="flex items-center gap-2 text-xs text-zinc-500">
                        <Link href="/" className="hover:text-white transition-colors">Home</Link>
                        <span>/</span>
                        <Link href="/blogs" className="hover:text-white transition-colors">Blogs</Link>
                        <span>/</span>
                        <span className="text-zinc-400">{blog.title}</span>
                    </nav>
                    <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">Reading</p>
                    <h2 className="text-3xl font-semibold md:text-4xl">Make space for the words</h2>
                    <p className="max-w-2xl text-sm text-zinc-400">
                        Quiet layout, generous spacing, and a single column to keep your focus where it belongs.
                    </p>
                </div>
            </section>

            <section className="px-6 py-14">
                <BlogReader blog={blog} />
            </section>
        </main>
    );
}
