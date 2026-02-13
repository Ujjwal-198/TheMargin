import { NextResponse } from "next/server";
import { handleSignup } from "@/lib/user/user.query";
import { signJwt } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { firstName, lastName, email, password } = body;

        const result = await handleSignup(firstName, lastName, email, password);

        if (result.error || !result.user) {
            return NextResponse.json({ error: result.error }, { status: 400 });
        }

        const token = signJwt({
            sub: result.user.id,
            email: result.user.email,
        });

        const response = NextResponse.json({ user: result.user }, { status: 201 });
        response.cookies.set("auth_token", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });

        return response;
    } catch {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
}
