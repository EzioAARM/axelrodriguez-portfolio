/**
 * Strapi API functions for fetching home content
 */
import { cache } from "react";

/**
 * Details from each image format provided by Strapi CMS
 */
export interface ImageFormat {
    ext: string;
    url: string;
    hash: string;
    mime: string;
    name: string;
    path: string | null;
    size: number;
    width: number;
    height: number;
    sizeInBytes: number;
}

/**
 * Image details structure from Strapi CMS
 */
export interface ImageFormats {
    id: number;
    name: string;
    alternativeText: string;
    caption: string;
    width: number;
    height: number;
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl: string | null;
    provider: string;
    provider_metadata: Record<string, unknown> | null;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    large?: ImageFormat;
    small?: ImageFormat;
    medium?: ImageFormat;
    thumbnail?: ImageFormat;
}

/**
 * Strapi API response structure for home content
 * Contains all the fields returned by the Strapi API for the home content
 */
export interface StrapiHomeResponse {
    data: {
        id: number;
        documentId: string;
        Headline: string;
        HasFeatured: boolean;
        Featured: string;
        SubLine: string;
        HasCarousel: boolean;
        createdAt: string;
        updatedAt: string;
        publishedAt: string;
        locale: string;
        HasNewsletter: boolean;
        NewsletterTitle: string;
        NewsletterDescription: string;
        DisplayMostRecentPosts: boolean;
        SubscribeButtonText: string;
        Carousel: ImageFormats[];
        localizations: Record<string, unknown>[];
    };
    meta: Record<string, unknown>;
}

export interface HomeContent {
    Headline: string;
    HasFeatured: boolean;
    Featured: string;
    SubLine: string;
    HasCarousel: boolean;
    Carousel: ImageFormats[];
    HasNewsletter?: boolean;
    NewsletterTitle?: string;
    NewsletterDescription?: string;
}

/**
 * Fetches home content from Strapi CMS
 * @returns Promise<HomeContent> - The home content data
 * @throws Error if the API request fails or environment variables are missing
 */
export const getHomeContent = async (): Promise<HomeContent> => {
    const apiUrl =
        process.env.STRAPI_API_URL || process.env.NEXT_PUBLIC_STRAPI_API_URL;

    if (!apiUrl) {
        throw new Error(
            "Missing STRAPI_API_URL or NEXT_PUBLIC_STRAPI_API_URL environment variable"
        );
    }

    try {
        const response = await fetch(`${apiUrl}/api/home?populate=all`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(
                `Strapi API request failed: ${response.status} ${response.statusText}`
            );
        }

        const data: StrapiHomeResponse = await response.json();

        const {
            Headline,
            HasFeatured,
            Featured,
            SubLine,
            HasCarousel,
            Carousel,
            HasNewsletter,
            NewsletterTitle,
            NewsletterDescription,
        } = data.data;

        return {
            Headline,
            HasFeatured,
            Featured,
            SubLine,
            HasCarousel,
            Carousel,
            HasNewsletter: HasNewsletter,
            NewsletterTitle: NewsletterTitle,
            NewsletterDescription: NewsletterDescription,
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
