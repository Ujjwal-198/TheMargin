"use client";
import { useState } from "react";
import Link from "next/link";
import Button from "@/components/Button";
import { KeyRound, Mail, UserRoundPlus, Eye, EyeOff } from "lucide-react";

export default function Signup() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            const res = await fetch("/api/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ firstName, lastName, email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data?.error || "Signup failed");
                return;
            }

            window.location.href = "/login";
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-zinc-950 text-white px-6 py-16">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.2),_transparent_55%)]" />
            <div className="absolute inset-x-0 top-28 h-72 bg-[radial-gradient(circle_at_left,_rgba(56,189,248,0.12),_transparent_55%)]" />

            <div className="relative w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950/80 p-8 shadow-[0_30px_70px_-40px_rgba(79,70,229,0.7)] backdrop-blur">
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-zinc-800 bg-zinc-950">
                        <UserRoundPlus className="h-6 w-6 text-indigo-400" />
                    </div>
                    <div>
                        <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">Join the margin</p>
                        <h1 className="text-2xl font-semibold">Create your account</h1>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <label className="flex flex-col gap-2 text-sm text-zinc-300">
                            First name
                            <input
                                className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                                type="text"
                                placeholder="First"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </label>
                        <label className="flex flex-col gap-2 text-sm text-zinc-300">
                            Last name
                            <input
                                className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                                type="text"
                                placeholder="Last"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </label>
                    </div>

                    <label className="flex flex-col gap-2 text-sm text-zinc-300">
                        Email
                        <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2">
                            <Mail className="h-4 w-4 text-zinc-500" />
                            <input
                                className="w-full bg-transparent text-sm text-white placeholder:text-zinc-600 focus:outline-none"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </label>

                    <label className="flex flex-col gap-2 text-sm text-zinc-300">
                        Password
                        <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2">
                            <KeyRound className="h-4 w-4 text-zinc-500" />
                            <input
                                className="w-full bg-transparent text-sm text-white placeholder:text-zinc-600 focus:outline-none"
                                type={showPassword ? "text" : "password"}
                                placeholder="Create a password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="text-zinc-500 hover:text-zinc-200 transition-colors"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </label>

                    {error ? <div className="text-sm text-red-400">{error}</div> : null}

                    <Button className="w-full rounded-full py-2" disabled={isSubmitting}>
                        {isSubmitting ? "Creating..." : "Get Started"}
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm text-zinc-400">
                    Already have an account?{" "}
                    <Link href="/login" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
