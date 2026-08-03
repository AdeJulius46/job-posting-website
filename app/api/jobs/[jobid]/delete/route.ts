import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";


export async function POST(request: Request, { params, }: { params: Promise<{ jobid: string }> }) {

    const session = await auth();
    if (!session?.user || !session.user.id) {
        return NextResponse.redirect(new URL('/auth/sigin', request.url));
    }


    try {
        const jobid = (await params).jobid;
        const job = await prisma.job.findUnique({
            where: { id: jobid }
        })
        if (!job) {
            return new NextResponse("Job not found", { status: 404 })
        }
        if (job.postedById !== session.user.id) {
            return new NextResponse("you can not delete this job", { status: 400 })
        }

        await prisma.job.delete({
            where: {
                id: jobid

            },

        });
        return NextResponse.json({ message: "Job deleted successfully" })


    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: "Failed to apply for job" }, { status: 500 })
    }
}