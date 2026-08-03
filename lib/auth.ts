"use server"

import { signIn, signOut } from "@/auth"
import { AuthError } from "next-auth";



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