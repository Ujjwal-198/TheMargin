import FeaturedBlogs from "@/components/FeaturedBlogs";
import BlogForm from "@/components/BlogForm";
import { getAuth } from "@/lib/auth.server";

export default async function Home() {
  const auth = await getAuth();

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.18),_transparent_55%)]" />
        <div className="absolute inset-x-0 top-24 h-64 bg-[radial-gradient(circle_at_left,_rgba(56,189,248,0.12),_transparent_50%)]" />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-6 py-20">
          <div className="flex flex-col gap-6">
            <p className="text-xs uppercase tracking-[0.45em] text-zinc-500">The Margin</p>
            <h1 className="text-4xl font-semibold leading-tight md:text-6xl">
              Make space for the story.
              <span className="block text-indigo-500">Publish with intention.</span>
            </h1>
            <p className="max-w-2xl text-sm text-zinc-400 md:text-base">
              The Margin is a quiet place to ship thoughtful ideas. Draft clean posts, keep the typography calm,
              and let the content breathe.
            </p>
            <div className="flex flex-wrap gap-4 text-xs text-zinc-400">
              <div className="rounded-full border border-zinc-800 bg-zinc-950 px-4 py-2">Minimal UI</div>
              <div className="rounded-full border border-zinc-800 bg-zinc-950 px-4 py-2">Indigo accents</div>
              <div className="rounded-full border border-zinc-800 bg-zinc-950 px-4 py-2">Focus on writing</div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Clarity</p>
              <p className="mt-3 text-lg font-semibold">Clean structure</p>
              <p className="mt-2 text-sm text-zinc-400">Content first, layout second. No noise, no clutter.</p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Craft</p>
              <p className="mt-3 text-lg font-semibold">Measured voice</p>
              <p className="mt-2 text-sm text-zinc-400">Every post reads like a quiet, confident note.</p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Consistency</p>
              <p className="mt-3 text-lg font-semibold">Signature palette</p>
              <p className="mt-2 text-sm text-zinc-400">Zinc base, indigo highlight, and generous breathing room.</p>
            </div>
          </div>
        </div>
      </section>

      {!auth.isAuthenticated && (
        <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 pb-12">
          <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-zinc-950 to-zinc-900 p-8 md:p-10">
            <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-indigo-600/20 blur-3xl" />
            <div className="absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-cyan-400/10 blur-3xl" />

            <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div className="max-w-xl">
                <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">Join The Margin</p>
                <h2 className="mt-3 text-3xl font-semibold">Sign in to publish your next idea</h2>
                <p className="mt-2 text-sm text-zinc-400">
                  Create an account or log in to draft posts, publish, and keep your writing in motion.
                </p>

                <div className="mt-5 flex flex-wrap gap-3 text-xs text-zinc-400">
                  <span className="rounded-full border border-zinc-800 bg-zinc-950 px-3 py-1">Draft autosave</span>
                  <span className="rounded-full border border-zinc-800 bg-zinc-950 px-3 py-1">Clean slugs</span>
                  <span className="rounded-full border border-zinc-800 bg-zinc-950 px-3 py-1">Indigo accents</span>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href="/signup"
                    className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
                  >
                    Create account
                  </a>
                  <a
                    href="/login"
                    className="inline-flex items-center justify-center rounded-full border border-zinc-700 px-6 py-2 text-sm font-semibold text-white transition hover:border-indigo-500/60 hover:text-indigo-300"
                  >
                    Sign in
                  </a>
                </div>
              </div>

              <div className="relative">
                <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6 shadow-[0_25px_60px_-45px_rgba(79,70,229,0.7)]">
                  <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Preview</p>
                    <span className="text-xs text-indigo-400">Draft</span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-white">A quiet update on space</h3>
                  <p className="mt-2 text-sm text-zinc-400">
                    Write in the margin. Let the interface fade. Keep the signal loud.
                  </p>
                  <div className="mt-6 flex items-center justify-between text-xs text-zinc-500">
                    <span>By you</span>
                    <span>3 min read</span>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs text-zinc-500">
                  <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 px-3 py-2">
                    <p className="text-sm font-semibold text-white">12</p>
                    <p>Drafts</p>
                  </div>
                  <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 px-3 py-2">
                    <p className="text-sm font-semibold text-white">3</p>
                    <p>Published</p>
                  </div>
                  <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 px-3 py-2">
                    <p className="text-sm font-semibold text-white">7</p>
                    <p>Ideas</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 pb-12">
        <div className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">Compose</p>
          <h2 className="text-3xl font-semibold">Start a new post</h2>
          <p className="text-sm text-zinc-400">
            Keep it tight, keep it thoughtful. Your draft lives here before it hits the feed.
          </p>
        </div>
        <BlogForm isAuthenticated={auth.isAuthenticated} authorId={auth.user?.id ?? null} />
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-20">
        <div className="flex items-center justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">Read</p>
            <h2 className="text-3xl font-semibold">Featured posts</h2>
            <p className="text-sm text-zinc-400">A short selection of what is new on the margin.</p>
          </div>
          <div className="hidden md:flex h-px flex-1 bg-gradient-to-r from-zinc-800 via-zinc-700 to-transparent" />
        </div>
        <FeaturedBlogs />
      </section>
    </main>
  );
}
