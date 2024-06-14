import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { ROLE } from "@/app/utils/dic";

export default withAuth(
  function middleware(req) {

    const { token } = req.nextauth;
    const { pathname, origin } = req.nextUrl;

    if (token) {
      if(token.role === ROLE.PARENT && pathname !== '/parent/task') {
        return NextResponse.redirect(`${origin}/parent/task`)
      }

      return NextResponse.next();

    } else {
      if (pathname.startsWith("/login")) {
      } else {
        return NextResponse.redirect(`${origin}/login`);
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        return true;
      },
    },
  },
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.gif|.*\\.js|.*\\.css|.*\\.svg|.*\\.woff|.*\\.woff2|.*\\.ttf).*)',

 ],
}
