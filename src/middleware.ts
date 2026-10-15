import { getSessionCookie } from "better-auth/cookies";
import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

const PROTECTED = ["/dashboard", "/editor", "/checkout", "/invitations"];

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const [, maybeLocale, ...rest] = pathname.split("/");
  const locale = (routing.locales as readonly string[]).includes(maybeLocale)
    ? maybeLocale
    : routing.defaultLocale;
  const path = "/" + ((routing.locales as readonly string[]).includes(maybeLocale) ? rest : [maybeLocale, ...rest]).join("/");

  // Cookie presence is only an optimistic check; pages re-validate the session on the server.
  if (PROTECTED.some((p) => path === p || path.startsWith(p + "/")) && !getSessionCookie(request)) {
    const url = new URL(`/${locale}/login`, request.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
