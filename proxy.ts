// middleware.ts - FIXED VERSION
import { NextRequest, NextResponse } from 'next/server'

export const proxy = async (request: NextRequest) => {
  try {
    // Simple cookie check instead of full session validation
    const sessionCookie = request.cookies.get('better-auth.session_token')

    if (!sessionCookie?.value) {
      const signInUrl = new URL('/sign-in', request.url)
      signInUrl.searchParams.set('from', request.nextUrl.pathname)
      return NextResponse.redirect(signInUrl)
    }

    // Let the page component do the full session validation
    return NextResponse.next()
  } catch (error) {
    console.error('Middleware error:', error)
    const signInUrl = new URL('/sign-in', request.url)
    return NextResponse.redirect(signInUrl)
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/order/:path*',
    '/shipping-address/:path*',
    '/place-order/:path*',
    // '/cart/:path*',
  ],
}
// import { betterFetch } from '@better-fetch/fetch'
// import type { auth } from '@/lib/auth'
// import { NextRequest, NextResponse } from 'next/server'

// type Session = typeof auth.$Infer.Session

// export async function middleware(request: NextRequest) {
//   if (request.nextUrl.pathname.startsWith('/api/auth')) {
//     return NextResponse.next()
//   }

//   const { data: session, error } = await betterFetch<Session>(
//     '/api/auth/get-session',
//     {
//       baseURL: request.nextUrl.origin,
//       headers: {
//         cookie: request.headers.get('cookie') || '', // Forward the cookies from the request
//       },
//       timeout: 5000,
//     }
//   )

//   if (error || !session) {
//     console.error('Session fetch error:', error)
//     return NextResponse.redirect(new URL('/sign-in', request.url))
//   }

//   return NextResponse.next()
// }

// export const config = {
//   matcher: [
//     '/dashboard/:path*',
//     '/order/:path*',
//     '/shipping-address/:path*',
//     '/place-order/:path*',
//     '/cart/:path*',
//   ],
// }
