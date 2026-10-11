import type { NextConfig } from "next";

// Security headers (Content-Security-Policy, X-Frame-Options: DENY, X-Content-Type-Options: nosniff,
// Referrer-Policy, Permissions-Policy, Strict-Transport-Security) are centrally managed in middleware.ts.
const nextConfig: NextConfig = {};

export default nextConfig;
