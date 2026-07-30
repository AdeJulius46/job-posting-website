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

        const existingApplication = await prisma.application.findFirst({
            where: { jobId: jobid, userId: session.user.id }
        })
        if (existingApplication) {
            return new NextResponse("You have already applied for this", { status: 400 })

        }


        const apllication = await prisma.application.create({
            data: {
                jobId: jobid,
                userId: session.user.id,
                status: "PENDING"
            },

        });
        return NextResponse.json(apllication)


    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: "Failed to apply for job" }, { status: 500 })
    }
}