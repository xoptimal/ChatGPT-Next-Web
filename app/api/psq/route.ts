import {NextRequest, NextResponse} from "next/server";
import {getQuery} from "@/app/utils/api";
import OpenAI from "openai";
import prisma from "@/lib/prisma";
import {getServerSession} from "next-auth/next";
import {authOptions} from "@/lib/authOptions";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(req: NextRequest) {
    try {

        const session = await getServerSession(authOptions)

        const {current, pageSize, studentId, class: queryClass, username} = getQuery(req)

        const currentToNumber = parseInt(current)
        const pageSizeToNumber = parseInt(pageSize)

        const list = await prisma.psq.findMany({
            skip: currentToNumber === 1 ? 0 : currentToNumber * pageSizeToNumber,
            take: pageSizeToNumber,
            where: {
                user: {
                    username: {
                        equals: username,
                    },
                    studentId: {
                        equals: studentId,
                    },
                    class: {
                        equals: queryClass
                    },
                    school: {
                        equals: session?.user.school
                    },
                },
            },
            orderBy: {
                created_at: 'desc',
            },
            select: {
                id: true,
                content: true,
                report: true,
                created_at: true,
                userId: true,
                user: {
                    select: {
                        email: true,
                        class: true,
                        school: true,
                        username: true,
                        studentId: true,
                    }
                }
            }
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
        console.error(error)
        return NextResponse.json({error: 'System exception'}, {status: 500});
    }
}

export async function POST(req: NextRequest) {

    try {

        //  用户提交的信息
        const body = await req.json()

        //  添加助记词, 定义返回内容
        const content = `请根据这个内容: ${body.content}, 做一份留学报告反馈给我`

        try {
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
            body.report = `${completion.choices[0].message.content}`

            //  写入对象
            // await prisma.psq.update({
            //     where: {id: record.id},
            //     data: {report: callback}
            // });
        } catch (error) {
            console.error('Failed to connect to OpenAI:', error);
        }

        //  补充登录用户信息, 做关联 (如果有的话)
        const session = await getServerSession(authOptions)
        if (session) {
            body.userId = session.user.userId
        }

        await prisma.psq.create({data: body})

        return NextResponse.json({status: 200, statusText: 'OK'});

    } catch (error) {
        console.error(error)
        return NextResponse.json({error: 'System exception'}, {status: 500});
    }
}
