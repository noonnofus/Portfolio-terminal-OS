import type { NextConfig } from "next";

function getSupabaseCspOrigin() {
    const value =
        process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
    if (!value) return null;

    try {
        return new URL(value).origin;
    } catch {
        return null;
    }
}

const nextConfig: NextConfig = {
    reactCompiler: true,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "avatars.githubusercontent.com",
            },
        ],
    },
    experimental: {
        optimizePackageImports: [],
    },
    async headers() {
        const connectSrc = ["'self'", getSupabaseCspOrigin()]
            .filter(Boolean)
            .join(" ");

        return [
            {
                source: "/(.*)",
                headers: [
                    {
                        key: "X-Content-Type-Options",
                        value: "nosniff",
                    },
                    {
                        key: "X-Frame-Options",
                        value: "DENY",
                    },
                    {
                        key: "Referrer-Policy",
                        value: "strict-origin-when-cross-origin",
                    },
                    {
                        key: "X-DNS-Prefetch-Control",
                        value: "on",
                    },
                    {
                        key: "Permissions-Policy",
                        value: "camera=(), microphone=(), geolocation=()",
                    },
                    {
                        key: "Content-Security-Policy",
                        value: `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' https://avatars.githubusercontent.com blob: data:; font-src 'self'; connect-src ${connectSrc}; frame-src 'self';`,
                    },
                    {
                        key: "Strict-Transport-Security",
                        value: "max-age=31536000; includeSubDomains; preload",
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
