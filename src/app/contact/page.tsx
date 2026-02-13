'use client';

import { useState } from 'react';

export default function ContactPage() {
    const [showToast, setShowToast] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    return (
        <main className="min-h-screen bg-zinc-950 text-white">
            <section className="relative overflow-hidden border-b border-zinc-900">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.18),_transparent_55%)]" />
                <div className="relative mx-auto flex max-w-6xl flex-col gap-6 px-6 py-16">
                    <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">Contact</p>
                    <h1 className="text-4xl font-semibold md:text-5xl">Let’s talk about your next idea</h1>
                    <p className="max-w-2xl text-sm text-zinc-400 md:text-base">
                        Questions, feedback, or collaboration notes — send them our way. We usually reply
                        within two business days.
                    </p>
                </div>
            </section>

            <section className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-12 md:grid-cols-[1.2fr_0.8fr]">
                <form onSubmit={handleSubmit} className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <label className="flex flex-col gap-2 text-sm text-zinc-300">
                            First name
                            <input
                                type="text"
                                placeholder="First"
                                className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                            />
                        </label>
                        <label className="flex flex-col gap-2 text-sm text-zinc-300">
                            Last name
                            <input
                                type="text"
                                placeholder="Last"
                                className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                            />
                        </label>
                    </div>
                    <label className="mt-6 flex flex-col gap-2 text-sm text-zinc-300">
                        Email
                        <input
                            type="email"
                            placeholder="kumarujjwalsingh76@gmail.com"
                            className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                        />
                    </label>
                    <label className="mt-6 flex flex-col gap-2 text-sm text-zinc-300">
                        Message
                        <textarea
                            rows={5}
                            placeholder="Tell us what you're working on..."
                            className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                        />
                    </label>
                    <button
                        type="submit"
                        disabled
                        className="mt-6 inline-flex items-center justify-center rounded-full bg-gray-600 px-6 py-2 text-sm font-semibold text-white cursor-not-allowed"
                    >
                        Send message
                    </button>
                </form>

                <div className="flex flex-col gap-6">
                    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6">
                        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Contact</p>
                        <p className="mt-3 text-sm text-zinc-400">kumarujjwalsingh76@gmail.com</p>
                        <p className="text-sm text-zinc-400">+91 8744814775</p>
                    </div>
                    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6">
                        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Studio</p>
                        <p className="mt-3 text-sm text-zinc-400">124 Quiet Street</p>
                        <p className="text-sm text-zinc-400">Portland, OR</p>
                    </div>
                    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6">
                        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Response</p>
                        <p className="mt-3 text-sm text-zinc-400">
                            We reply Monday–Friday, 9am–6pm PST.
                        </p>
                    </div>
                </div>
            </section>
            {showToast && (
                <div className="fixed bottom-4 right-4 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg">
                    To contact on email
                </div>
            )}
        </main>
    );
}
