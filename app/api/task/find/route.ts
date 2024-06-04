import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";
import { NextApiRequest } from "next";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

export async function GET(
  req: NextApiRequest,
) {

  const session = await getServerSession(authOptions);

  const data = await prisma.task.findFirst({
    where: {
      userId: session!.user.userId
    },
    include: {
      user: true,
      counselor: true,
      subtask: true,
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
