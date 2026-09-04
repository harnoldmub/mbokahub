import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import {
  type NextFetchEvent,
  type NextRequest,
  NextResponse,
} from "next/server";

import {
  ALL_LOCALES,
  DEFAULT_LOCALE,
  isLocale,
  LEGACY_LOCALE_REDIRECTS,
  LOCALES,
  localeForLanguage,
} from "@/lib/locales";

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
  for (const locale of LOCALES) {
    if (pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)) {
      return false;
    }
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
  const segment = pathname.split("/")[1] ?? "";

  // Ancien code marché : /fr-cod → /fr-cd, de façon permanente.
  const legacy = LEGACY_LOCALE_REDIRECTS[segment];
  if (legacy) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(`/${segment}`, `/${legacy}`);
    return NextResponse.redirect(url, 308);
  }

  // La langue vivait dans `?lang=` ; elle vit désormais dans le chemin. On
  // convertit le paramètre en locale quand cette locale est servie, et on le
  // laisse tomber sinon — plutôt que de faire semblant de le prendre en compte.
  const legacyLang = request.nextUrl.searchParams.get("lang");
  if (legacyLang) {
    const url = request.nextUrl.clone();
    url.searchParams.delete("lang");
    const target = localeForLanguage(
      legacyLang as Parameters<typeof localeForLanguage>[0],
    );
    if (target && isLocale(segment)) {
      url.pathname = pathname.replace(`/${segment}`, `/${target}`);
    }
    return NextResponse.redirect(url, 308);
  }

  // Locale connue mais pas encore servie (catalogue de traduction incomplet) :
  // on répond 404 directement, plutôt que de la préfixer par la locale par
  // défaut et de fabriquer une URL absurde comme /fr/en.
  if (
    ALL_LOCALES.includes(segment as (typeof ALL_LOCALES)[number]) &&
    !isLocale(segment)
  ) {
    return NextResponse.rewrite(new URL("/_not-found", request.url), {
      status: 404,
    });
  }

  // Chemins sans préfixe de locale → locale par défaut, avant Clerk.
  if (needsLocalePrefix(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = `/${DEFAULT_LOCALE}${pathname === "/" ? "" : pathname}`;
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
