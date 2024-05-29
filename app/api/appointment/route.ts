import { getQuery } from "@/app/utils/api";
import { authOptions } from "@/lib/authOptions";
import dayjs from "@/lib/dayjs";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  //const session = await getServerSession(authOptions)

  const { level, date } = getQuery(req);

  const startOfMonth = dayjs(date).startOf("month").toDate();
  const startOfNextMonth = dayjs(date)
    .add(1, "month")
    .startOf("month")
    .toDate();

  const schedules = await prisma.schedule.findMany({
    where: {
      startTime: {
        gte: startOfMonth,
        lt: startOfNextMonth,
      },
      counselor: {
        type: parseInt(level),
      },
      status: 0, //  只查询未预约的
      isDeleted: 0, //  未删除的
    },
    orderBy: {
      startTime: "asc",
    },
    include: {
      counselor: true
    },
  });

  const groupedSchedules = schedules.reduce(
    (acc, schedule) => {
      const dateKey = dayjs(schedule.startTime).format("YYYY-MM-DD");
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(schedule);
      return acc;
    },
    {} as { [key: string]: typeof schedules },
  );

  const furtherGroupedSchedules = Object.entries(groupedSchedules).reduce(
    (acc, [dateKey, schedules]) => {
      const timeGroups = schedules.reduce(
        (timeAcc, schedule) => {
          const startTime = dayjs(schedule.startTime).format("HH:mm");
          const endTime = dayjs(schedule.endTime).format("HH:mm");
          const timeKey = `${startTime}-${endTime}`;

          if (!timeAcc[timeKey]) {
            timeAcc[timeKey] = {
              startTime,
              endTime,
              list: [],
            };
          }
          timeAcc[timeKey].list.push(schedule);
          return timeAcc;
        },
        {} as {
          [key: string]: {
            startTime: string;
            endTime: string;
            list: typeof schedules;
          };
        },
      );

      acc[dateKey] = Object.values(timeGroups);
      return acc;
    },
    {} as {
      [key: string]: {
        startTime: string;
        endTime: string;
        list: typeof schedules;
      }[];
    },
  );

  return NextResponse.json({
    status: 200,
    statusText: "OK",
    data: furtherGroupedSchedules,
  });
}

export async function POST(req: NextRequest, res: NextResponse) {
  const session = await getServerSession(authOptions);
  try {
    let { level, startTime, endTime } = await req.json();

    const schedule = await prisma.schedule.findFirst({
      where: {
        startTime: dayjs(startTime).toDate(),
        endTime: dayjs(endTime).toDate(),
        counselor: {
          type: parseInt(level),
        },
        status: 0, //  只查询未预约的
        isDeleted: 0, //  未删除的
      },
      include: {
        counselor: true,
      },
    });

    if (schedule) {

      const data = await prisma.schedule.update({
        data: {
          userId: session?.user.userId,
          status: 5, //  审核
        },
        where: {
          id: schedule.id,
        },
      });

      await prisma.scheduleAudit.create({data: {
        scheduleId: data.id,
        message:"发起预约"
      } })

      return NextResponse.json({
        status: 200,
        statusText: "OK",
        data: schedule,
      });
    } else {
      throw new Error("Schedule not found");
    }

    //  已经被预约了, 单独处理
  } catch (error) {
    console.error(error);

    const msg = (error as Error).message

    return NextResponse.json({ error: "System exception " + msg }, { status: 500 });
  }
}


