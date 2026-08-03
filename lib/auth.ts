"use server"

import { signIn, signOut } from "@/auth"
import { AuthError } from "next-auth";
import { prisma } from "./prisma";



export const login = async () => {
    await signIn("github", { redirectTo: "/" })
}


export const logout = async () => {
    await signOut({ redirectTo: "/auth/sigin" })
}

export const loginWithCredentials = async (
    _prevState: { error?: string } | undefined,
    formData: FormData
) => {
    const email = formData.get("email") as string;
    // const password = formData.get("password") as string;

    const user = await prisma.user.findUnique({ where: { email } });
    if (user?.password && !user.emailVerified) {
        return {
            error: "Please verify your email before signing in.",
            unverifiedEmail: email,
        };
    }

    try {
        await signIn("credentials", {
            email: formData.get("email"),
            password: formData.get("password"),
            redirectTo: "/Jobs",
        })
    } catch (error) {
        if (error instanceof AuthError) {
            return { error: "Invalid email or password" }
        }
        throw error
    }
}