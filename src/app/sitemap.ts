import { getBlogPosts } from "@/api/blog";
import { baseURL, routes as routesConfig } from "@/resources";

export default async function sitemap() {
    const blogPosts = await getBlogPosts();
    const blogs = blogPosts.map((post) => ({
        url: `${baseURL}/blog/${post.slug}`,
        lastModified: post.metadata.publishedAt,
    }));

    // Note: Work projects are now managed through Strapi, not local MDX files
    // If work projects need to be included in sitemap, add API call here similar to blog posts

    const activeRoutes = Object.keys(routesConfig).filter(
        (route) => routesConfig[route as keyof typeof routesConfig]
    );

    const routes = activeRoutes.map((route) => ({
        url: `${baseURL}${route !== "/" ? route : ""}`,
        lastModified: new Date().toISOString().split("T")[0],
    }));

    return [...routes, ...blogs];
}
