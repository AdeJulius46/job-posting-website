"use server"
import bcrypt from "bcryptjs"
import { signIn } from "@/auth"
import { AuthError } from "next-auth";
import { prisma } from "@/lib/prisma";



export const registerUser = async (
    _prevState: { error?: string } | undefined,
    formData: FormData
) => {

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (!name || !email || !password || !confirmPassword) {
        return { error: "all fields are required" }
    }

    if (password !== confirmPassword) {
        return { error: "Passwords do not match" };
    }
    const exsistingUser = await prisma.user.findUnique({
        where: { email }
    })

    if (exsistingUser) {
        return { error: "email is already taken" }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword
        }
    })
    try {
        await signIn("credentials", { email, password, redirectTo: "/auth/signin" })

    } catch (error) {
        if (error instanceof AuthError) {
            return { error: "account created , but sign in failed" }
        }
        throw error
    }



}