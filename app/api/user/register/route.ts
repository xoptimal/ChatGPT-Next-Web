import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest, res: NextResponse) {

    try {

        const data = await req.json()

        const existingUser = await prisma.user.findFirst({
            where: {
                phone: data.phone,
            },
        });

        if (existingUser) {
            return NextResponse.json({status: 409, statusText: '手机号已存在!'});
        }

        await prisma.user.create({data});

        return NextResponse.json({status: 200, statusText: 'OK'});

    } catch (error) {
        console.log("error", error)
        return NextResponse.json({error: 'System exception'}, {status: 500});
    }
}
