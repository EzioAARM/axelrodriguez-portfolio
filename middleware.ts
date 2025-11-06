import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { locales, defaultLocale, isValidLocale } from "./src/lib/i18n";
import type { Locale } from "./src/lib/i18n";

export function middleware(request: NextRequest) {
    // Check if there is any supported locale in the pathname
    const { pathname } = request.nextUrl;

    // Check if the pathname already includes a locale
    const pathnameHasLocale = locales.some(
        (locale: Locale) =>
            pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    if (pathnameHasLocale) {
        return NextResponse.next();
    }

    // Get locale from cookie or header
    let locale: Locale = defaultLocale;

    // Try to get locale from cookie first
    const cookieLocale = request.cookies.get("locale")?.value;
    if (cookieLocale && isValidLocale(cookieLocale)) {
        locale = cookieLocale;
    } else {
        // Try to detect from Accept-Language header
        const acceptLanguage = request.headers.get("accept-language");
        if (acceptLanguage) {
            const preferredLocale = acceptLanguage.split(",")[0].split("-")[0];
            if (isValidLocale(preferredLocale)) {
                locale = preferredLocale;
            }
        }
    }

    // Redirect to the locale-specific URL
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${pathname}`;

    return NextResponse.redirect(url);
}

export const config = {
    matcher: [
        // Skip all internal paths (_next, api, etc)
        "/((?!_next|api|favicon.ico|robots.txt|sitemap.xml|.*\\.).*)",
    ],
};
