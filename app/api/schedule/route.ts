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
    scheduleAudit: true,
    user: true,
  };

  if (session?.user.role === ROLE.ADMIN) {
    //  管理员
    where = {
      // status: {
      //   in: [5, 6],
      // },
    };
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

  return queryList("schedule", req, where, { include });
}

export async function POST(req: NextRequest, res: NextResponse) {
  const session = await getServerSession(authOptions);
  try {
    let data = await req.json();

    data = data.map((item: any) => ({
      ...item,
      counselorId: session?.user.userId,
    }));

    await prisma.schedule.createMany({ data });

    return NextResponse.json({ status: 200, statusText: "OK" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "System exception" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, res: NextResponse) {
    try {
        const data = await req.json();

        await prisma.scheduleAudit.update({
            where: {
                id: data.targetId
            },
            data: {
                auditMessage: data.auditMessage,
            }
        });

        await prisma.schedule.update({
            where: {id: data.scheduleId},
            data: {
                status: data.status,
            },
        });

        return NextResponse.json({status: 200, statusText: "OK"});

    } catch (error) {
        console.error(error);
        return NextResponse.json({error: "System exception"}, {status: 500});
    }
}
