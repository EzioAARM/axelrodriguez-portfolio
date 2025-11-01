/**
 * Strapi API functions for fetching about content
 */
import { cache } from "react";
import type { StrapiImage } from "@/utils/image";
import { getBestImageUrl, getStrapiImageUrl } from "@/utils/image";

/**
 * Language structure
 * Represents a spoken language with proficiency information
 */
export interface Language {
    /** Unique identifier for the language entry */
    id: number;
    /** Display name of the language (e.g., "English", "Spanish") */
    name: string;
    /** Proficiency level (e.g., "native", "fluent", "intermediate") */
    level: string;
}

/**
 * Social link structure
 * Represents a social media profile or external link
 */
export interface SocialLink {
    /** Unique identifier for the social link entry */
    id: number;
    /** Platform name (e.g., "LinkedIn", "GitHub", "Twitter") */
    platform: string;
    /** Full URL to the social profile or website */
    url: string | null;
    /** Icon type (e.g., "icon" for built-in icons, "custom" for user-uploaded icons) */
    useIcon: boolean;
    /** Icon identifier or name for displaying the platform icon */
    cssClass: string | null;
    /** Icon URL for displaying the platform icon */
    icon: string | null;
}

/**
 * Skill structure
 * Represents a technical or professional skill with proficiency level
 */
export interface Skill {
    /** Unique identifier for the skill entry */
    id: number;
    /** Display name of the skill (e.g., "AWS", "React", "Node.js") */
    name: string;
    /** Proficiency level (e.g., "beginner", "intermediate", "advanced", "expert") */
    level: "beginner" | "intermediate" | "advanced" | "expert";
    /** Icon identifier for displaying the skill icon (can be null) */
    icon: string | null;
    /** Skill group or category (e.g., "Frontend", "Backend", "DevOps", "Hard", "Soft") */
    group: string;
}

/**
 * Work experience structure
 * Represents a professional work experience or employment history entry
 */
export interface WorkExperience {
    /** Unique identifier for the work experience entry */
    id: number;
    /** Company or organization name */
    company: string;
    /** Employment duration (e.g., "January 2020 - Present", "2019-2021") */
    timeframe: string;
    /** Job title or position held */
    role: string;
    /** Key accomplishments and responsibilities in this role */
    description: string;
}

/**
 * Studies structure
 * Represents an educational background entry (degree, certification, course)
 */
export interface Study {
    /** Unique identifier for the study entry */
    id: number;
    /** Institution name (e.g., "Universidad Rafael Landívar", "Coursera") */
    name: string;
    /** Degree, certification, or course title */
    title: string;
    /** Study period (e.g., "2015 - 2022", "March 2023") */
    timeframe: string;
    /** Additional details about the program or achievements */
    description: string;
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
        jobTitle: string;
        /** Personal biography in markdown or rich text format */
        biography: string;
        /** Introduction section title */
        introductionSectionTitle: string;
        /** Experience section title */
        experienceSectionTitle: string;
        /** Education section title */
        educationSectionTitle: string;
        /** Technical skills section title */
        technicalSkillsSectionTitle: string;
        /** Profile image with all format variants */
        profileImage: StrapiImage;
        /** Array of spoken languages */
        languages: Language[];
        /** Array of social media links and profiles */
        socialLinks: SocialLink[];
        /** Array of technical and professional skills */
        skills: Skill[];
        /** Array of work experience entries */
        workExperience: WorkExperience[];
        /** Array of educational background entries */
        studies: Study[];
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
    jobTitle: string;
    /** Personal biography in markdown or rich text format */
    biography: string;
    /** Profile image with all format variants and metadata */
    profileImage: StrapiImage;
    /** Array of spoken languages with proficiency information */
    languages: Language[];
    /** Array of social media links and external profiles */
    socialLinks: SocialLink[];
    /** Array of technical and professional skills with levels */
    skills: Skill[];
    /** Array of professional work experience entries */
    workExperience: WorkExperience[];
    /** Array of educational background and certifications */
    studies: Study[];
    /** SEO metadata for search engine optimization */
    seo: SEO;
    /** Introduction section title */
    introductionSectionTitle: string;
    /** Experience section title */
    experienceSectionTitle: string;
    /** Education section title */
    educationSectionTitle: string;
    /** Technical skills section title */
    technicalSkillsSectionTitle: string;
}

/**
 * Fetches about content from Strapi CMS with caching
 * @returns Promise<AboutContent> - The about content data
 * @throws Error if the API request fails or environment variables are missing
 */
export const getAboutContent = cache(async (): Promise<AboutContent> => {
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
            `${apiUrl}/api/about?populate=*&locale=${locale}`,
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

        const data: StrapiAboutResponse = await response.json();

        const {
            jobTitle,
            biography,
            profileImage,
            languages,
            socialLinks,
            skills,
            workExperience,
            studies,
            seo,
            introductionSectionTitle,
            experienceSectionTitle,
            educationSectionTitle,
            technicalSkillsSectionTitle,
        } = data.data;

        return {
            jobTitle,
            biography,
            profileImage,
            languages,
            socialLinks,
            skills,
            workExperience,
            studies,
            seo,
            introductionSectionTitle,
            experienceSectionTitle,
            educationSectionTitle,
            technicalSkillsSectionTitle,
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
