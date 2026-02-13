'use client';
import Link from "next/link";
import Button from "./Button";
import { LogOut, LogIn, UserPlus, Menu, X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

type HeaderProps = {
    isAuthenticated?: boolean;
};

export default function Header({ isAuthenticated = false }: HeaderProps) {

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const router = useRouter();
    async function handleLogout() {
        await fetch("/api/logout", { method: "POST" });
        router.replace("/");
        router.refresh();
    }

    return (
        <header className="w-full sticky top-0 z-50 text-white">
            <div className="absolute inset-0 bg-zinc-950 backdrop-blur-xl border-b border-zinc-800" />

            {/* Mobile Header */}
            <div className="relative w-full md:hidden flex align-middle justify-between items-center py-4 px-6">
                <h1 className="text-2xl font-semibold">
                    <Link href="/" className="text-3xl bg-indigo-600 bg-clip-text text-transparent">The Margin</Link>
                </h1>
                <div>
                    {isMenuOpen ? (
                        <X onClick={() => setIsMenuOpen(false)} className="w-6 cursor-pointer" />
                    ) : (
                        <Menu onClick={() => setIsMenuOpen(true)} className="w-6 cursor-pointer" />
                    )}
                </div>
            </div>
            {isMenuOpen &&
                <div className="relative w-full flex flex-col gap-6 align-middle justify-start items-start py-4 px-6">
                    <nav className="flex flex-col gap-4 w-full text-sm">
                        <li className="list-none border-b border-zinc-800 pb-2"><Link href="/" className="hover:text-indigo-400 transition-colors">Home</Link></li>
                        <li className="list-none border-b border-zinc-800 pb-2"><Link href="/blogs" className="hover:text-indigo-400 transition-colors">Blogs</Link></li>
                        <li className="list-none border-b border-zinc-800 pb-2"><Link href="/about" className="hover:text-indigo-400 transition-colors">About</Link></li>
                        <li className="list-none border-b border-zinc-800 pb-2"><Link href="/contact" className="hover:text-indigo-400 transition-colors">Contact</Link></li>
                    </nav>
                    <div className="flex flex-wrap gap-3">
                        {isAuthenticated ? (
                            <>
                                <Link href="/dashboard">
                                    <Button className="flex gap-2 items-center text-sm bg-indigo-600 hover:bg-indigo-500">
                                        Dashboard <UserPlus className="w-4" />
                                    </Button>
                                </Link>
                                <Button onClick={handleLogout} className="flex gap-2 items-center text-sm bg-zinc-800 hover:bg-zinc-700">
                                    Logout <LogOut className="w-4" />
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link href="/signup">
                                    <Button className="flex gap-2 items-center text-sm bg-indigo-600 hover:bg-indigo-500">
                                        Signup <UserPlus className="w-4" />
                                    </Button>
                                </Link>
                                <Link href="/login">
                                    <Button className="flex gap-2 items-center text-sm bg-zinc-800 hover:bg-zinc-700">
                                        Login <LogIn className="w-4" />
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            }

            {/* Desktop Header */}
            <div className="relative hidden md:grid grid-cols-[1fr_auto_1fr] items-center px-10 py-4">
                <div className="justify-self-start">
                    <Link href="/" className="text-2xl font-semibold bg-indigo-600 bg-clip-text text-transparent">
                        The Margin
                    </Link>
                </div>
                <nav className="justify-self-center">
                    <ul className="flex items-center gap-10 text-sm text-zinc-300">
                        <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                        <li><Link href="/blogs" className="hover:text-white transition-colors">Blogs</Link></li>
                        <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                        <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                    </ul>
                </nav>
                <div className="justify-self-end flex items-center gap-4">
                    {isAuthenticated ? (
                        <>
                            <Link href="/dashboard">
                                <Button className="flex gap-2 items-center text-sm bg-indigo-600 hover:bg-indigo-500">
                                    Dashboard <UserPlus className="w-4" />
                                </Button>
                            </Link>
                            <Button onClick={handleLogout} className="flex gap-2 items-center text-sm bg-zinc-800 hover:bg-zinc-700">
                                Logout <LogOut className="w-4" />
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link href="/signup">
                                <Button className="flex gap-2 items-center text-sm bg-indigo-600 hover:bg-indigo-500">
                                    Signup <UserPlus className="w-4" />
                                </Button>
                            </Link>
                            <Link href="/login">
                                <Button className="flex gap-2 items-center text-sm bg-zinc-800 hover:bg-zinc-700">
                                    Login <LogIn className="w-4" />
                                </Button>
                            </Link>
                        </>
                    )}
                </div>

            </div >
        </header >
    )
}
