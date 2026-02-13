import { UserModel } from "./user.model";
import { User } from "../../types/user";
import bcrypt from "bcryptjs";
import { connectMongoose } from "../mongoose";

export function mapUser(user: any): User {
    return {
        id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        createdAt: user.createdAt,
    };
}

export async function handleSignup(
    firstName: string,
    lastName: string,
    email: string,
    password: string
) {
    if (!firstName || !lastName || !email || !password) {
        return { error: "Missing required fields" };
    }

    try {
        await connectMongoose();

        const existingUser = await UserModel.findOne({ email }).lean();
        if (existingUser) {
            return { error: "User already exists" };
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const createdUser = await UserModel.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });

        return {
            user: mapUser(createdUser),
        };
    } catch (error) {
        return { error: "Database error" };
    }
}

export async function handleLogin(email: string, password: string) {
    if (!email || !password) {
        return { error: "Missing required fields" };
    }

    try {
        await connectMongoose();

        const user = await UserModel.findOne({ email }).lean();
        if (!user) {
            return { error: "User not found" };
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return { error: "Invalid credentials" };
        }

        return {
            user: mapUser(user),
        };
    } catch (error) {
        return { error: "Database error" };
    }
}

export async function handleLogout() {
    return {
        user: null,
    };
}

export async function getUserById(id: string) {
    try {
        await connectMongoose();
        const user = await UserModel.findById(id).lean();
        return user ? mapUser(user) : null;
    } catch (error) {
        return null;
    }
}
