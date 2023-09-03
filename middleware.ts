import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    let user_cookie = request.cookies.get("user_token");
    if (user_cookie?.value==="user_logged_in") {
        if(request.nextUrl.pathname==="/login" || request.nextUrl.pathname==="/signup"){
            return NextResponse.redirect(new URL("/dashboard", request.url))
        }
        return NextResponse.next();
    } else {
        if(request.nextUrl.pathname==="/login" || request.nextUrl.pathname==="/signup"){
            return NextResponse.next();
        }
        return NextResponse.redirect(new URL("/login", request.url))
    }
}

export const config = {
    matcher: ['/dashboard/:path*','/login','/signup']
}