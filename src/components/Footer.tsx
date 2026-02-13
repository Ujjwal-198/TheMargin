import Link from "next/link";

export default function Footer() {
    return (
        <footer className="w-full border-t border-zinc-800 bg-zinc-950 text-white">
            <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-12 md:grid-cols-[1.2fr_1fr_1fr]">
                <div className="flex flex-col gap-4">
                    <Link href="/" className="text-2xl font-semibold bg-indigo-600 bg-clip-text text-transparent">
                        The Margin
                    </Link>
                    <p className="text-sm text-zinc-400 max-w-xs">
                        A calm place for focused writing. Ship ideas with intention and room to breathe.
                    </p>
                    <div className="flex gap-3 text-xs text-zinc-500">
                        <span className="rounded-full border border-zinc-800 px-3 py-1">Zinc</span>
                        <span className="rounded-full border border-zinc-800 px-3 py-1">Indigo</span>
                        <span className="rounded-full border border-zinc-800 px-3 py-1">Clarity</span>
                    </div>
                </div>

                <div className="flex flex-col gap-3 text-sm">
                    <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Navigate</p>
                    <Link href="/" className="text-zinc-300 hover:text-white transition-colors">Home</Link>
                    <Link href="/blogs" className="text-zinc-300 hover:text-white transition-colors">Blogs</Link>
                    <Link href="/about" className="text-zinc-300 hover:text-white transition-colors">About</Link>
                    <Link href="/contact" className="text-zinc-300 hover:text-white transition-colors">Contact</Link>
                </div>

                <div className="flex flex-col gap-3 text-sm">
                    <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Newsletter</p>
                    <p className="text-zinc-400">
                        Stay close to the margin. Monthly drops with new writing.
                    </p>
                    <div className="flex items-center gap-2">
                        <input
                            type="email"
                            placeholder="kumarujjwalsingh76@gmail.com"
                            className="w-full rounded-full border border-zinc-800 bg-zinc-950 px-4 py-2 text-xs text-zinc-200 placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                        />
                        <button disabled className="rounded-full bg-gray-600 px-4 py-2 text-xs font-semibold text-white cursor-not-allowed">
                            Join
                        </button>
                    </div>
                </div>
            </div>

            <div className="border-t border-zinc-800">
                <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 py-6 text-xs text-zinc-500 md:flex-row md:items-center md:justify-between">
                    <span>&copy; {new Date().getFullYear()} The Margin. All rights reserved.</span>
                    <span>Designed for focus. Built with quiet intent.</span>
                </div>
            </div>
        </footer>
    );
}
