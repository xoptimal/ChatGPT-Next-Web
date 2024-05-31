import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next"
import {authOptions} from "@/lib/authOptions";


export async function GET(req: NextRequest, res: NextResponse) {

    const session = await getServerSession(authOptions)

    try {

        const user = await prisma.user.findUnique({
            where: {
                id: session!.user.userId
            },
        });

        return NextResponse.json({status: 200, statusText: 'OK', data: user});

    } catch (error) {
        console.error(error)
        return NextResponse.json({error: 'System exception'}, {status: 500});
    }
}
export async function PUT(req: NextRequest, res: NextResponse) {

    const session = await getServerSession(authOptions)

    try {

        const body = await req.json()

        const data = await prisma.user.update({
            where: {
                id: session!.user.userId
            },
            data: body
        });

        return NextResponse.json({status: 200, statusText: 'OK', data});

    } catch (error) {
        console.error(error)
        return NextResponse.json({error: 'System exception'}, {status: 500});
    }
}
