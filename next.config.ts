import type {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const isProd = process.env.NODE_ENV === 'production';

// Content Security Policy — MVP: tightens defaults while keeping Next's
// hydration scripts, JSON-LD blocks, Google Fonts and Maps embed working.
// `unsafe-inline` / `unsafe-eval` are pragmatic for now; consider nonce
// middleware once admin content (markdown) starts accepting user input.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "img-src 'self' data: blob: https:",
  "connect-src 'self'",
  "frame-src 'self' https://www.google.com https://maps.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  isProd ? 'upgrade-insecure-requests' : ''
]
  .filter(Boolean)
  .join('; ');

const securityHeaders: Array<{key: string; value: string}> = [
  {key: 'Content-Security-Policy', value: csp},
  {key: 'X-Frame-Options', value: 'DENY'},
  {key: 'X-Content-Type-Options', value: 'nosniff'},
  {key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin'},
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()'
  }
];

if (isProd) {
  securityHeaders.push({
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  });
}

const supabaseHost = (() => {
  try {
    return new URL(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://example.supabase.co'
    ).hostname;
  } catch {
    return 'example.supabase.co';
  }
})();

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: supabaseHost,
        pathname: '/storage/v1/object/public/**'
      }
    ]
  },
  experimental: {
    serverActions: {
      // Gallery uploads cap at 5 MB; the action body needs headroom
      // for the file + form fields.
      bodySizeLimit: '6mb'
    }
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders
      }
    ];
  }
};

export default withNextIntl(nextConfig);
