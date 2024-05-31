import { getQuery } from "@/app/utils/api";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const { userId } = getQuery(req);
  const session = await getServerSession(authOptions);
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId ?? session!.user.userId,
      },
    });

    let data = user;
    if (user && user.info) {
      const info = JSON.parse(user.info);
      data = { ...info, ...user };
    }

    return NextResponse.json({ status: 200, statusText: "OK", data });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "System exception" }, { status: 500 });
  }
}
export async function PUT(req: NextRequest, res: NextResponse) {
  const session = await getServerSession(authOptions);

  try {
    const body = await req.json();

    const { username, phone, email, ...rest } = body;

    const data: any = {
      username: username,
      phone: phone,
      email: email,
      info: JSON.stringify(rest),
    };

    const res = await prisma.user.update({
      where: {
        id: session!.user.userId,
      },
      data,
    });

    return NextResponse.json({ status: 200, statusText: "OK", data: res });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "System exception" }, { status: 500 });
  }
}
