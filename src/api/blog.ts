import { cache } from "react";
import type { StrapiImage, StrapiImageFormat } from "@/utils/image";
import { getBestImageUrl, getStrapiImageUrl } from "@/utils/image";

/**
 * Represents an author/team member of a blog post
 */
interface BlogAuthor {
    /** Full name of the author */
    name: string;
    /** Professional role or title */
    role: string;
    /** URL/path to author's avatar image */
    avatar: string;
    /** LinkedIn profile URL */
    linkedIn: string;
}

/**
 * Core metadata for a blog post
 */
interface BlogPostMetadata {
    /** Title of the blog post */
    title: string;
    /** Brief excerpt or summary */
    excerpt: string;
    /** Publication date in ISO format */
    publishedAt: string;
    /** Brief summary or excerpt */
    summary: string;
    /** Featured image URL/path */
    image?: string;
    /** Array of additional images */
    images: string[];
    /** Category or tag for the post */
    tag?: string;
    /** List of authors/contributors */
    team: BlogAuthor[];
    /** External link if applicable */
    link?: string;
    /** Reading time in minutes */
    readingTime?: number;
}

/**
 * Complete blog post structure from Strapi
 */
interface BlogPost {
    /** Unique identifier */
    id: number;
    /** URL-friendly identifier */
    slug: string;
    /** Post metadata */
    metadata: BlogPostMetadata;
    /** Full markdown content */
    content: string;
    /** Brief excerpt or summary */
    excerpt: string;
    /** Creation timestamp */
    createdAt: string;
    /** Last update timestamp */
    updatedAt: string;
    /** Publication status */
    publishedAt: string;
}

/**
 * Strapi API response wrapper
 * Generic interface for all Strapi API responses
 */
interface StrapiResponse<T> {
    /** Main response data containing the requested content */
    data: T;
    /** Additional response metadata including pagination info */
    meta?: {
        /** Pagination information for paginated responses */
        pagination?: {
            /** Current page number (1-based) */
            page: number;
            /** Number of items per page */
            pageSize: number;
            /** Total number of pages available */
            pageCount: number;
            /** Total number of items across all pages */
            total: number;
        };
    };
}

/**
 * Strapi blog post item structure (matches actual API response)
 * Raw data structure returned by Strapi CMS for blog posts
 */
interface StrapiBlogPostItem {
    /** Unique identifier for the blog post in Strapi */
    id: number;
    /** Document ID used by Strapi for content management */
    documentId: string;
    /** Main title of the blog post */
    title: string;
    /** URL-friendly slug for the blog post */
    slug: string;
    /** Brief excerpt or summary of the blog post */
    excerpt: string;
    /** Full content of the blog post in markdown format */
    content: string;
    /** Estimated reading time in minutes */
    readingTime: number;
    /** Timestamp when the blog post was published */
    publishedAt: string;
    /** Timestamp when the blog post was created */
    createdAt: string;
    /** Timestamp when the blog post was last updated */
    updatedAt: string;
    /** Portrait-oriented cover image (for featured display) */
    portraitCoverImage: StrapiImage | null;
    /** Landscape-oriented cover image (for additional imagery) */
    landscapeCoverImage: StrapiImage | null;
    /** Array of tags associated with the blog post */
    tags: Record<string, unknown>[];
    /** Array of technologies mentioned in the blog post */
    technologies: Record<string, unknown>[];
    /** Author information for the blog post */
    author: Record<string, unknown> | null;
    /** SEO metadata for the blog post */
    seo: Record<string, unknown> | null;
}

/**
 * Fetches all blog posts from Strapi CMS
 * @returns Promise resolving to array of blog posts
 * @throws Error if API request fails
 */
async function fetchBlogPostsFromStrapi(): Promise<BlogPost[]> {
    try {
        const apiUrl =
            process.env.STRAPI_API_URL ||
            process.env.NEXT_PUBLIC_STRAPI_API_URL;
        const locale = "en";

        if (!apiUrl) {
            throw new Error(
                "Missing STRAPI_API_URL or NEXT_PUBLIC_STRAPI_API_URL environment variable"
            );
        }
        const response = await fetch(
            `${apiUrl}/api/posts?populate=*&locale=${locale}`,
            {
                headers: {
                    "Content-Type": "application/json",
                },
                next: { revalidate: 60 }, // Revalidate every minute
            }
        );

        if (!response.ok) {
            throw new Error(
                `Failed to fetch blog posts: ${response.status} ${response.statusText}`
            );
        }

        const result: StrapiResponse<StrapiBlogPostItem[]> =
            await response.json();

        return result.data.map(
            (item: StrapiBlogPostItem): BlogPost => ({
                id: item.id,
                slug: item.slug,
                metadata: {
                    title: item.title,
                    excerpt: item.excerpt,
                    publishedAt: item.publishedAt,
                    summary: item.excerpt,
                    image: item.portraitCoverImage
                        ? getBestImageUrl(item.portraitCoverImage, "large")
                        : undefined,
                    images: item.landscapeCoverImage
                        ? [getBestImageUrl(item.landscapeCoverImage, "large")]
                        : [],
                    tag:
                        item.tags && item.tags.length > 0
                            ? String(item.tags[0])
                            : undefined,
                    team: [], // No team data in current structure
                    link: undefined,
                    readingTime: item.readingTime,
                },
                excerpt: item.excerpt,
                content: item.content || "",
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
                publishedAt: item.publishedAt,
            })
        );
    } catch (error) {
        console.error("Error fetching blog posts from Strapi:", error);
        throw error;
    }
}

/**
 * Cached function to get all blog posts
 * Uses React's cache to prevent duplicate API calls during SSR
 */
export const getBlogPosts = cache(fetchBlogPostsFromStrapi);

/**
 * Fetches a single blog post by slug from Strapi CMS
 * @param slug - URL-friendly identifier for the post
 * @returns Promise resolving to blog post or null if not found
 */
async function fetchBlogPostBySlugFromStrapi(
    slug: string
): Promise<BlogPost | null> {
    try {
        const apiUrl =
            process.env.STRAPI_API_URL ||
            process.env.NEXT_PUBLIC_STRAPI_API_URL;
        const locale = "en"; // Default locale

        if (!apiUrl) {
            throw new Error(
                "Missing STRAPI_API_URL or NEXT_PUBLIC_STRAPI_API_URL environment variable"
            );
        }
        const response = await fetch(
            `${apiUrl}/api/posts?filters[Slug][$eq]=${slug}&populate=*&locale=${locale}`,
            {
                headers: {
                    "Content-Type": "application/json",
                },
                next: { revalidate: 60 },
            }
        );

        if (!response.ok) {
            throw new Error(
                `Failed to fetch blog post: ${response.status} ${response.statusText}`
            );
        }

        const result: StrapiResponse<StrapiBlogPostItem[]> =
            await response.json();

        if (result.data.length === 0) {
            return null;
        }

        const item = result.data[0];
        return {
            id: item.id,
            slug: item.slug,
            metadata: {
                title: item.title,
                publishedAt: item.publishedAt,
                summary: item.excerpt,
                image: item.portraitCoverImage
                    ? getBestImageUrl(item.portraitCoverImage, "large")
                    : undefined,
                images: item.landscapeCoverImage
                    ? [getBestImageUrl(item.landscapeCoverImage, "large")]
                    : [],
                tag:
                    item.tags && item.tags.length > 0
                        ? String(item.tags[0])
                        : undefined,
                team: [], // No team data in current structure
                link: undefined,
                readingTime: item.readingTime,
                excerpt: item.excerpt,
            },
            content: item.content || "",
            excerpt: item.excerpt,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            publishedAt: item.publishedAt,
        };
    } catch (error) {
        console.error("Error fetching blog post by slug from Strapi:", error);
        throw error;
    }
}

/**
 * Cached function to get a blog post by slug
 * Uses React's cache to prevent duplicate API calls during SSR
 */
export const getBlogPostBySlug = cache(fetchBlogPostBySlugFromStrapi);

/**
 * Export types for use in other components
 */
export type { BlogPost, BlogPostMetadata, BlogAuthor };
