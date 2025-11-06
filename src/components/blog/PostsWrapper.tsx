import { getBlogPosts } from "@/api/blog";
import { Posts } from "./Posts";
import type { BlogPost } from "@/types/blog";

interface PostsWrapperProps {
    range?: [number] | [number, number];
    columns?: "1" | "2" | "3";
    thumbnail?: boolean;
    direction?: "row" | "column";
    exclude?: string[];
}

export async function PostsWrapper(props: PostsWrapperProps) {
    let posts: BlogPost[] = [];

    try {
        posts = await getBlogPosts();
    } catch (error) {
        console.error("Failed to fetch blog posts:", error);
        // Return empty posts array on error
    }

    return <Posts posts={posts} {...props} />;
}
