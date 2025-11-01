/**
 * Language selector component for switching between locales
 */

"use client";

import { useState } from "react";
import { IconButton, Row, Text } from "@once-ui-system/core";
import { useLocale } from "@/hooks/useLocale";
import { locales, localeLabels, localeFlags, type Locale } from "@/lib/i18n";

/**
 * Props for LanguageSelector component
 */
export interface LanguageSelectorProps {
    /** Size variant for the selector */
    size?: "s" | "m" | "l";
    /** Visual variant */
    variant?: "ghost" | "primary" | "secondary" | "tertiary" | "danger";
    /** Whether to show flags */
    showFlags?: boolean;
    /** Whether to show labels */
    showLabels?: boolean;
}

/**
 * Language selector component
 * @param props - The component props
 */
export function LanguageSelector({
    size = "s",
    variant = "ghost",
    showFlags = true,
    showLabels = false,
}: LanguageSelectorProps) {
    const { locale, setLocale, isLoading } = useLocale();
    const [isOpen, setIsOpen] = useState(false);

    /**
     * Handles locale change
     * @param newLocale - The new locale to set
     */
    const handleLocaleChange = async (newLocale: Locale) => {
        if (newLocale !== locale) {
            await setLocale(newLocale);
        }
        setIsOpen(false);
    };

    return (
        <Row gap="8" vertical="center">
            {locales.map((loc) => (
                <IconButton
                    key={loc}
                    size={size}
                    variant={locale === loc ? "secondary" : "ghost"}
                    onClick={() => handleLocaleChange(loc)}
                    disabled={isLoading}
                    tooltip={localeLabels[loc]}
                    aria-label={`Switch to ${localeLabels[loc]}`}
                >
                    <Row gap="4" vertical="center">
                        {showFlags && (
                            <Text variant="body-default-s">
                                {localeFlags[loc]}
                            </Text>
                        )}
                        {showLabels && (
                            <Text
                                variant="body-default-s"
                                onBackground={
                                    locale === loc
                                        ? "neutral-strong"
                                        : "neutral-medium"
                                }
                            >
                                {loc.toUpperCase()}
                            </Text>
                        )}
                        {!showFlags && !showLabels && (
                            <Text variant="body-default-s">
                                {loc.toUpperCase()}
                            </Text>
                        )}
                    </Row>
                </IconButton>
            ))}
        </Row>
    );
}
