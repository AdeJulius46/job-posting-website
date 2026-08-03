"use client"
import { useRouter } from "next/navigation";
import { useState } from "react"


export default function DeleteButton({ jobId }: { jobId: string }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const handeldelete = async () => {
        if (!confirm("Delete this job? This cannot be undone.")) return;

        setLoading(true);

        try {
            const response = await fetch(`/api/jobs/${jobId}/delete`, {
                method: "POST",
            })

            if (response.ok) {
                router.refresh();
                alert("Job to deleted");

            }
        } catch (error) {

            setLoading(false);
            alert("Failed to delete job");
        }



    }

    return (
        <div>
            <button
                type="button"
                onClick={handeldelete}
                disabled={loading}
                className="text-red-600 hover:text-red-700 text-sm font-medium disabled:opacity-60"
            >
                {loading ? "Deleting..." : "Delete Job"}
            </button>
        </div>
    )
}