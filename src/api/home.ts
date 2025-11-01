/**
 * Strapi API functions for fetching home content
 */
import { cache } from "react";
import type { StrapiImage } from "@/utils/image";
import { getBestImageUrl, getStrapiImageUrl } from "@/utils/image";

/**
 * Strapi API response structure for home content
 * Contains all the fields returned by the Strapi API for the home content
 */
export interface StrapiHomeResponse {
    /** Main data object containing all home content fields */
    data: {
        /** Unique identifier for the home content entry */
        id: number;
        /** Document ID used by Strapi for content management */
        documentId: string;
        /** Main headline text displayed on the home page */
        headline: string;
        /** Flag indicating if featured content should be displayed */
        hasFeatured: boolean;
        /** Featured content text or description */
        featured: string;
        /** Subtitle or secondary text below the headline */
        subLine: string;
        /** Flag indicating if image carousel should be displayed */
        hasCarousel: boolean;
        /** Timestamp when the content was created */
        createdAt: string;
        /** Timestamp when the content was last updated */
        updatedAt: string;
        /** Timestamp when the content was published */
        publishedAt: string;
        /** Locale/language code for the content (e.g., 'en', 'es') */
        locale: string;
        /** Flag indicating if newsletter section should be displayed */
        hasNewsletter: boolean;
        /** Title text for the newsletter signup section */
        newsletterTitle: string;
        /** Description text for the newsletter signup section */
        newsletterDescription: string;
        /** Flag indicating if recent blog posts should be displayed */
        displayMostRecentPosts: boolean;
        /** Text for the newsletter subscription button */
        subscribeButtonText: string;
        /** Array of images for the carousel display */
        carousel: StrapiImage[];
        /** Available localizations for different languages */
        localizations: Record<string, unknown>[];
    };
    /** Additional metadata from Strapi API response */
    meta: Record<string, unknown>;
}

/**
 * Processed home content structure for use in components
 * Contains the essential fields needed to render the home page
 */
export interface HomeContent {
    headline: string;
    /** Flag indicating whether to display the featured content section */
    hasFeatured: boolean;
    /** Featured content text, typically a brief description or tagline */
    featured: string;
    /** Subtitle or secondary text that appears below the main headline */
    subLine: string;
    /** Flag indicating whether to display the image carousel */
    hasCarousel: boolean;
    /** Array of images to display in the carousel component */
    carousel: StrapiImage[];
    /** Optional flag indicating whether to show the newsletter signup section */
    hasNewsletter?: boolean;
    /** Optional title text for the newsletter subscription area */
    newsletterTitle?: string;
    /** Optional description text explaining the newsletter benefits */
    newsletterDescription?: string;
}

/**
 * Fetches home content from Strapi CMS
 * @returns Promise<HomeContent> - The home content data
 * @throws Error if the API request fails or environment variables are missing
 */
export const getHomeContent = async (): Promise<HomeContent> => {
    const apiUrl =
        process.env.STRAPI_API_URL || process.env.NEXT_PUBLIC_STRAPI_API_URL;
    const locale = "en";

    if (!apiUrl) {
        throw new Error(
            "Missing STRAPI_API_URL or NEXT_PUBLIC_STRAPI_API_URL environment variable"
        );
    }

    try {
        const response = await fetch(
            `${apiUrl}/api/home?populate=all&locale=${locale}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            throw new Error(
                `Strapi API request failed: ${response.status} ${response.statusText}`
            );
        }

        const data: StrapiHomeResponse = await response.json();

        const {
            headline,
            hasFeatured,
            featured,
            subLine,
            hasCarousel,
            carousel,
            hasNewsletter,
            newsletterTitle,
            newsletterDescription,
        } = data.data;

        return {
            headline,
            hasFeatured,
            featured,
            subLine,
            hasCarousel,
            carousel,
            hasNewsletter,
            newsletterTitle,
            newsletterDescription,
        };
    } catch (error) {
        console.error("Error fetching home content from Strapi:", error);
        throw error;
    }
};

/**
 * Fetches home content with error handling and fallback
 * @returns Promise<HomeContent | null> - The home content data or null if failed
 */
export async function getHomeContentSafe(): Promise<HomeContent | null> {
    try {
        return await getHomeContent();
    } catch (error) {
        console.error("Failed to fetch home content:", error);
        return null;
    }
}
