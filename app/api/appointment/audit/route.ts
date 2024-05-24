import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
      const data = await req.json();

      await prisma.scheduleAudit.create({
          data: {
              scheduleId: data.scheduleId,
              message: data.message,
              attachment: data.attachment,
          }
      });

      if (data.status !== null) {
          await prisma.schedule.update({
              where: {id: data.scheduleId},
              data: {
                  status: data.status,
              },
          });
      }

      return NextResponse.json({status: 200, statusText: "OK"});
  } catch (error) {
      console.error(error);
      return NextResponse.json({error: "System exception"}, {status: 500});
  }
}

