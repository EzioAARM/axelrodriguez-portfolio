/**
 * Utility functions for the Axel Rodriguez Portfolio application.
 * This file contains helper functions for common operations across the application.
 *
 * Note: This file previously contained MDX file reading utilities, but those have been
 * removed in favor of Strapi API integration for content management.
 */

/**
 * Represents a team member associated with a project or post.
 */
export type Team = {
    /** The full name of the team member */
    name: string;
    /** The role or position of the team member in the project */
    role: string;
    /** URL or path to the team member's avatar image */
    avatar: string;
    /** LinkedIn profile URL for the team member */
    linkedIn: string;
};

/**
 * Legacy metadata structure for MDX-based content.
 * This type is kept for backward compatibility but is no longer actively used
 * since content is now managed through Strapi CMS.
 *
 * @deprecated Use Strapi API types instead for new implementations
 */
export type Metadata = {
    /** The title of the content piece */
    title: string;
    /** The publication date in ISO string format */
    publishedAt: string;
    /** A brief summary or description of the content */
    summary: string;
    /** Optional featured image URL or path */
    image?: string;
    /** Array of image URLs or paths associated with the content */
    images: string[];
    /** Optional tag or category for content classification */
    tag?: string;
    /** Array of team members associated with the content */
    team: Team[];
    /** Optional external link related to the content */
    link?: string;
};

// Legacy MDX support for work projects only
// Note: This is maintained for backward compatibility with existing work projects
// Blog posts now use Strapi API instead of local MDX files

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { notFound } from "next/navigation";

/**
 * Gets MDX files from a directory (legacy support for work projects)
 * @param dir - Directory path containing MDX files
 * @returns Array of MDX filenames
 * @deprecated This function is maintained only for work projects compatibility
 */
function getMDXFiles(dir: string) {
    if (!fs.existsSync(dir)) {
        notFound();
    }
    return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
}

/**
 * Reads and parses a single MDX file (legacy support for work projects)
 * @param filePath - Full path to the MDX file
 * @returns Object containing metadata and content
 * @deprecated This function is maintained only for work projects compatibility
 */
function readMDXFile(filePath: string) {
    if (!fs.existsSync(filePath)) {
        notFound();
    }

    const rawContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(rawContent);

    const metadata: Metadata = {
        title: data.title || "",
        publishedAt: data.publishedAt,
        summary: data.summary || "",
        image: data.image || "",
        images: data.images || [],
        tag: data.tag || [],
        team: data.team || [],
        link: data.link || "",
    };

    return { metadata, content };
}

/**
 * Gets all MDX data from a directory (legacy support for work projects)
 * @param dir - Directory path containing MDX files
 * @returns Array of objects with metadata, slug, and content
 * @deprecated This function is maintained only for work projects compatibility
 */
function getMDXData(dir: string) {
    const mdxFiles = getMDXFiles(dir);
    return mdxFiles.map((file) => {
        const { metadata, content } = readMDXFile(path.join(dir, file));
        const slug = path.basename(file, path.extname(file));

        return {
            metadata,
            slug,
            content,
        };
    });
}

/**
 * Gets posts from local MDX files (legacy support for work projects only)
 * @param customPath - Path segments to the directory containing MDX files
 * @returns Array of post objects with metadata, slug, and content
 * @deprecated This function is maintained only for work projects compatibility
 * For blog posts, use getBlogPosts from @/api/blog instead
 */
export function getPosts(customPath = ["", "", "", ""]) {
    const postsDir = path.join(process.cwd(), ...customPath);
    return getMDXData(postsDir);
}
