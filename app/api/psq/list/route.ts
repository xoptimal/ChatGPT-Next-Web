import { queryList } from "@/app/utils/apiUtils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {

    let where;
    let include = {
        user: true
    }

    return queryList('psq', req, where, {include})
}