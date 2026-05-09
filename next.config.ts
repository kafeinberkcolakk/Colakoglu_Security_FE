import { cwd } from "node:process";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        destination: "/flows",
        permanent: true,
        source: "/collectors",
      },
      {
        destination: "/flows/:path*",
        permanent: true,
        source: "/collectors/:path*",
      },
    ];
  },
  turbopack: {
    root: cwd(),
  },
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withNextIntl(nextConfig);
