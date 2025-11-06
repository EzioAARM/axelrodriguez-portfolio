import type { Locale } from "@/lib/i18n";
import { isValidLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";

interface LocaleLayoutProps {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
    children,
    params,
}: LocaleLayoutProps) {
    const { locale } = await params;

    // Validate locale parameter
    if (!isValidLocale(locale)) {
        notFound();
    }

    return children;
}

export async function generateStaticParams() {
    return [{ locale: "es" }, { locale: "en" }];
}
