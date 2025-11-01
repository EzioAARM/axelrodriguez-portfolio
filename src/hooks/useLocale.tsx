/**
 * Client-side locale management hooks and utilities
 */

"use client";

import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { Locale } from "@/lib/i18n";
import { defaultLocale, isValidLocale, detectClientLocale } from "@/lib/i18n";

/**
 * Locale context type
 */
type LocaleContextType = {
    /** Current locale */
    locale: Locale;
    /** Function to change the locale */
    setLocale: (locale: Locale) => void;
    /** Whether locale is loading */
    isLoading: boolean;
};

/**
 * Locale context for providing locale state throughout the app
 */
const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

/**
 * Props for LocaleProvider component
 */
type LocaleProviderProps = {
    /** Child components */
    children: ReactNode;
    /** Initial locale */
    initialLocale?: Locale;
};

/**
 * Provider component for locale context
 * @param props - The provider props
 */
export function LocaleProvider({
    children,
    initialLocale = defaultLocale,
}: LocaleProviderProps) {
    const [locale, setLocaleState] = useState<Locale>(initialLocale);
    const [isLoading, setIsLoading] = useState(false);

    /**
     * Sets the locale and updates the cookie
     * @param newLocale - The new locale to set
     */
    const setLocale = async (newLocale: Locale) => {
        if (newLocale === locale) return;

        setIsLoading(true);

        try {
            // Set cookie via API route
            await fetch("/api/locale", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ locale: newLocale }),
            });

            setLocaleState(newLocale);

            // Optionally reload the page to apply locale changes
            // You can remove this if you want to handle translations dynamically
            window.location.reload();
        } catch (error) {
            console.error("Failed to set locale:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Load locale from localStorage on client-side hydration
    useEffect(() => {
        const detectedLocale = detectClientLocale();
        if (detectedLocale !== locale) {
            setLocaleState(detectedLocale);
        }
    }, [locale]);

    // Save locale to localStorage when it changes
    useEffect(() => {
        localStorage.setItem("locale", locale);
    }, [locale]);

    const value: LocaleContextType = {
        locale,
        setLocale,
        isLoading,
    };

    return (
        <LocaleContext.Provider value={value}>
            {children}
        </LocaleContext.Provider>
    );
}

/**
 * Hook to use locale context
 * @returns The locale context
 * @throws Error if used outside of LocaleProvider
 */
export function useLocale(): LocaleContextType {
    const context = useContext(LocaleContext);
    if (context === undefined) {
        throw new Error("useLocale must be used within a LocaleProvider");
    }
    return context;
}

/**
 * Hook to get the current locale without the full context
 * @returns The current locale
 */
export function useCurrentLocale(): Locale {
    const { locale } = useLocale();
    return locale;
}
