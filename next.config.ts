import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

const isDev = process.env.NODE_ENV === 'development'
const isLiara = process.env.PLATFORM === 'liara'

const getAllowedDomains = () => {
  const envDomains = process.env.ALLOWED_DOMAINS?.split(',') || []

  const baseDomains = [
    'https://mye-commerce.storage.iran.liara.space',
    'https://*.zarinpal.com',
    'https://*.better-auth.com',
    'https://api.github.com',
    'https://accounts.google.com',
    'https://oauth2.googleapis.com',
    'https://www.googleapis.com',
    'https://sarina-leather.com',
    'https://api.twilio.com',
    'https://*.twilio.com',
    'https://api.kavenegar.com',
    'https://*.kavenegar.com',
  ]

  if (isDev) {
    return [...baseDomains, ...envDomains, 'data:', 'http://localhost:3000']
  }

  return [...baseDomains, ...envDomains]
}

const getCorsOrigins = () => {
  if (isDev) {
    return [
      'http://localhost:3000',
      'http://192.168.1.159:3000',
      'http://127.0.0.1:3000',
    ]
  }
  return ['https://sarina-leather.com']
}

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },

  images: {
    unoptimized: isLiara || process.env.DISABLE_IMAGE_OPTIMIZATION === 'true',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mye-commerce.storage.iran.liara.space',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
  },

  async headers() {
    const corsOrigins = getCorsOrigins()

    return [
      // Better-Auth specific routes - MOST PERMISSIVE
      {
        source: '/api/auth/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: isDev ? '*' : corsOrigins.join(','),
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'Content-Type, Authorization, X-Requested-With, X-CSRF-Token, Cookie',
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'cross-origin',
          },
        ],
      },

      // All other API routes
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: isDev ? '*' : corsOrigins.join(','),
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'Content-Type, Authorization, X-Requested-With, X-CSRF-Token',
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'cross-origin',
          },
        ],
      },

      // Public pages
      {
        source: '/((?!dashboard|api).*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self';",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval';",
              `connect-src 'self' ${getAllowedDomains().join(' ')};`,
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;",
              "font-src 'self' https://fonts.gstatic.com data:;",
              "img-src 'self' data: blob: https://mye-commerce.storage.iran.liara.space https://*.zarinpal.com https://lh3.googleusercontent.com;",
              "media-src 'self' blob: https://mye-commerce.storage.iran.liara.space;",
              "frame-src 'self' https://*.zarinpal.com https://accounts.google.com;",
              "frame-ancestors 'none';",
              "worker-src 'self' blob:;",
              "object-src 'none';",
            ].join(' '),
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },

      // Dashboard
      {
        source: '/dashboard/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self';",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline';",
              `connect-src 'self' https://mye-commerce.storage.iran.liara.space data: ${getAllowedDomains().join(
                ' '
              )};`,
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;",
              "font-src 'self' https://fonts.gstatic.com data:;",
              "img-src 'self' data: blob: https://mye-commerce.storage.iran.liara.space https://*.zarinpal.com https://lh3.googleusercontent.com;",
              "media-src 'self' blob: https://mye-commerce.storage.iran.liara.space;",
              "frame-src 'self' https://*.zarinpal.com;",
              "frame-ancestors 'none';",
              "worker-src 'self' blob:;",
              "object-src 'none';",
            ].join(' '),
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value:
              'camera=(self), microphone=(), geolocation=(), payment=(self)',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}

export default withNextIntl(nextConfig)
