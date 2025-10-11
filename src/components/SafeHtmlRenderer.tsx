/**
 * Safe HTML renderer component for processed markdown content
 */

import type React from "react";

interface SafeHtmlRendererProps {
    html: string;
    className?: string;
}

/**
 * Safely renders HTML content from processed markdown
 * This component is specifically designed for content that has been processed
 * through remark with proper sanitization
 */
export function SafeHtmlRenderer({ html, className }: SafeHtmlRendererProps) {
    return (
        <div className={className} dangerouslySetInnerHTML={{ __html: html }} />
    );
}

/**
 * Alternative approach using React elements for simple formatting
 * This avoids dangerouslySetInnerHTML but has limited formatting support
 */
export function SimpleHtmlRenderer({ html, className }: SafeHtmlRendererProps) {
    // Parse simple HTML tags and convert to React elements
    const parseSimpleHtml = (htmlString: string): React.ReactNode => {
        // This is a simple parser for basic HTML tags
        // For production, consider using a proper HTML parser library

        // Remove ALL <p> and </p> tags, not just wrapping ones
        let cleanHtml = htmlString.replace(/<\/?p>/g, "");

        // Also clean up any extra whitespace that might be left
        cleanHtml = cleanHtml.trim();

        // Split by HTML tags and process
        const parts = cleanHtml.split(/(<\/?(?:strong|em|code|u)>)/g);

        const elements: React.ReactNode[] = [];
        let currentFormatting: string[] = [];

        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];

            if (part === "<strong>") {
                currentFormatting.push("strong");
            } else if (part === "</strong>") {
                currentFormatting = currentFormatting.filter(
                    (f) => f !== "strong"
                );
            } else if (part === "<em>") {
                currentFormatting.push("em");
            } else if (part === "</em>") {
                currentFormatting = currentFormatting.filter((f) => f !== "em");
            } else if (part === "<code>") {
                currentFormatting.push("code");
            } else if (part === "</code>") {
                currentFormatting = currentFormatting.filter(
                    (f) => f !== "code"
                );
            } else if (part === "<u>") {
                currentFormatting.push("u");
            } else if (part === "</u>") {
                currentFormatting = currentFormatting.filter((f) => f !== "u");
            } else if (part && !part.startsWith("<")) {
                // This is text content
                let element: React.ReactNode = part;

                // Apply formatting in reverse order
                const formats = [...currentFormatting];
                for (const format of formats) {
                    switch (format) {
                        case "strong":
                            element = (
                                <strong key={`${i}-strong`}>{element}</strong>
                            );
                            break;
                        case "em":
                            element = <em key={`${i}-em`}>{element}</em>;
                            break;
                        case "code":
                            element = <code key={`${i}-code`}>{element}</code>;
                            break;
                        case "u":
                            element = <u key={`${i}-u`}>{element}</u>;
                            break;
                    }
                }

                elements.push(<span key={i}>{element}</span>);
            }
        }

        return elements;
    };

    return <div className={className}>{parseSimpleHtml(html)}</div>;
}

/**
 * Enhanced HTML renderer that properly handles paragraph tags and more complex HTML
 */
export function EnhancedHtmlRenderer({
    html,
    className,
}: SafeHtmlRendererProps) {
    const parseHtml = (htmlString: string): React.ReactNode => {
        // Clean up the HTML string
        const cleanHtml = htmlString.trim();

        // Handle paragraph tags by converting them to React elements
        const paragraphs = cleanHtml.split(/<\/p>\s*<p[^>]*>/g);

        return paragraphs
            .map((paragraph, index) => {
                // Remove opening and closing p tags
                const cleanParagraph = paragraph
                    .replace(/^<p[^>]*>|<\/p>$/g, "")
                    .trim();

                if (!cleanParagraph) return null;

                // Parse inline formatting within each paragraph
                const parts = cleanParagraph.split(
                    /(<\/?(?:strong|em|code|u|b|i)>)/g
                );
                const elements: React.ReactNode[] = [];
                let currentFormatting: string[] = [];

                for (let i = 0; i < parts.length; i++) {
                    const part = parts[i];

                    if (part === "<strong>" || part === "<b>") {
                        currentFormatting.push("strong");
                    } else if (part === "</strong>" || part === "</b>") {
                        currentFormatting = currentFormatting.filter(
                            (f) => f !== "strong"
                        );
                    } else if (part === "<em>" || part === "<i>") {
                        currentFormatting.push("em");
                    } else if (part === "</em>" || part === "</i>") {
                        currentFormatting = currentFormatting.filter(
                            (f) => f !== "em"
                        );
                    } else if (part === "<code>") {
                        currentFormatting.push("code");
                    } else if (part === "</code>") {
                        currentFormatting = currentFormatting.filter(
                            (f) => f !== "code"
                        );
                    } else if (part === "<u>") {
                        currentFormatting.push("u");
                    } else if (part === "</u>") {
                        currentFormatting = currentFormatting.filter(
                            (f) => f !== "u"
                        );
                    } else if (part && !part.startsWith("<")) {
                        // This is text content
                        let element: React.ReactNode = part;

                        // Apply formatting
                        const formats = [...currentFormatting];
                        for (const format of formats) {
                            switch (format) {
                                case "strong":
                                    element = (
                                        <strong key={`${index}-${i}-strong`}>
                                            {element}
                                        </strong>
                                    );
                                    break;
                                case "em":
                                    element = (
                                        <em key={`${index}-${i}-em`}>
                                            {element}
                                        </em>
                                    );
                                    break;
                                case "code":
                                    element = (
                                        <code key={`${index}-${i}-code`}>
                                            {element}
                                        </code>
                                    );
                                    break;
                                case "u":
                                    element = (
                                        <u key={`${index}-${i}-u`}>{element}</u>
                                    );
                                    break;
                            }
                        }

                        elements.push(
                            <span key={`${index}-${i}`}>{element}</span>
                        );
                    }
                }

                const paragraphKey = `paragraph-${paragraph.slice(
                    0,
                    20
                )}-${index}`;
                return elements.length > 0 ? (
                    <p key={paragraphKey}>{elements}</p>
                ) : null;
            })
            .filter(Boolean);
    };

    return <div className={className}>{parseHtml(html)}</div>;
}
