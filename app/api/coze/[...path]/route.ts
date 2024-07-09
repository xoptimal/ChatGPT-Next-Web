import { getServerSideConfig } from "@/app/config/server";
import { GEMINI_BASE_URL, ModelProvider } from "@/app/constant";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../auth";

async function handle(
  req: NextRequest,
  { params }: { params: { path: string[] } },
) {
  console.log("[Google Route] params ", params);

  if (req.method === "OPTIONS") {
    return NextResponse.json({ body: "OK" }, { status: 200 });
  }

  const controller = new AbortController();

  const serverConfig = getServerSideConfig();

  let baseUrl = serverConfig.googleUrl || GEMINI_BASE_URL;

  if (!baseUrl.startsWith("http")) {
    baseUrl = `https://${baseUrl}`;
  }

  if (baseUrl.endsWith("/")) {
    baseUrl = baseUrl.slice(0, -1);
  }


  const timeoutId = setTimeout(
    () => {
      controller.abort();
    },
    10 * 60 * 1000,
  );

  const fetchOptions: RequestInit = {
    headers: req.headers,
    method: req.method,
    body: req.body,
    // to fix #2485: https://stackoverflow.com/questions/55920957/cloudflare-worker-typeerror-one-time-use-body
    redirect: "manual",
    // @ts-ignore
    duplex: "half",
    signal: controller.signal,
  };

  try {
    const res = await fetch("https://api.coze.com/open_api/v2/chat", fetchOptions);
    // to prevent browser prompt for credentials
    //const newHeaders = new Headers(res.headers);
    //newHeaders.delete("www-authenticate");
    // to disable nginx buffering
    //newHeaders.set("X-Accel-Buffering", "no");

    return new Response(res.body, {
      status: res.status,
      statusText: res.statusText,
      //headers: newHeaders,
    });
  } finally {
    clearTimeout(timeoutId);
  }
}

export const GET = handle;
export const POST = handle;

// export const runtime = "edge";
// export const preferredRegion = [
//   "arn1",
//   "bom1",
//   "cdg1",
//   "cle1",
//   "cpt1",
//   "dub1",
//   "fra1",
//   "gru1",
//   "hnd1",
//   "iad1",
//   "icn1",
//   "kix1",
//   "lhr1",
//   "pdx1",
//   "sfo1",
//   "sin1",
//   "syd1",
// ];
