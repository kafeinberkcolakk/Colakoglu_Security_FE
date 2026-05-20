import { type NextRequest, NextResponse } from "next/server";
import { fetchWithSessionAuth } from "@/lib/auth/fetch-with-session";
import { BE_API_URL } from "@/lib/config";

const TIMESTAMP_RADIX = 10;
const HTTP_NO_CONTENT = 204;

export interface ProxyParams {
  slug: string[];
}

interface ProxyOptions {
  /** Path prefix used both for matching the incoming Next.js route and for the upstream URL (e.g. "api", "flowgro"). */
  prefix: string;
}

function buildDownloadResponse(
  response: Response,
  responseContentType: string | null,
  contentDisposition: string | null,
  isDownloadEndpoint: boolean,
): Promise<NextResponse> {
  return response.blob().then((blob) => {
    const headers = new Headers();
    if (responseContentType !== null) {
      headers.set("Content-Type", responseContentType);
    }
    if (contentDisposition !== null) {
      headers.set("Content-Disposition", contentDisposition);
    } else if (isDownloadEndpoint) {
      headers.set(
        "Content-Disposition",
        `attachment; filename="download-${Date.now().toString(TIMESTAMP_RADIX)}.bin"`,
      );
    }
    return new NextResponse(blob, { headers, status: response.status });
  });
}

async function handleProxy(
  request: NextRequest,
  params: Promise<ProxyParams>,
  options: ProxyOptions,
): Promise<NextResponse> {
  const { slug } = await params;

  const searchParams = request.nextUrl.searchParams.toString();
  const pathname = `/${options.prefix}/${slug.join("/")}`;

  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  if (contentType !== null) {
    headers.set("Content-Type", contentType);
  }

  const fullPath =
    searchParams === "" ? pathname : `${pathname}?${searchParams}`;
  const proxyUrl = new URL(fullPath, BE_API_URL);

  try {
    let body: BodyInit | undefined;
    if (request.method !== "GET" && request.method !== "HEAD") {
      const contentLengthHeader = request.headers.get("content-length");
      const hasBody =
        contentLengthHeader !== null && Number(contentLengthHeader) > 0;
      if (hasBody) {
        body = await request.arrayBuffer();
      }
    }

    const response = await fetchWithSessionAuth(proxyUrl.toString(), {
      body,
      headers,
      method: request.method,
    });

    const responseContentType = response.headers.get("content-type");
    const contentDisposition = response.headers.get("content-disposition");
    const isDownloadEndpoint =
      pathname.includes("/export/download/") || pathname.includes("/download/");

    if (contentDisposition !== null || (isDownloadEndpoint && response.ok)) {
      return await buildDownloadResponse(
        response,
        responseContentType,
        contentDisposition,
        isDownloadEndpoint,
      );
    }

    if (response.status === HTTP_NO_CONTENT) {
      return new NextResponse(null, { status: HTTP_NO_CONTENT });
    }

    const bodyText = await response.text();
    if (bodyText === "") {
      return NextResponse.json(null, { status: response.status });
    }

    try {
      const json = JSON.parse(bodyText);
      return NextResponse.json(json, { status: response.status });
    } catch {
      return new NextResponse(bodyText, {
        headers: { "Content-Type": responseContentType ?? "text/plain" },
        status: response.status,
      });
    }
  } catch (reason) {
    const message =
      reason instanceof Error ? reason.message : "Unexpected exception";
    console.error("Proxy request failed", {
      message,
      method: request.method,
      target: proxyUrl.toString(),
    });

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export function createProxyHandler(options: ProxyOptions) {
  return (request: NextRequest, params: Promise<ProxyParams>) =>
    handleProxy(request, params, options);
}
