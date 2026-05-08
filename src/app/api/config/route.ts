import { NextResponse } from "next/server";
import { isAuthEnabled } from "@/lib/config";

export async function GET() {
  return NextResponse.json({
    apiGatewayUrl: "",
    appName: "Kafein Partner",
    appVersion: "0.1.0",
    authEnabled: isAuthEnabled,
  });
}
