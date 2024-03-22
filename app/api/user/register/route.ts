import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest, res: NextResponse) {

    try {

        const body = await req.json()

        const existingUser = await prisma.user.findFirst({
            where: {
                email: body.email,
            },
        });

        if (existingUser) {
            return NextResponse.json({status: 409, statusText: '账号已存在!'});
        }

        await prisma.user.create({data: body});

        return NextResponse.json({status: 200, statusText: 'OK'});

    } catch (error) {
        console.log("error", error)
        return NextResponse.json({error: 'System exception'}, {status: 500});
    }
}
