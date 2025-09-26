import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    experimental: {
        optimizePackageImports: ["@chakra-ui/react"],
    },
    i18n: {
        locales: ["ko", "en"],
        defaultLocale: "ko",
    },
};

export default nextConfig;
