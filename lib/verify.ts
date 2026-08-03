"use server"
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { createAndSendVerificationPin } from "./otp";
import { redirect } from "next/navigation";



export async function verifyEmailpin(
    _prevState: { error?: string } | undefined,
    formData: FormData
) {

    const email = formData.get("email") as string;
    const pin = formData.get("pin") as string;


    if (!email || !pin) {
        return { error: "email and pin are required" }
    }

    const record = await prisma.verificationToken.findFirst({
        where: {
            identifier: email,
        },
        orderBy: {
            expires: "desc"
        }
    })
    if (!record) {
        return { error: "invalid or expired verification pin" }
    }

    const isValid = await bcrypt.compare(pin, record.token)
    if (!isValid) {
        return { error: "invalid or expired verification pin" }
    }

    await prisma.user.update({
        where: { email },
        data: { emailVerified: new Date() }
    })

    await prisma.verificationToken.delete({
        where: { identifier_token: { identifier: email, token: record.token } },
    });

    redirect("/auth/sigin?verified=1")

}
export const resendVerificationPin = async (email: string) => {
    if (!email) {
        throw new Error("email is required")
    }
    await createAndSendVerificationPin(email)

}