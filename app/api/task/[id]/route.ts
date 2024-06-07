import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params;

  const data = await prisma.task.findFirst({
    where: {
      id: parseInt(id),
    },
    include: {
      user: true,
      counselor: true,
      subtask: true,
      taskTarget: true,
    },
  });

  try {
    const res = {
      status: 200,
      statusText: "OK",
      data: data,
    };

    return NextResponse.json(res);
  } catch (error) {
    return NextResponse.json({ error: "System exception" }, { status: 500 });
  }
}
