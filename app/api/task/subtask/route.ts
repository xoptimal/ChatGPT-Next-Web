import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  const session = await getServerSession(authOptions);

  try {
    let data = await req.json();

    data.createUserId = session?.user.userId;

    const res = await prisma.subtask.create({ data });

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

export async function DELETE(req: NextRequest, res: NextResponse) {
  try {
    let { id } = await req.json();

    const referencingRecords = await prisma.subtask_list.findMany({
      where: {
        subtaskId: id,
      },
    });

    if (referencingRecords.length > 0) {
      // 如果有引用记录，先删除它们
      await prisma.subtask_list.deleteMany({
        where: {
          subtaskId: id,
        },
      });
    }

    await prisma.subtask.delete({ where: { id } });

    return NextResponse.json({ status: 200, statusText: "OK", data: res });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "System exception" }, { status: 500 });
  }
}
