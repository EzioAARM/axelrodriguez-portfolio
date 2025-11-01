/**
 * API route for handling locale changes
 * Sets the locale cookie when called from the client
 */

import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { isValidLocale } from "@/lib/i18n";

/**
 * Handle POST request to set locale
 * @param request - The incoming request
 */
export async function POST(request: NextRequest) {
    try {
        const { locale } = await request.json();

        // Validate the locale
        if (!locale || !isValidLocale(locale)) {
            return NextResponse.json(
                { error: "Invalid locale" },
                { status: 400 }
            );
        }

        // Set the locale cookie
        const cookieStore = await cookies();
        cookieStore.set("locale", locale, {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 365, // 1 year
            path: "/",
        });

        return NextResponse.json({ success: true, locale });
    } catch (error) {
        console.error("Error setting locale:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

/**
 * Handle GET request to get current locale
 */
export async function GET() {
    try {
        const cookieStore = await cookies();
        const locale = cookieStore.get("locale")?.value;

        return NextResponse.json({
            locale: locale && isValidLocale(locale) ? locale : null,
        });
    } catch (error) {
        console.error("Error getting locale:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
