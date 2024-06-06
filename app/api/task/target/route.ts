import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  const session = await getServerSession(authOptions);

  try {
    let { taskId, ...rest } = await req.json();

    const res = await prisma.taskTarget.create({
      data: {
        userId: session!.user.userId,
        ...rest,
      },
    });

    await prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        taskTargetId: res.id,
      },
    });

    return NextResponse.json({ status: 200, statusText: "OK", data: res });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "System exception" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, res: NextResponse) {
  try {
    const { id, ...rest } = await req.json();

    await prisma.taskTarget.update({
      where: {
        id,
      },
      data: rest,
    });

    return NextResponse.json({ status: 200, statusText: "OK" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "System exception" }, { status: 500 });
  }
}
