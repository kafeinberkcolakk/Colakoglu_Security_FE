import { NextResponse } from "next/server";
import { FLOWGRO_UI_URL, isAuthEnabled } from "@/lib/config";

export async function GET() {
  return NextResponse.json({
    apiGatewayUrl: "",
    appName: "Colakoglu Security",
    appVersion: "0.1.0",
    authEnabled: isAuthEnabled,
    flowgroBaseUrl: "/flowgro",
    flowgroUiUrl: FLOWGRO_UI_URL,
  });
}
