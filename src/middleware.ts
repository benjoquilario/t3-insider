import NextAuth from "next-auth"
import { NextResponse } from "next/server"
import { authConfig } from "./auth.config"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const pathname = req.nextUrl.pathname

  const isAuth = !!req.auth
  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/register")

  const sensitiveRoutes = ["/", "/setting", "/profile", "/edit-profile"]

  const isAccessingSensitiveRoute = sensitiveRoutes.some((route) =>
    pathname.startsWith(route)
  )

  if (isAuthPage) {
    if (isAuth) {
      return NextResponse.redirect(new URL("/", req.url))
    }

    return NextResponse.next()
  }

  if (!isAuth && isAccessingSensitiveRoute) {
    return NextResponse.redirect(new URL("/login", req.url))
  }
})

export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/profile/:path*",
    "/setting/",
    "/edit-profile",
  ],
}
