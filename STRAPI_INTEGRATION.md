# Strapi API Integration Guide

This guide explains how to use the Strapi API integration for the home content.

## API Implementation

The Strapi API is implemented in `src/api/home.ts` and provides the following functions:

### Main Functions

1. **`getHomeContent()`** - Fetches home content from Strapi (throws on error)
2. **`getHomeContentSafe()`** - Fetches home content with error handling (returns null on error)
3. **`convertRichTextToString()`** - Converts Strapi rich text to plain text
4. **`convertRichTextToHTML()`** - Converts Strapi rich text to HTML string

### Environment Variables Required

Make sure these environment variables are set in your `.env` file:

```env
STRAPI_API_URL=http://localhost:1337
STRAPI_API_TOKEN=your_strapi_api_token_here
```

## Content Structure in Strapi

The Strapi "home" single type should have these fields:

-   **headline** (Text) - The main headline for the home page
-   **hasFeatured** (Boolean) - Whether to show the featured badge
-   **featured** (Text) - The featured badge text
-   **subline** (Rich Text) - The subline content with formatting support

## Usage Examples

### 1. In a Next.js Server Component

```tsx
import { getHomeContentSafe } from "@/api/home";

export default async function HomePage() {
    const strapiContent = await getHomeContentSafe();

    if (strapiContent) {
        return (
            <div>
                <h1>{strapiContent.headline}</h1>
                {strapiContent.hasFeatured && (
                    <div className="featured">{strapiContent.featured}</div>
                )}
                <p>{convertRichTextToString(strapiContent.subline)}</p>
            </div>
        );
    }

    // Fallback to static content from resources/content.tsx
    return <StaticHomePage />;
}
```

### 2. In a Client Component with useEffect

```tsx
"use client";
import { useEffect, useState } from "react";
import { getHomeContentSafe, HomeContent } from "@/api/home";

export function DynamicHomePage() {
    const [content, setContent] = useState<HomeContent | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchContent() {
            const strapiContent = await getHomeContentSafe();
            setContent(strapiContent);
            setLoading(false);
        }

        fetchContent();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (!content) return <StaticHomePage />;

    return (
        <div>
            <h1>{content.headline}</h1>
            {/* ... rest of your component */}
        </div>
    );
}
```

### 3. Hybrid Approach (Recommended)

For the best user experience, modify your existing `src/app/page.tsx`:

```tsx
import { getHomeContentSafe } from "@/api/home";
import { home as staticHome } from "@/resources";
// ... other imports

export default async function Home() {
    // Try to get content from Strapi
    const strapiContent = await getHomeContentSafe();

    // Use Strapi content if available, otherwise use static content
    const pageContent = strapiContent
        ? {
              headline: strapiContent.headline,
              featured: {
                  display: strapiContent.hasFeatured,
                  title: strapiContent.featured,
                  href: staticHome.featured.href, // Keep static href
              },
              subline: convertRichTextToString(strapiContent.subline),
          }
        : staticHome;

    return (
        <Column maxWidth="m" gap="xl" paddingY="12" horizontal="center">
            {/* Your existing JSX structure using pageContent instead of staticHome */}
            <Heading wrap="balance" variant="display-strong-l">
                {pageContent.headline}
            </Heading>
            {/* ... rest of your existing component */}
        </Column>
    );
}
```

## Error Handling

The API includes comprehensive error handling:

-   **Network errors** - When Strapi server is unavailable
-   **Authentication errors** - When API token is invalid
-   **Missing environment variables** - Clear error messages
-   **Invalid response structure** - Validates Strapi response format

## Testing the Integration

1. **Test with Strapi running:**

    ```bash
    # Start your Strapi server
    npm run develop

    # In another terminal, start Next.js
    npm run dev
    ```

2. **Test without Strapi:**

    - Stop your Strapi server
    - The application should fall back to static content

3. **Test with invalid token:**
    - Change `STRAPI_API_TOKEN` to an invalid value
    - Should gracefully fall back to static content

## Deployment Considerations

-   Make sure environment variables are set in your production environment
-   Consider implementing caching for better performance
-   Monitor API calls in production for error rates
-   Keep static content as fallback for reliability

## Next Steps

1. Create your "home" single type in Strapi admin
2. Add the required fields (headline, hasFeatured, featured, subline)
3. Publish some content
4. Update your page components to use the new API
5. Test both Strapi-connected and fallback scenarios
