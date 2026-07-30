"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ApplyButton({ jobId }: { jobId: string }) {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [errorMessage, setErrorMessage] = useState<string>("");
    const [applicationStatus, setApplicationStatus] = useState<"idle" | "success" | "error">("idle");

    const handleApply = async () => {
        if (!session) {
            router.push("/auth/sigin");
            return;
        }

        setErrorMessage("");
        setApplicationStatus("idle");
        try {
            const response = await fetch(`/api/jobs/${jobId}/apply`, {
                method: "POST",
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to apply for job");
            }

            setApplicationStatus("success");
            alert("Application submitted successfully");
        } catch (error) {
            setApplicationStatus("error");
            if (error instanceof Error) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("Failed to apply for job");
            }
        }
    };

    if (status === "loading") {
        return (
            <button
                disabled
                className="w-full bg-indigo-400 text-white px-6 py-3 rounded-md font-medium cursor-not-allowed text-center"
            >
                Loading...
            </button>
        );
    }

    return (
        <>
            <button
                onClick={handleApply}
                disabled={applicationStatus === "success"}
                className="w-full bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {applicationStatus === "success" ? "Applied" : "Apply for this position"}
            </button>
            {applicationStatus === "error" && (
                <p className="mt-2 text-red-600 text-center">{errorMessage}</p>
            )}
            {applicationStatus === "success" && (
                <p className="mt-2 text-green-600 text-center">Application submitted successfully</p>
            )}
        </>
    );
}