import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * 管理员审核
 * @param req
 * @param res
 * @constructor
 */
export async function PUT(req: NextRequest, res: NextResponse) {
  try {
    const data = await req.json();

    await prisma.productAudit.update({
      where: {
        id: data.targetId,
      },
      data: {
        auditMessage: data.auditMessage,
      },
    });

    const product = await prisma.product.update({
      where: { id: data.productId },
      data: {
        status: data.status,
      },
    });

    if (data.status === 1) {    //  说明通过了
      //  更新到用户表(同步等级)
      await prisma.user.update({
        where: { id: product.userId },
        data: {
          type: product.type,
        },
      });
    }

    return NextResponse.json({ status: 200, statusText: "OK" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "System exception" }, { status: 500 });
  }
}

/**
 * 用户提交
 * @param req
 * @param res
 * @constructor
 */
export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const data = await req.json();

    await prisma.productAudit.create({
      data: {
        productId: data.productId,
        message: data.message,
        attachment: data.attachment,
      },
    });

    //  如果是更新的话, 需要同步到Product的表的status
    if (data.status !== null) {
      await prisma.product.update({
        where: { id: data.productId },
        data: {
          status: data.status,
        },
      });
    }

    return NextResponse.json({ status: 200, statusText: "OK" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "System exception" }, { status: 500 });
  }
}
