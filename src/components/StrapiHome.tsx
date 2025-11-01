/**
 * Example component showing how to integrate Strapi home content
 * This demonstrates how to use the Strapi API with fallback to static content
 */

import React from "react";
import { getHomeContentSafe } from "@/api/home";
import { home as staticHome } from "@/resources";
import { markdownToHtml } from "@/utils/markdown";

interface StrapiHomePageProps {
    strapiContent?: {
        headline: string;
        hasFeatured: boolean;
        featured: string;
        subline: string;
    } | null;
}

/**
 * Example usage in a page component (e.g., src/app/page.tsx)
 *
 * This shows how to fetch Strapi content on the server side
 * and fall back to static content if Strapi is unavailable
 */
export async function getHomePageProps() {
    // Fetch content from Strapi
    const strapiContent = await getHomeContentSafe();

    return {
        strapiContent,
    };
}

/**
 * React component that uses either Strapi content or static fallback
 */
export function StrapiHomePage({ strapiContent }: StrapiHomePageProps) {
    // Use Strapi content if available, otherwise fall back to static content
    const content = strapiContent
        ? {
              headline: strapiContent.headline,
              featured: {
                  display: strapiContent.hasFeatured,
                  title: strapiContent.featured,
                  href: staticHome.featured.href,
              },
              subline: markdownToHtml(strapiContent.subline),
          }
        : {
              headline: staticHome.headline,
              featured: staticHome.featured,
              subline: staticHome.subline,
          };

    return (
        <div>
            {content.featured.display && (
                <div className="featured-badge">{content.featured.title}</div>
            )}
            <h1>{content.headline}</h1>
            <p>{content.subline}</p>

            {/* Debug info - remove in production */}
            <div
                style={{
                    marginTop: "2rem",
                    padding: "1rem",
                    backgroundColor: "#f5f5f5",
                    fontSize: "0.8rem",
                }}
            >
                <strong>Content Source:</strong>{" "}
                {strapiContent ? "Strapi CMS" : "Static Content"}
            </div>
        </div>
    );
}

/**
 * Alternative usage with React Server Components
 * This can be used directly in your page.tsx file
 */
export async function StrapiHomeContent() {
    const strapiContent = await getHomeContentSafe();

    if (strapiContent) {
        return (
            <>
                <h1>{strapiContent.headline}</h1>
                {strapiContent.hasFeatured && (
                    <div className="featured">{strapiContent.featured}</div>
                )}
                <div>
                    {typeof strapiContent.subLine === "string"
                        ? strapiContent.subLine
                        : markdownToHtml(strapiContent.subLine)}
                </div>
            </>
        );
    }

    // Fallback to static content
    return (
        <>
            <h1>
                {typeof staticHome.headline === "string"
                    ? staticHome.headline
                    : "Welcome"}
            </h1>
            {staticHome.featured.display && (
                <div className="featured">{staticHome.featured.title}</div>
            )}
            <div>{staticHome.subline}</div>
        </>
    );
}
