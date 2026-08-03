"use client"

import { Suspense, useState } from "react";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { verifyEmailpin, resendVerificationPin } from "@/lib/verify";

function VerifyForm() {
    const searchParams = useSearchParams();
    const email = searchParams.get("email") ?? "";
    const [state, formAction, pending] = useActionState(verifyEmailpin, undefined);
    const [resent, setResent] = useState(false);

    async function handleResend() {
        setResent(false);
        await resendVerificationPin(email);
        setResent(true);
    }

    return (
        <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg mx-4">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Verify your email</h2>
                    <p className="text-gray-600">
                        We sent a 6-digit code to{" "}
                        <span className="font-medium text-gray-900">{email || "your email"}</span>
                    </p>
                </div>

                <form action={formAction} className="mt-8 space-y-4">
                    {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

                    <input type="hidden" name="email" value={email} />

                    <div>
                        <label htmlFor="pin" className="block text-sm font-medium text-gray-700 mb-1">
                            Verification code
                        </label>
                        <input
                            id="pin"
                            name="pin"
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]{6}"
                            maxLength={6}
                            required
                            placeholder="123456"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 text-center text-lg tracking-[0.5em] placeholder:tracking-normal placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={pending}
                        className="w-full px-4 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-60"
                    >
                        {pending ? "Verifying..." : "Verify email"}
                    </button>
                </form>

                <button
                    onClick={handleResend}
                    className="mt-4 w-full text-center text-sm text-indigo-600 hover:text-indigo-500 font-medium"
                >
                    Resend code
                </button>
                {resent && (
                    <p className="mt-2 text-center text-sm text-green-600">New code sent.</p>
                )}
            </div>
        </div>
    );
}

export default function VerifyPage() {
    return (
        <Suspense fallback={null}>
            <VerifyForm />
        </Suspense>
    );
}
