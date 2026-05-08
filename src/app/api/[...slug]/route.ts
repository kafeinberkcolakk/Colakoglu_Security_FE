import { type NextRequest, NextResponse } from "next/server";
import { fetchWithSessionAuth } from "@/lib/auth/fetch-with-session";
import { BE_API_URL } from "@/lib/config";

export const maxDuration = 60;

type ProxyParams = {
  slug: string[];
};

async function handleProxy(request: NextRequest, params: Promise<ProxyParams>) {
  const { slug } = await params;

  const searchParams = request.nextUrl.searchParams.toString();
  const pathname = `/api/${slug.join("/")}`;

  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  if (contentType) {
    headers.set("Content-Type", contentType);
  }

  let fullPath = pathname;
  if (searchParams) {
    fullPath += `?${searchParams}`;
  }

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

    if (contentDisposition || (isDownloadEndpoint && response.ok)) {
      const responseHeaders = new Headers();

      if (responseContentType) {
        responseHeaders.set("Content-Type", responseContentType);
      }

      if (contentDisposition) {
        responseHeaders.set("Content-Disposition", contentDisposition);
      }

      if (!contentDisposition && isDownloadEndpoint) {
        responseHeaders.set(
          "Content-Disposition",
          `attachment; filename="download-${Date.now()}.bin"`,
        );
      }

      const blob = await response.blob();

      return new NextResponse(blob, {
        headers: responseHeaders,
        status: response.status,
      });
    }

    const bodyText = await response.text();

    if (!bodyText) {
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
    console.error("API proxy request failed", {
      message,
      method: request.method,
      target: proxyUrl.toString(),
    });

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<ProxyParams> },
) {
  return handleProxy(request, params);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<ProxyParams> },
) {
  return handleProxy(request, params);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<ProxyParams> },
) {
  return handleProxy(request, params);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<ProxyParams> },
) {
  return handleProxy(request, params);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<ProxyParams> },
) {
  return handleProxy(request, params);
}
