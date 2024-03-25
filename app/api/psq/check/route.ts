import {NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {getServerSession} from "next-auth/next";
import {authOptions} from "@/lib/authOptions";


export async function GET() {
    try {

        const session = await getServerSession(authOptions)

        const psqExists = await prisma.psq.findFirst({
            where: {
                userId: session?.user.userId
            },
        })

        const data = {
            status: 200,
            statusText: 'OK',
            data: psqExists !== null,
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error(error)
        return NextResponse.json({error: 'System exception'}, {status: 500});
    }
}

