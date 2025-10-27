/**
 * Strapi API functions for fetching about content
 */
import { cache } from "react";

/**
 * Image format details from Strapi CMS
 * Represents different image format variants (thumbnail, small, medium, large)
 */
export interface ImageFormat {
    /** File extension (e.g., ".jpg", ".png") */
    ext: string;
    /** Relative URL path to the image */
    url: string;
    /** Unique hash identifier for the image */
    hash: string;
    /** MIME type of the image (e.g., "image/jpeg") */
    mime: string;
    /** Display name of the image file */
    name: string;
    /** File system path (usually null for Strapi uploads) */
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
 * Image formats structure from Strapi CMS
 * Contains different sized variants of the same image for responsive design
 */
export interface ImageFormats {
    /** Large format variant (typically 1000px width) */
    large?: ImageFormat;
    /** Small format variant (typically 500px width) */
    small?: ImageFormat;
    /** Medium format variant (typically 750px width) */
    medium?: ImageFormat;
    /** Thumbnail format variant (typically 156px height) */
    thumbnail?: ImageFormat;
}

/**
 * Strapi image structure
 * Complete image object returned by Strapi CMS with all metadata and format variants
 */
export interface StrapiImage {
    /** Unique numeric identifier for the image */
    id: number;
    /** Strapi document identifier (UUID-like string) */
    documentId: string;
    /** Original filename of the uploaded image */
    name: string;
    /** Alternative text for accessibility (can be null) */
    alternativeText: string | null;
    /** Optional caption for the image */
    caption: string | null;
    /** Original image width in pixels */
    width: number;
    /** Original image height in pixels */
    height: number;
    /** Available image format variants (thumbnail, small, medium, large) */
    formats: ImageFormats;
    /** Unique hash identifier for the image file */
    hash: string;
    /** File extension (e.g., ".JPEG", ".PNG") */
    ext: string;
    /** MIME type of the image */
    mime: string;
    /** File size in kilobytes */
    size: number;
    /** Direct URL to the original image */
    url: string;
    /** Preview URL (usually null for regular uploads) */
    previewUrl: string | null;
    /** Storage provider (e.g., "local", "aws-s3") */
    provider: string;
    /** Additional provider-specific metadata */
    provider_metadata: Record<string, unknown> | null;
    /** ISO timestamp when the image was created */
    createdAt: string;
    /** ISO timestamp when the image was last updated */
    updatedAt: string;
    /** ISO timestamp when the image was published */
    publishedAt: string;
}

/**
 * Language structure
 * Represents a spoken language with proficiency information
 */
export interface Language {
    /** Unique identifier for the language entry */
    id: number;
    /** Display name of the language (e.g., "English", "Spanish") */
    Name: string;
    /** Proficiency level (e.g., "native", "fluent", "intermediate") */
    Level: string;
}

/**
 * Social link structure
 * Represents a social media profile or external link
 */
export interface SocialLink {
    /** Unique identifier for the social link entry */
    id: number;
    /** Platform name (e.g., "LinkedIn", "GitHub", "Twitter") */
    Platform: string;
    /** Full URL to the social profile or website */
    Url: string | null;
    /** Icon type (e.g., "icon" for built-in icons, "custom" for user-uploaded icons) */
    UseIcon: boolean;
    /** Icon identifier or name for displaying the platform icon */
    CssClass: string | null;
    /** Icon URL for displaying the platform icon */
    Icon: string | null;
}

/**
 * Skill structure
 * Represents a technical or professional skill with proficiency level
 */
export interface Skill {
    /** Unique identifier for the skill entry */
    id: number;
    /** Display name of the skill (e.g., "AWS", "React", "Node.js") */
    Name: string;
    /** Proficiency level (e.g., "beginner", "intermediate", "advanced", "expert") */
    Level: "beginner" | "intermediate" | "advanced" | "expert";
    /** Icon identifier for displaying the skill icon (can be null) */
    Icon: string | null;
    /** Skill group or category (e.g., "Frontend", "Backend", "DevOps", "Hard", "Soft") */
    Group: string;
}

/**
 * Work experience structure
 * Represents a professional work experience or employment history entry
 */
export interface WorkExperience {
    /** Unique identifier for the work experience entry */
    id: number;
    /** Company or organization name */
    Company: string;
    /** Employment duration (e.g., "January 2020 - Present", "2019-2021") */
    Timeframe: string;
    /** Job title or position held */
    Role: string;
    /** Key accomplishments and responsibilities in this role */
    Description: string;
}

/**
 * Studies structure
 * Represents an educational background entry (degree, certification, course)
 */
export interface Study {
    /** Unique identifier for the study entry */
    id: number;
    /** Institution name (e.g., "Universidad Rafael Landívar", "Coursera") */
    Name: string;
    /** Degree, certification, or course title */
    Title: string;
    /** Study period (e.g., "2015 - 2022", "March 2023") */
    Timeframe: string;
    /** Additional details about the program or achievements */
    Description: string;
}

/**
 * SEO structure
 * Contains search engine optimization metadata for the about page
 */
export interface SEO {
    /** Unique identifier for the SEO entry */
    id: number;
    /** Page title for search engines and browser tabs */
    metaTitle: string;
    /** Meta description for search engine results */
    metaDescription: string;
    /** Canonical URL to prevent duplicate content issues (can be null) */
    canonicalURL: string | null;
    /** Robot directives for search engines (e.g., "index, follow") */
    metaRobots: string;
    /** Comma-separated keywords for SEO */
    keywords: string;
}

/**
 * Strapi API response structure for about content
 * Complete response structure returned by the Strapi CMS API endpoint
 */
export interface StrapiAboutResponse {
    /** Main content data from Strapi */
    data: {
        /** Unique numeric identifier for the about entry */
        id: number;
        /** Strapi document identifier (UUID-like string) */
        documentId: string;
        /** ISO timestamp when the entry was created */
        createdAt: string;
        /** ISO timestamp when the entry was last updated */
        updatedAt: string;
        /** ISO timestamp when the entry was published */
        publishedAt: string;
        /** Current job title or professional role */
        JobTitle: string;
        /** Personal biography in markdown or rich text format */
        Biography: string;
        /** Introduction section title */
        IntroductionSectionTitle: string;
        /** Experience section title */
        ExperienceSectionTitle: string;
        /** Education section title */
        EducationSectionTitle: string;
        /** Technical skills section title */
        TechnicalSkillsSectionTitle: string;
        /** Profile image with all format variants */
        ProfileImage: StrapiImage;
        /** Array of spoken languages */
        Languages: Language[];
        /** Array of social media links and profiles */
        SocialLinks: SocialLink[];
        /** Array of technical and professional skills */
        Skills: Skill[];
        /** Array of work experience entries */
        WorkExperience: WorkExperience[];
        /** Array of educational background entries */
        Studies: Study[];
        /** SEO metadata for the about page */
        seo: SEO;
    };
    /** Additional metadata from Strapi (pagination, etc.) */
    meta: Record<string, unknown>;
}

/**
 * Processed about content for the application
 * Simplified structure extracted from Strapi response for use in the application
 */
export interface AboutContent {
    /** Current job title or professional role */
    JobTitle: string;
    /** Personal biography in markdown or rich text format */
    Biography: string;
    /** Profile image with all format variants and metadata */
    ProfileImage: StrapiImage;
    /** Array of spoken languages with proficiency information */
    Languages: Language[];
    /** Array of social media links and external profiles */
    SocialLinks: SocialLink[];
    /** Array of technical and professional skills with levels */
    Skills: Skill[];
    /** Array of professional work experience entries */
    WorkExperience: WorkExperience[];
    /** Array of educational background and certifications */
    Studies: Study[];
    /** SEO metadata for search engine optimization */
    seo: SEO;
    /** Introduction section title */
    IntroductionSectionTitle: string;
    /** Experience section title */
    ExperienceSectionTitle: string;
    /** Education section title */
    EducationSectionTitle: string;
    /** Technical skills section title */
    TechnicalSkillsSectionTitle: string;
}

/**
 * Fetches about content from Strapi CMS with caching
 * @returns Promise<AboutContent> - The about content data
 * @throws Error if the API request fails or environment variables are missing
 */
export const getAboutContent = cache(async (): Promise<AboutContent> => {
    const apiUrl =
        process.env.STRAPI_API_URL || process.env.NEXT_PUBLIC_STRAPI_API_URL;

    if (!apiUrl) {
        throw new Error(
            "Missing STRAPI_API_URL or NEXT_PUBLIC_STRAPI_API_URL environment variable"
        );
    }

    try {
        const response = await fetch(`${apiUrl}/api/about?populate=*`, {
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

        const data: StrapiAboutResponse = await response.json();

        const {
            JobTitle,
            Biography,
            ProfileImage,
            Languages,
            SocialLinks,
            Skills,
            WorkExperience,
            Studies,
            seo,
            IntroductionSectionTitle,
            ExperienceSectionTitle,
            EducationSectionTitle,
            TechnicalSkillsSectionTitle,
        } = data.data;

        return {
            JobTitle,
            Biography,
            ProfileImage,
            Languages,
            SocialLinks,
            Skills,
            WorkExperience,
            Studies,
            seo,
            IntroductionSectionTitle,
            ExperienceSectionTitle,
            EducationSectionTitle,
            TechnicalSkillsSectionTitle,
        };
    } catch (error) {
        console.error("Error fetching about content from Strapi:", error);
        throw error;
    }
});

/**
 * Fetches about content with error handling and fallback
 * @returns Promise<AboutContent | null> - The about content data or null if failed
 */
export async function getAboutContentSafe(): Promise<AboutContent | null> {
    try {
        return await getAboutContent();
    } catch (error) {
        console.error("Failed to fetch about content:", error);
        return null;
    }
}
