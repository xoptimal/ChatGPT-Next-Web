import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
// // import { NextResponse } from "next/server";

// import { NextResponse } from "next/server";

// // export const config = {
// //   // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher

// //   matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],

// //   //  这里写的就是要授权, 才可以访问的页面
// // //   matcher: [
// // //     "/",
// // //     "/task",
// // //     "/task/27",
// // //     "/guide",
// // //     "/psq",
// // //     "/report",
// // //     "/unauthorized",
// // //     "/api/user/profile",
// // //     "/api/psq",
// // //     "/api/report",
// // //     // {
// // //     //     source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
// // //     //     missing: [
// // //     //       { type: 'header', key: 'next-router-prefetch' },
// // //     //       { type: 'header', key: 'purpose', value: 'prefetch' },
// // //     //     ],
// // //     // }
// // //   ],
// // };


export default withAuth(
  function middleware(req) {
    const { token } = req.nextauth;
    const { pathname, origin } = req.nextUrl;

    if (token) {
      return NextResponse.next();
    } else {
        if(pathname.startsWith("/login")) {

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
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
