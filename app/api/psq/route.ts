import {PrismaClient} from "@prisma/client";
import {NextRequest, NextResponse} from "next/server";
import {getQuery} from "@/app/utils/api";
import OpenAI from "openai";

const prisma = new PrismaClient();

const openai = new OpenAI();


export async function GET(req: NextRequest) {
    try {

        const {current, pageSize, username, phone} = getQuery(req)

        const currentToNumber = parseInt(current)
        const pageSizeToNumber = parseInt(pageSize)

        const list = await prisma.psq.findMany({
            skip: currentToNumber === 1 ? 0 : currentToNumber * pageSizeToNumber,
            take: pageSizeToNumber,
            where: {
                username: {
                    contains: username
                },
                phone: {
                    contains: phone
                },
            },
            orderBy: {
                created_at: 'desc',
            },

        })

        const total = await prisma.psq.count()

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

export async function POST(req: NextRequest) {
    try {

        //  用户提交的信息
        const body = await req.json()

        //  写入到数据库
        const record = await prisma.psq.create({data: body})

        Promise.resolve().then(async () => {
            //  添加助记词, 定义返回内容
            const content = `请根据这个内容: ${body.content}, 做一份报告反馈给我`

            //  请求
            const completion = await openai.chat.completions.create({
                messages: [{role: "user", content}],
                model: "gpt-3.5-turbo",
                frequency_penalty: 0,
                presence_penalty: 0,
                temperature: 0.5,
                top_p: 1
            });

            //  解答内容
            const callback = `${completion.choices[0].message.content}`

            //  写入对象
            await prisma.psq.update({
                where: {id: record.id},
                data: {report: callback}
            });
        })
        return NextResponse.json({status: 200, statusText: 'OK'});

    } catch (error) {
        // Handling and logging any errors that occur during the process. This includes errors in
        // API requests, data extraction, or any other part of the interaction flow.
        console.error(`Error in -runAssistant: ${error}`);
        return NextResponse.json({error: 'Failed to run assistant'}, {status: 500});
    }
}
