import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json();

    const existingPhone = await prisma.user.findFirst({
      where: {
        phone: body.phone,
      },
    });

    const existingEmail = await prisma.user.findFirst({
      where: {
        email: body.email,
      },
    });

    if (existingPhone) {
      return NextResponse.json({ status: 409, statusText: "手机号已存在!" });
    }

    if (existingEmail) {
      return NextResponse.json({ status: 409, statusText: "邮箱已存在!" });
    }

    const { username, phone, email, password, role, ...rest } = body;

    const data: any = {
      username,
      phone,
      email,
      password,
      role,
      type: 1, // 默认为普通会员
      info: JSON.stringify(rest),
    };

    await prisma.user.create({ data });

    return NextResponse.json({ status: 200, statusText: "OK" });
  } catch (error) {
    console.log("error", error);
    return NextResponse.json({ error: "System exception" }, { status: 500 });
  }
}
