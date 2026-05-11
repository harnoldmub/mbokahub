import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import {
  type NextFetchEvent,
  NextResponse,
  type NextRequest,
} from "next/server";

import { DEFAULT_MARKET, MARKETS } from "@/lib/markets";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/admin(.*)"]);

const NO_LOCALE_PREFIXES = [
  "/dashboard",
  "/admin",
  "/sign-in",
  "/sign-up",
  "/api",
  "/checkout",
  "/_next",
  "/favicon",
  "/robots",
  "/sitemap",
  "/manifest",
  "/icon",
  "/apple-icon",
  "/logo",
];

function needsLocalePrefix(pathname: string): boolean {
  for (const m of MARKETS) {
    if (pathname === `/${m}` || pathname.startsWith(`/${m}/`)) return false;
  }
  for (const prefix of NO_LOCALE_PREFIXES) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) return false;
  }
  if (/\.[\w]+$/.test(pathname)) return false;
  return true;
}

const clerkHandler = clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    const { userId } = await auth();
    if (!userId) {
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set(
        "redirect_url",
        req.nextUrl.pathname + req.nextUrl.search,
      );
      return NextResponse.redirect(signInUrl);
    }
  }
});

export function middleware(request: NextRequest, event: NextFetchEvent) {
  const { pathname } = request.nextUrl;

  // Redirect unprefixed paths to the default market before Clerk runs
  if (needsLocalePrefix(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = `/${DEFAULT_MARKET}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
  }

  return clerkHandler(request, event);
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
