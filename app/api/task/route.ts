import { getQuery } from "@/app/utils/api";
import { queryList } from "@/app/utils/apiUtils";
import { ROLE } from "@/app/utils/dic";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const session = await getServerSession(authOptions);

  let where;
  let include = {
    counselor: true,
    user: true,
    subtask: true,
  };

  if (session?.user.role === ROLE.ADMIN) {
    //  管理员
    where = {};
  } else if (session?.user.role === ROLE.STUDENT) {
    //   学生
    where = {
      userId: session!.user.userId,
    };
  } else if (session?.user.role === ROLE.ADMIN) {
    //  顾问
    where = {
      counselorId: session!.user.userId,
    };
  }
  return queryList("task", req, where, { include });
}

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    let data = await req.json();

    const res = await prisma.task.create({ data });

    return NextResponse.json({ status: 200, statusText: "OK", data: res });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "System exception" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, res: NextResponse) {
  try {
    const { id, ...rest } = await req.json();

    await prisma.task.update({
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
