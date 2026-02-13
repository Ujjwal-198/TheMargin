import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    children: ReactNode;
    className?: string;
};

export default function Button({ children, className = "", ...props }: ButtonProps) {
    return (
        <button
            {...props}
            className={`px-4 py-1 text-sm cursor-pointer rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-md hover:shadow-slate-800 transition-all duration-200 ease-in-out ${className}`}
        >
            {children}
        </button>
    );
}
