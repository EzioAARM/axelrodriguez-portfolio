/**
 * Strapi API functions for fetching home content
 */

export interface StrapiHomeResponse {
    data: {
        id: number;
        Headline: string;
        HasFeatured: boolean;
        Featured: string;
        SubLine: string;
        CreatedAt: string;
        updatedAt: string;
        publishedAt: string;
    };
    meta: Record<string, unknown>;
}

export interface HomeContent {
    Headline: string;
    HasFeatured: boolean;
    Featured: string;
    SubLine: string;
}

/**
 * Fetches home content from Strapi CMS
 * @returns Promise<HomeContent> - The home content data
 * @throws Error if the API request fails or environment variables are missing
 */
export async function getHomeContent(): Promise<HomeContent> {
    const apiUrl =
        process.env.STRAPI_API_URL || process.env.NEXT_PUBLIC_STRAPI_API_URL;

    if (!apiUrl) {
        throw new Error(
            "Missing STRAPI_API_URL or NEXT_PUBLIC_STRAPI_API_URL environment variable"
        );
    }

    try {
        const response = await fetch(`${apiUrl}/api/home`, {
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

        const { Headline, HasFeatured, Featured, SubLine } = data.data;

        return {
            Headline,
            HasFeatured,
            Featured,
            SubLine,
        };
    } catch (error) {
        console.error("Error fetching home content from Strapi:", error);
        throw error;
    }
}

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
