import {PrismaClient} from "@prisma/client";
import {NextResponse} from "next/server";
import prisma from "@/lib/prisma";
export async function GET() {
    try {

        const list = await prisma.question.findMany({})

        const total = await prisma.question.count()

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
        console.error(`Error in -runAssistant: ${error}`);
        return NextResponse.json({error: 'Failed to run assistant'}, {status: 500});
    }
}

