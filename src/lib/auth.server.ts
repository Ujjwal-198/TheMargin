import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/auth";

export async function getAuth() {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) return { isAuthenticated: false, user: null };

    const payload = verifyJwt(token);
    if (!payload) return { isAuthenticated: false, user: null };

    return {
        isAuthenticated: true,
        user: {
            id: payload.sub as string,
            email: payload.email as string,
        },
    };
}
