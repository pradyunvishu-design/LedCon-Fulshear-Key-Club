import type { NextConfig } from "next";

// Security headers applied to every response.
// Follows OWASP recommendations for a public static site.
const securityHeaders = [
  // Prevent browsers from MIME-sniffing a response away from the declared Content-Type
  { key: "X-Content-Type-Options", value: "nosniff" },

  // Prevent the site from being embedded in an <iframe> on another origin (clickjacking)
  { key: "X-Frame-Options", value: "DENY" },

  // Legacy XSS filter — still respected by older browsers
  { key: "X-XSS-Protection", value: "1; mode=block" },

  // Only send the origin (no path) as the Referer header when navigating cross-origin
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },

  // Enforce HTTPS for 2 years, including sub-domains (set once Vercel confirms HTTPS)
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },

  // Disable access to sensitive browser APIs not needed by this site
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },

  // Content Security Policy — restrict what sources the browser may load
  // 'unsafe-inline' required: Next.js injects inline <style> and <script> tags
  // 'unsafe-eval' required: Next.js hydration in dev mode (safe to tighten after production audit)
  // frame-src: Google Maps embed used in the calendar page
  // img-src: local assets + ParentSquare logo in division section
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://files.smartsites.parentsquare.com",
      "frame-src https://maps.google.com https://www.google.com",
      "connect-src 'self'",
      "font-src 'self'",
      "media-src 'self'",
      "object-src 'none'",        // block Flash / plugins
      "base-uri 'self'",          // prevent base-tag injection
      "form-action 'self'",       // restrict where forms may submit
      "frame-ancestors 'none'",   // modern clickjacking protection (mirrors X-Frame-Options)
      "upgrade-insecure-requests",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  // Attach security headers to every route
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
