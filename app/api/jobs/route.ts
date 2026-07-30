import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";


export async function POST(request: Request) {

    const session = await auth()

    if (!session?.user || !session.user.id) {
        return NextResponse.redirect(new URL("/auth/sigin"))
    }

    try {
        const data = await request.json()
        const job = await prisma.job.create({
            data: {
                ...data,
                postedById: session.user.id,
            }
        })
        return NextResponse.json({ message: "Job posted successfully", job }, { status: 201 })

    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: "Failed to post job" }, { status: 500 })
    }

}