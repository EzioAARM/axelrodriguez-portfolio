/**
 * Internationalization configuration and utilities
 * Handles language detection, locale management, and translations
 * This file contains shared types and client-safe utilities
 */

/**
 * Available locales in the application
 */
export const locales = ["es", "en"] as const;

/**
 * Type for supported locales
 */
export type Locale = (typeof locales)[number];

/**
 * Default locale for the application
 */
export const defaultLocale: Locale = "es";

/**
 * Locale labels for display in UI components
 */
export const localeLabels: Record<Locale, string> = {
    es: "Español",
    en: "English",
};

/**
 * Locale flags for visual representation
 */
export const localeFlags: Record<Locale, string> = {
    es: "🇬🇹",
    en: "🇺🇸",
};

/**
 * Validates if a string is a valid locale
 * @param locale - The locale string to validate
 * @returns True if the locale is valid
 */
export function isValidLocale(locale: string): locale is Locale {
    return locales.includes(locale as Locale);
}

/**
 * Client-side locale detection from browser
 * @returns The detected locale or default locale
 */
export function detectClientLocale(): Locale {
    if (typeof window === "undefined") {
        return defaultLocale;
    }

    // Try to get from localStorage first
    const savedLocale = localStorage.getItem("locale");
    if (savedLocale && isValidLocale(savedLocale)) {
        return savedLocale;
    }

    // Try to detect from browser language
    const browserLocale = navigator.language.split("-")[0];
    if (isValidLocale(browserLocale)) {
        return browserLocale;
    }

    return defaultLocale;
}
