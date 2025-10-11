/**
 * Markdown utilities using remark and remark-html
 * Reusable functions for processing rich text content from various sources
 */

import { remark } from "remark";
import html from "remark-html";

/**
 * Process markdown string to HTML using remark
 * @param markdown - Markdown string to process
 * @returns Promise<string> - HTML string
 */
export async function markdownToHtml(markdown: string): Promise<string> {
    const processedContent = await remark()
        .use(html, { sanitize: false }) // Allow HTML for better formatting
        .process(markdown);

    return processedContent.toString();
}

/**
 * Convert plain text to HTML via Markdown processing
 * Useful for processing any text content that might contain markdown syntax
 * @param text - Plain text that might contain markdown
 * @returns Promise<string> - HTML string
 */
export async function textToHtml(text: string): Promise<string> {
    return await markdownToHtml(text);
}

/**
 * Sanitize and process markdown content for safe rendering
 * @param markdown - Markdown string
 * @returns Promise<string> - Sanitized HTML string
 */
export async function safeMarkdownToHtml(markdown: string): Promise<string> {
    const processedContent = await remark()
        .use(html, { sanitize: true }) // Enable sanitization for untrusted content
        .process(markdown);

    return processedContent.toString();
}
