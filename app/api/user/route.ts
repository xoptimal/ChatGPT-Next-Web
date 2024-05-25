import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {getQuery} from "@/app/utils/api";
import {ROLE} from "@/app/utils/dic";

export async function GET(req: NextRequest) {
    try {

        const {current, pageSize, role, username, phone, email} = getQuery(req)

        const currentToNumber = parseInt(current) || 1
        const pageSizeToNumber = parseInt(pageSize) || 20

        const parentRole = parseInt(role) || 0

        const where = {
            isDeleted: 0,
            role: parentRole,
            username: {
                contains: username
            },
            phone,
            email,
        }

        let select;
        if (parentRole === ROLE.STUDENT) {
            select = {
                id: true,
                username: true,
                school: true,
                class: true,
                phone: true,
                email: true,
                createdAt: true,
                age: true,
                score: true,
                address: true,
            }
        }

        const list = await prisma.user.findMany({
            skip: currentToNumber === 1 ? 0 : currentToNumber * pageSizeToNumber,
            take: pageSizeToNumber,
            where,
            orderBy: {
                createdAt: 'desc',
            },
            select
        })

        const total = await prisma.user.count({
            where
        })

        const data = {
            status: 200,
            statusText: 'OK',
            data: {list, total},
        }

        // Responding with the run ID in JSON format. This ID can be used for further operations
        // such as retrieving the run's output or continuing the conversation.
        return NextResponse.json(data);
    } catch (error) {
        // Handling and logging any errors that occur during the process. This includes errors in
        // API requests, data extraction, or any other part of the interaction flow.
        console.error(error)
        return NextResponse.json({error: 'System exception'}, {status: 500});
    }
}

export async function DELETE(req: NextRequest) {

    try {
        const {id} = await req.json(); // Assuming the ID is passed in the request body

        await prisma.user.update({where: {id}, data: {isDeleted: 1}})

        const data = {
            status: 200,
            statusText: 'OK',
        }
        return NextResponse.json(data);

    } catch (error) {
        console.error(error)
        return NextResponse.json({error: 'System exception'}, {status: 500});
    }

}