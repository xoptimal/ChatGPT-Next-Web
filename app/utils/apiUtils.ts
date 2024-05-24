import { getQuery } from "@/app/utils/api";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function queryList(
  tableName: string,
  req: any,
  where?: any,
  params?: { select?: any; include?: any },
) {
  try {
    const { current, pageSize } = getQuery(req);

    const currentToNumber = parseInt(current);
    const pageSizeToNumber = parseInt(pageSize);

    const list = await (prisma[tableName as any] as any).findMany({
      skip: currentToNumber === 1 ? 0 : currentToNumber * pageSizeToNumber,
      take: pageSizeToNumber,
      // orderBy: {
      //     createdAt: 'desc',
      // },
      where,
      include: params?.include,
      select: params?.select,
    });

    const total = await (prisma[tableName as any] as any).count({
      where,
    });

    const data = {
      status: 200,
      statusText: "OK",
      data: { list, total },
    };

    // Responding with the run ID in JSON format. This ID can be used for further operations
    // such as retrieving the run's output or continuing the conversation.
    return NextResponse.json(data);
  } catch (error) {
    // Handling and logging any errors that occur during the process. This includes errors in
    // API requests, data extraction, or any other part of the interaction flow.
    console.error(error);
    return NextResponse.json({ error: "System exception" }, { status: 500 });
  }
}
