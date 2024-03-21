import {withAuth} from "next-auth/middleware"
import {NextResponse} from "next/server"

export default withAuth(
    function middleware(req) {

        const {token} = req.nextauth
        const {pathname, origin} = req.nextUrl

        if (pathname.startsWith("/psq") && token?.role !== 1) {
            return NextResponse.redirect(`${origin}/unauthorized`)
        }

        if (pathname.startsWith("/report") && token?.role !== 2) {
            return NextResponse.redirect(`${origin}/unauthorized`)
        }

    },
    {
        callbacks: {
            authorized: ({token}) => !!token
        },
    }
)


export const config = {
    // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher

    //  这里写的就是要授权, 才可以访问的页面
    matcher: ['/', '/guide', '/psq', '/report', '/unauthorized', '/api/user/profile', '/api/psq', '/api/report'],
};
