import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    eslint: {
        // Warning: Allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: false,
    },
    typescript: {
        // Warning: Allows production builds to successfully complete even if
        // your project has TypeScript errors.
        ignoreBuildErrors: false,
    },
};

export default nextConfig;
