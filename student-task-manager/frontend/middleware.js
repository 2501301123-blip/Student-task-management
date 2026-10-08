import { NextResponse } from "next/server";

const PROTECTED_PATHS = [
  "/overview",
  "/projects",
  "/tasks",
  "/calendar",
  "/analytics",
  "/documents",
  "/messages",
  "/team",
  "/settings",
];

// Runs on the edge, before any Server Component renders. This is what makes
// per-user data isolation safe: without this check, a logged-out visitor
// hitting e.g. /tasks directly would cause the page's Server Component to
// call the (now-protected) REST API with no token, get a 401, and crash the
// page instead of being redirected cleanly to /login.
export function middleware(request) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  if (!isProtected) return NextResponse.next();

  const token = request.cookies.get("studyflow_token")?.value;
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/overview/:path*", "/projects/:path*", "/tasks/:path*", "/calendar/:path*", "/analytics/:path*", "/documents/:path*", "/messages/:path*", "/team/:path*", "/settings/:path*"],
};
