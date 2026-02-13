import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";

const secret = process.env.JWT_SECRET as string;

if (!secret) {
    throw new Error("Please add JWT_SECRET to .env.local");
}

export function signJwt(payload: JwtPayload, options: SignOptions = {}) {
    return jwt.sign(payload, secret, { expiresIn: "0.5h", ...options });
}

export function verifyJwt(token: string) {
    try {
        return jwt.verify(token, secret) as JwtPayload;
    } catch {
        return null;
    }
}
