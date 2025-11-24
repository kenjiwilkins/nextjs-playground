import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function proxy(request: NextRequest) {
  const isProtectedRoute = request.nextUrl.pathname.startsWith("/recipe/")

  if (isProtectedRoute) {
    const token = await getToken({ req: request })

    if (!token) {
      return NextResponse.redirect(new URL("/recipe", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
