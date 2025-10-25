import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)
export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  if (
    request.nextUrl.pathname.startsWith('/api') ||
    pathname.startsWith('/dashboard')
  ) {
    return NextResponse.next()
  }

  const intlResponse = intlMiddleware(request)

  const pathSegments = pathname.split('/')
  const locale = pathSegments[1] || routing.defaultLocale

  // Check if this is a locale-prefixed path
  const isValidLocale = routing.locales.includes(
    locale as 'fa' | 'en' | 'de' | 'fr' | 'it'
  )
  const pathWithoutLocale = isValidLocale
    ? '/' + pathSegments.slice(2).join('/')
    : pathname

  // Define protected routes
  const protectedRoutes = ['/order', '/shipping-address', '/place-order']

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathWithoutLocale.startsWith(route)
  )
  if (isProtectedRoute) {
    try {
      const sessionCookie = request.cookies.get('better-auth.session_token')

      if (!sessionCookie?.value) {
        const signInUrl = new URL(
          isValidLocale ? `/${locale}/sign-in` : '/sign-in',
          request.url
        )
        signInUrl.searchParams.set('from', pathname)
        return NextResponse.redirect(signInUrl)
      }
    } catch (error) {
      console.error('Auth middleware error:', error)
      const signInUrl = new URL(
        `/${routing.defaultLocale}/sign-in`,
        request.url
      )
      return NextResponse.redirect(signInUrl)
    }
  }
  return intlResponse
}
// export const config = {
//   matcher: [
//     '/dashboard/:path*',
//     '/order/:path*',
//     '/shipping-address/:path*',
//     '/place-order/:path*',
//     // '/cart/:path*',
//   ],
// }
export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)', '/dashboard/:path*'],
}
