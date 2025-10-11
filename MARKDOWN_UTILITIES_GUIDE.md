# Markdown Utilities for API Implementation

This guide shows how to use the reusable markdown utilities with remark and remark-html for processing content in your API implementations.

## Core Utilities (`src/utils/markdown.ts`)

### Functions Available

#### 1. **markdownToHtml(markdown: string)**

Converts markdown string to HTML using remark

```typescript
const html = await markdownToHtml("**Bold text** and *italic text*");
// Result: "<p><strong>Bold text</strong> and <em>italic text</em></p>"
```

#### 2. **strapiRichTextToMarkdown(richText)**

Converts Strapi rich text format to markdown

```typescript
const markdown = strapiRichTextToMarkdown(strapiRichTextNodes);
// Result: "**Bold text** and *italic text*"
```

#### 3. **strapiRichTextToHtml(richText)**

Converts Strapi rich text to HTML via markdown processing

```typescript
const html = await strapiRichTextToHtml(strapiRichTextNodes);
// Result: "<p><strong>Bold text</strong> and <em>italic text</em></p>"
```

#### 4. **processContentToHtml(content)**

Generic processor for any content format

```typescript
const html = await processContentToHtml(unknownContent);
```

#### 5. **extractPlainText(content)**

Extract plain text from any content format

```typescript
const text = extractPlainText(strapiContent);
```

#### 6. **safeMarkdownToHtml(markdown)**

Safely process untrusted markdown (with sanitization)

```typescript
const safeHtml = await safeMarkdownToHtml(userGeneratedMarkdown);
```

## Updated Home API (`src/api/home.ts`)

Your home API now uses these utilities:

```typescript
// Available functions:
convertRichTextToString(richText); // Plain text
convertRichTextToMarkdown(richText); // Markdown format
convertRichTextToHTML(richText); // HTML via remark (async)
processContentToHTML(content); // Generic processor (async)
```

## Usage Examples

### 1. Blog API Implementation

```typescript
// src/api/blog.ts
import {
    processContentToHtml,
    extractPlainText,
    strapiRichTextToMarkdown,
} from "@/utils/markdown";

export async function getBlogPost(id: number) {
    const response = await fetch(`${apiUrl}/api/blog-posts/${id}`);
    const data = await response.json();

    const content = data.data.attributes.content;

    return {
        id: data.data.id,
        title: data.data.attributes.title,
        content,
        contentHtml: await processContentToHtml(content),
        contentMarkdown: strapiRichTextToMarkdown(content),
        contentText: extractPlainText(content),
        excerpt: extractPlainText(content).slice(0, 200),
    };
}
```

### 2. Projects API Implementation

```typescript
// src/api/projects.ts
import { processContentToHtml, extractPlainText } from "@/utils/markdown";

export async function getProjects() {
    const response = await fetch(`${apiUrl}/api/projects`);
    const data = await response.json();

    return Promise.all(
        data.data.map(async (project) => ({
            id: project.id,
            name: project.attributes.name,
            description: project.attributes.description,
            descriptionHtml: await processContentToHtml(
                project.attributes.description
            ),
            descriptionText: extractPlainText(project.attributes.description),
        }))
    );
}
```

### 3. About Page API Implementation

```typescript
// src/api/about.ts
import {
    strapiRichTextToHtml,
    strapiRichTextToMarkdown,
    extractPlainText,
} from "@/utils/markdown";

export async function getAboutPage() {
    const response = await fetch(`${apiUrl}/api/about`);
    const data = await response.json();

    const bio = data.data.attributes.bio;

    return {
        id: data.data.id,
        bio,
        bioHtml: await strapiRichTextToHtml(bio),
        bioMarkdown: strapiRichTextToMarkdown(bio),
        bioText: extractPlainText(bio),
    };
}
```

### 4. Generic Content Processing

```typescript
// For any unknown content format
import { processContentToHtml, extractPlainText } from "@/utils/markdown";

export async function processAnyContent(content: unknown) {
    return {
        text: extractPlainText(content),
        html: await processContentToHtml(content),
    };
}
```

### 5. User-Generated Content (Safe Processing)

```typescript
// For user input that might contain markdown
import { safeMarkdownToHtml } from "@/utils/markdown";

export async function processUserContent(userMarkdown: string) {
    // This will sanitize HTML and prevent XSS
    return await safeMarkdownToHtml(userMarkdown);
}
```

## Content Type Support

### Strapi Rich Text Format

```json
[
    {
        "type": "paragraph",
        "children": [
            { "text": "Normal text " },
            { "text": "bold text", "bold": true },
            { "text": " and " },
            { "text": "italic text", "italic": true }
        ]
    }
]
```

### Markdown Format

```markdown
Normal text **bold text** and _italic text_

## Heading

-   List item 1
-   List item 2

> Quote text

`Inline code`
```

### HTML Output

```html
<p>Normal text <strong>bold text</strong> and <em>italic text</em></p>
<h2>Heading</h2>
<ul>
    <li>List item 1</li>
    <li>List item 2</li>
</ul>
<blockquote>
    <p>Quote text</p>
</blockquote>
<p><code>Inline code</code></p>
```

## Testing Your Implementation

Update your test file to test the utilities:

```typescript
// src/api/test-content-processing.ts
import {
    markdownToHtml,
    strapiRichTextToMarkdown,
    processContentToHtml,
    extractPlainText,
} from "@/utils/markdown";

async function testMarkdownProcessing() {
    // Test markdown to HTML
    const markdown = "**Bold** and *italic* text";
    const html = await markdownToHtml(markdown);
    console.log("Markdown to HTML:", html);

    // Test with Strapi content
    const strapiContent = await getContentFromStrapi();
    if (strapiContent) {
        const processed = {
            text: extractPlainText(strapiContent),
            markdown: strapiRichTextToMarkdown(strapiContent),
            html: await processContentToHtml(strapiContent),
        };
        console.log("Processed content:", processed);
    }
}
```

## Best Practices

### 1. **Choose the Right Function**

-   Use `strapiRichTextToHtml()` for Strapi rich text
-   Use `markdownToHtml()` for plain markdown strings
-   Use `processContentToHtml()` for unknown formats
-   Use `safeMarkdownToHtml()` for user-generated content

### 2. **Error Handling**

```typescript
try {
    const html = await processContentToHtml(content);
    return html;
} catch (error) {
    console.error("Content processing failed:", error);
    return extractPlainText(content); // Fallback to plain text
}
```

### 3. **Performance Considerations**

-   Cache processed HTML when possible
-   Use `extractPlainText()` for excerpts (it's synchronous)
-   Process content server-side when possible

### 4. **Type Safety**

```typescript
import type { StrapiRichTextNode } from "@/utils/markdown";

interface MyContent {
    title: string;
    body: StrapiRichTextNode[] | string;
}
```

## Integration with Components

```tsx
// Use in React components
import { processContentToHtml } from "@/utils/markdown";

export async function MyComponent({ content }) {
    const html = await processContentToHtml(content);

    return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
```

The utilities are now ready to use across all your API implementations! They provide consistent, safe, and flexible content processing with full TypeScript support.
