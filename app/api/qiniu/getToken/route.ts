import {NextRequest, NextResponse} from "next/server";
import qiniu from 'qiniu'

const uploadUrl = process.env.QINIU_URL
const accessKey = process.env.QINIU_AK
const secretKey = process.env.QINIU_SK
const bucket = process.env.QINIU_BUCKET

/**
 * Get Qiniu Token
 * @constructor
 */
export async function GET() {

    const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

    const options = {
        scope: bucket,
        expires: 7200
    };
    const putPolicy = new qiniu.rs.PutPolicy(options);

    const uploadToken = putPolicy.uploadToken(mac)

    return NextResponse.json({status: 200, statusText: 'OK', data: {
        uploadToken,
        uploadUrl
    }});

}
