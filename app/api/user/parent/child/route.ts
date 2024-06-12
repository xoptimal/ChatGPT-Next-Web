import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const session = await getServerSession(authOptions);
  try {
    const user = await prisma.parent.findMany({
      where: {
        parentId: session!.user.userId,
      },
      include: {
        user: {
          select: {
            email: true,
            phone: true,
            username: true,
            info: true,
          },
        },
      },
    });
    return NextResponse.json({ status: 200, statusText: "OK", data: user });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "System exception" }, { status: 500 });
  }
}
