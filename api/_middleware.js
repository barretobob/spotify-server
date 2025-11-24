// api/_middleware.js
import { NextResponse } from "next/server";

export function middleware(req) {
  const res = NextResponse.next();
  return res;
}

export const config = {
  matcher: "/api/:path*"
};
