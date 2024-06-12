import { ROLE } from "@/app/utils/dic";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const session = await getServerSession(authOptions);
  try {
    const user = await prisma.parent.findMany({
      where: {
        userId: session!.user.userId,
      },
    });
    return NextResponse.json({ status: 200, statusText: "OK", data: user });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "System exception" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, res: NextResponse) {
  const session = await getServerSession(authOptions);

  try {
    const body = await req.json();

    const data: any = {
      ...body,
      role: ROLE.PARENT,
      type: 1, // 默认为普通
      info: JSON.stringify(body.info),
    };

    //  创建家长
    const parent = await prisma.user.create({ data });

    //  增加关联
    await prisma.parent.create({
      data: { userId: session!.user.userId, parentId: parent.id },
    });

    const user = await prisma.user.findUnique({
      where: { id: session!.user.userId },
    });

    const info = JSON.parse(user!.info!);

    if (!info.parent1_id) {
      info.parent1_id = parent.id;
    } else if (!info.parent2_id) {
      info.parent2_id = parent.id;
    }

    //  更新用户
    await prisma.user.update({
      where: { id: session!.user.userId },
      data: {
        info: JSON.stringify(info),
      },
    });

    return NextResponse.json({ status: 200, statusText: "OK", data: parent });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "System exception" }, { status: 500 });
  }
}
