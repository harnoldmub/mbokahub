import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import {
  type NextFetchEvent,
  type NextRequest,
  NextResponse,
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
  "/opengraph-image",
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

  // Clerk doit s'initialiser sur TOUTES les routes, y compris publiques :
  // plusieurs pages publiques appellent `auth()` pour savoir si le visiteur est
  // connecté, propriétaire de la fiche ou administrateur (fiche prestataire,
  // fiche trajet, /pro, /vip). Sans ce passage, Clerk lève « auth() was called
  // but Clerk can't detect usage of clerkMiddleware() » et la page tombe sur sa
  // frontière d'erreur — uniquement pour les visiteurs porteurs d'une session,
  // ce qui rend la panne invisible aux requêtes anonymes.
  // La protection stricte de /dashboard et /admin reste assurée par
  // `clerkHandler`, qui n'exige une session que sur ces routes.
  return clerkHandler(request, event);
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
