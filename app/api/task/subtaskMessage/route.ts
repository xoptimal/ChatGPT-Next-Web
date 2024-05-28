import { getQuery } from "@/app/utils/api";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const session = await getServerSession(authOptions);

  const { subtaskId } = getQuery(req);

  const list = await prisma.subtask_list.findMany({
    where: {
      subtaskId: parseInt(subtaskId),
    },
    include: {
      user: true,
    },
    // include: params?.include,
    // select: params?.select,
  });

  const data = {
    status: 200,
    statusText: "OK",
    data: { list },
  };

  // Responding with the run ID in JSON format. This ID can be used for further operations
  // such as retrieving the run's output or continuing the conversation.
  return NextResponse.json(data);
}
export async function POST(req: NextRequest, res: NextResponse) {
  const session = await getServerSession(authOptions);

  try {
    let data = await req.json();

    data.userId = session?.user.userId;

    const res = await prisma.subtask_list.create({ data });

    return NextResponse.json({ status: 200, statusText: "OK", data: res });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "System exception" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, res: NextResponse) {
  try {
    let { id, ...rest } = await req.json();

    const res = await prisma.subtask.update({ where: { id }, data: rest });

    return NextResponse.json({ status: 200, statusText: "OK", data: res });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "System exception" }, { status: 500 });
  }
}
