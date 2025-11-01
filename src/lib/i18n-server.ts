/**
 * Server-side internationalization utilities
 * These utilities can only be used in Server Components or API routes
 */

import { cookies } from "next/headers";
import { defaultLocale, isValidLocale, type Locale } from "./i18n";

/**
 * Gets the current locale from cookies or returns default (server-side only)
 * @returns The current locale
 */
export async function getServerLocale(): Promise<Locale> {
    try {
        const cookieStore = await cookies();
        const locale = cookieStore.get("locale")?.value as Locale;

        if (locale && isValidLocale(locale)) {
            return locale;
        }
    } catch (error) {
        console.warn("Could not read locale from cookies:", error);
    }

    return defaultLocale;
}

/**
 * Gets the locale from various sources (headers, cookies, etc.) - server-side only
 * @param headers - Optional headers object
 * @returns The detected locale or default locale
 */
export async function detectServerLocale(headers?: Headers): Promise<Locale> {
    // Try to get from cookies first
    try {
        const cookieStore = await cookies();
        const locale = cookieStore.get("locale")?.value;
        if (locale && isValidLocale(locale)) {
            return locale;
        }
    } catch (error) {
        // Cookies not available, continue to other detection methods
    }

    // Try to get from Accept-Language header
    if (headers) {
        const acceptLanguage = headers.get("accept-language");
        if (acceptLanguage) {
            const preferredLocales = acceptLanguage
                .split(",")
                .map((lang) => lang.split(";")[0].trim().split("-")[0]);

            for (const lang of preferredLocales) {
                if (isValidLocale(lang)) {
                    return lang;
                }
            }
        }
    }

    return defaultLocale;
}
