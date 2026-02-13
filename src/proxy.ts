import { NextResponse, type NextRequest } from "next/server";
import { verifyJwt } from "@/lib/auth";

export function proxy(req: NextRequest) {
    const token = req.cookies.get("auth_token")?.value;

    if (!token || !verifyJwt(token)) {
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("next", req.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*"],
};
