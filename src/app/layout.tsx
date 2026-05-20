import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Toaster } from "sonner";
import AppHeader from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { ConfigProvider } from "@/components/providers/config-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import "./globals.css";

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  description: "Partner Kafein WebUI",
  title: "Colakoglu Security",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning={true}>
      <body
        className={`${sourceSans.variable} antialiased h-svh overflow-hidden`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            disableTransitionOnChange={true}
            enableSystem={false}
          >
            <QueryProvider>
              <ConfigProvider>
                <SidebarProvider className="h-svh">
                  <AppSidebar />
                  <SidebarInset className="min-h-0 overflow-hidden">
                    <AppHeader />
                    <main className="bg-background flex min-h-0 flex-1 flex-col overflow-auto">
                      {children}
                    </main>
                  </SidebarInset>
                </SidebarProvider>
              </ConfigProvider>
            </QueryProvider>
            <Toaster position="top-center" richColors={true} />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
