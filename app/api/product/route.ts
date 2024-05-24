import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {getServerSession} from "next-auth/next"
import {authOptions} from "@/lib/authOptions";
import {ROLE} from "@/app/utils/dic";
import {queryList} from "@/app/utils/apiUtils";


export async function GET(req: NextRequest, res: NextResponse) {

    const session = await getServerSession(authOptions)

    let where;
    let include = {
        productAudit: true
    }

    if (session?.user.role === ROLE.ADMIN) {


    } else {
        //  目前是基于登录者身份查询的(学生)
        where = {
            userId: session!.user.userId,
        };
    }

    return queryList('product', req, where, {include})
}

export async function POST(req: NextRequest, res: NextResponse) {

    try {

        const {attachment, message, ...rest} = await req.json()

        const res = await prisma.product.create({data: rest})

        const productAuditData = {
            productId: res.id,
            attachment,
            message,
        }
        
        await prisma.productAudit.create({data: productAuditData})

        return NextResponse.json({status: 200, statusText: 'OK', data: res});

    } catch (error) {
        console.error(error)
        return NextResponse.json({error: 'System exception'}, {status: 500});
    }
}
