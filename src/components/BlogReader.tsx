import Link from "next/link";
import type { blog } from "@/types/blog";

type BlogReaderProps = {
    blog: blog;
};

export default function BlogReader({ blog }: BlogReaderProps) {
    const words = blog.content?.trim()?.split(/\s+/).filter(Boolean).length ?? 0;
    const minutes = Math.max(1, Math.ceil(words / 200));

    return (
        <article className="mx-auto w-full max-w-3xl text-white">
            <header className="flex flex-col gap-4">
                <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">Article</p>
                <h1 className="text-4xl font-semibold leading-tight md:text-5xl">{blog.title}</h1>
                <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500">
                    <span>
                        By{" "}
                        <Link
                            href={`/users/${blog.author}`}
                            className="text-zinc-300 hover:text-white transition-colors"
                        >
                            {blog.authorName ?? blog.author}
                        </Link>
                    </span>
                    <span className="h-1 w-1 rounded-full bg-zinc-700" />
                    <span>{blog.status ?? "DRAFT"}</span>
                    <span className="h-1 w-1 rounded-full bg-zinc-700" />
                    <span>{minutes} min read</span>
                </div>
            </header>

            {blog.featuredImage?.url ? (
                <div className="mt-8 overflow-hidden rounded-2xl border border-zinc-800">
                    <img
                        src={blog.featuredImage.url}
                        alt={blog.featuredImage.alt ?? blog.title}
                        className="w-full max-h-[420px] object-cover object-center"
                        loading="lazy"
                    />
                </div>
            ) : null}

            <div className="mt-10 space-y-6 text-base leading-relaxed text-zinc-200">
                {blog.content.split("\n").filter(Boolean).map((paragraph, index) => (
                    <p key={`${blog.slug}-p-${index}`}>{paragraph}</p>
                ))}
            </div>
        </article>
    );
}
