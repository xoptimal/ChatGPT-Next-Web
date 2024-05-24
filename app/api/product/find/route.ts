import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { ROLE } from "@/app/utils/dic";
import { queryList } from "@/app/utils/apiUtils";

export async function GET() {
  const session = await getServerSession(authOptions);

  let where;
  let include = {
    productAudit: true,
  };

  if (session?.user.role === ROLE.ADMIN) {
  } else {
    //  目前是基于登录者身份查询的(学生)
    where = {
      userId: session!.user.userId,
      category: 1,
    };
  }
  const data = await prisma.product.findFirst({
    where,
  });

  const resp = {
    status: 200,
    statusText: "OK",
    data,
  };

  // Responding with the run ID in JSON format. This ID can be used for further operations
  // such as retrieving the run's output or continuing the conversation.
  return NextResponse.json(resp);
}
