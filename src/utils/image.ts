/**
 * Image utility functions for Strapi CMS integration
 * These utilities handle image URL generation and format selection
 * Safe for both server and client-side usage (no Node.js dependencies)
 */

/**
 * Strapi image format structure
 * Represents a specific size variant of an image
 */
export interface StrapiImageFormat {
    /** File extension of the image (e.g., '.jpg', '.png') */
    ext: string;
    /** Relative URL path to the image file */
    url: string;
    /** Unique hash identifier for the image file */
    hash: string;
    /** MIME type of the image (e.g., 'image/jpeg', 'image/png') */
    mime: string;
    /** Display name of the image file */
    name: string;
    /** File system path to the image (null for uploaded files) */
    path: string | null;
    /** File size in kilobytes */
    size: number;
    /** Image width in pixels */
    width: number;
    /** Image height in pixels */
    height: number;
    /** File size in bytes */
    sizeInBytes: number;
}

/**
 * Strapi image structure
 * Complete image object with all metadata and format variants
 */
export interface StrapiImage {
    /** Unique identifier for the image in Strapi */
    id: number;
    /** Document ID used by Strapi for content management */
    documentId: string;
    /** Original filename of the uploaded image */
    name: string;
    /** Alternative text for accessibility and SEO */
    alternativeText: string | null;
    /** Caption or description for the image */
    caption: string | null;
    /** Original image width in pixels */
    width: number;
    /** Original image height in pixels */
    height: number;
    /** Different sized variants of the image for responsive design */
    formats?: {
        /** Large format variant (typically 1000px width) */
        large?: StrapiImageFormat;
        /** Medium format variant (typically 750px width) */
        medium?: StrapiImageFormat;
        /** Small format variant (typically 500px width) */
        small?: StrapiImageFormat;
        /** Thumbnail format variant (typically 245px width) */
        thumbnail?: StrapiImageFormat;
    };
    /** Unique hash identifier for the image file */
    hash: string;
    /** File extension (e.g., '.jpg', '.png') */
    ext: string;
    /** MIME type of the image */
    mime: string;
    /** File size in kilobytes */
    size: number;
    /** Relative URL path to the original image */
    url: string;
    /** URL for image preview (null if not available) */
    previewUrl: string | null;
    /** Storage provider (e.g., 'local', 'aws-s3') */
    provider: string;
    /** Additional metadata from the storage provider */
    provider_metadata: Record<string, unknown> | null;
    /** Timestamp when the image was created */
    createdAt: string;
    /** Timestamp when the image was last updated */
    updatedAt: string;
    /** Timestamp when the image was published */
    publishedAt: string;
}

/**
 * Helper function to create full URL for Strapi images
 * Handles environment variable hierarchy for image URL construction
 *
 * @param imagePath - The image path from Strapi (starts with /)
 * @returns Full URL to the image
 *
 * @example
 * ```typescript
 * getStrapiImageUrl('/uploads/image.jpg')
 * // Returns: 'https://your-strapi-url.com/uploads/image.jpg'
 * ```
 *
 * Environment variables priority:
 * 1. STRAPI_IMAGE_URL or NEXT_PUBLIC_STRAPI_IMAGE_URL (preferred for images)
 * 2. STRAPI_API_URL or NEXT_PUBLIC_STRAPI_API_URL (fallback)
 * 3. http://localhost:1337 (development fallback)
 */
export function getStrapiImageUrl(imagePath: string): string {
    // First check for image-specific URL
    const imageUrl =
        process.env.STRAPI_IMAGE_URL ||
        process.env.NEXT_PUBLIC_STRAPI_IMAGE_URL;

    if (imageUrl) {
        return `${imageUrl}${imagePath}`;
    }

    // Fallback to API URL
    const apiUrl =
        process.env.STRAPI_API_URL ||
        process.env.NEXT_PUBLIC_STRAPI_API_URL ||
        "http://localhost:1337";
    return `${apiUrl}${imagePath}`;
}

/**
 * Gets the best image URL from Strapi image object based on preferred size
 * Provides intelligent fallback to other available sizes if preferred size is not available
 *
 * @param image - Strapi image object containing format variants
 * @param preferredSize - Preferred image size (defaults to 'large')
 * @returns Full URL to the best available image format
 *
 * @example
 * ```typescript
 * // Get large format, fallback to smaller if not available
 * getBestImageUrl(strapiImage, 'large')
 *
 * // Get thumbnail for previews
 * getBestImageUrl(strapiImage, 'thumbnail')
 * ```
 */
export function getBestImageUrl(
    image: StrapiImage,
    preferredSize: "thumbnail" | "small" | "medium" | "large" = "large"
): string {
    // Try to get the preferred size first
    const preferredFormat = image.formats?.[preferredSize];
    if (preferredFormat) {
        return getStrapiImageUrl(preferredFormat.url);
    }

    // Fallback to other sizes in order of quality
    const fallbackOrder = ["large", "medium", "small", "thumbnail"] as const;

    for (const size of fallbackOrder) {
        const format = image.formats?.[size];
        if (format) {
            return getStrapiImageUrl(format.url);
        }
    }

    // Final fallback to the original image
    return getStrapiImageUrl(image.url);
}
