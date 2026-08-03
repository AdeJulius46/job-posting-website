"use server"
import { Resend } from "resend";

const { RESEND_API_KEY, EMAIL_FROM } = process.env;

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;


export async function sendMail(to: string, subject: string, text: string) {
    if (!resend) {
        console.log("Resend not configured")
        return
    }
    const { error } = await resend.emails.send({
        from: EMAIL_FROM ?? "onboarding@resend.dev",
        to,
        subject,
        text,
    });

    if (error) {
        console.error("[mailer] Resend error:", error);
        throw new Error(`Failed to send verification email: ${error.message}`);
    }
}