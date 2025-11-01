"use client";

import { getBlogPosts, type BlogPost } from "@/api/blog";
import { Grid, Text, Column, Flex, Spinner } from "@once-ui-system/core";
import Post from "./Post";
import { useState, useEffect } from "react";

interface PostsProps {
    range?: [number] | [number, number];
    columns?: "1" | "2" | "3";
    thumbnail?: boolean;
    direction?: "row" | "column";
    exclude?: string[];
    searchQuery?: string;
}

export function Posts({
    range,
    columns = "1",
    thumbnail = false,
    exclude = [],
    direction,
    searchQuery,
}: PostsProps) {
    const [allBlogs, setAllBlogs] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch blog posts from Strapi
    useEffect(() => {
        async function fetchPosts() {
            try {
                setLoading(true);
                const posts = await getBlogPosts();
                setAllBlogs(posts);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch blog posts:", err);
                setError("Failed to load blog posts");
            } finally {
                setLoading(false);
            }
        }

        fetchPosts();
    }, []);

    // Show loading state
    if (loading) {
        return (
            <Column align="center" paddingY="xl">
                <Flex fillWidth paddingY="128" horizontal="center">
                    <Spinner />
                </Flex>
            </Column>
        );
    }

    // Show error state
    if (error) {
        return (
            <Column align="center" paddingY="xl">
                <Text variant="body-default-m" color="red-500">
                    {error}
                </Text>
            </Column>
        );
    }

    let filteredBlogs = [...allBlogs];

    // Exclude by slug (exact match)
    if (exclude.length) {
        filteredBlogs = filteredBlogs.filter(
            (post: BlogPost) => !exclude.includes(post.slug)
        );
    }

    // Filter by search query
    if (searchQuery?.trim()) {
        const query = searchQuery.toLowerCase().trim();
        filteredBlogs = filteredBlogs.filter((post: BlogPost) => {
            // Search in title, summary, and tag
            const titleMatch = post.metadata.title
                .toLowerCase()
                .includes(query);
            const summaryMatch = post.metadata.summary
                .toLowerCase()
                .includes(query);
            const tagMatch = post.metadata.tag?.toLowerCase().includes(query);
            const contentMatch = post.content.toLowerCase().includes(query);

            return titleMatch || summaryMatch || tagMatch || contentMatch;
        });
    }

    const sortedBlogs = filteredBlogs.sort((a: BlogPost, b: BlogPost) => {
        return (
            new Date(b.metadata.publishedAt).getTime() -
            new Date(a.metadata.publishedAt).getTime()
        );
    });

    const displayedBlogs = range
        ? sortedBlogs.slice(
              range[0] - 1,
              range.length === 2 ? range[1] : sortedBlogs.length
          )
        : sortedBlogs;

    return (
        <>
            {displayedBlogs.length > 0 ? (
                <Grid
                    columns={columns}
                    s={{ columns: 1 }}
                    fillWidth
                    marginBottom="40"
                    gap="16"
                >
                    {displayedBlogs.map((post: BlogPost) => (
                        <Post
                            key={post.slug}
                            post={post}
                            thumbnail={thumbnail}
                            direction={direction}
                        />
                    ))}
                </Grid>
            ) : searchQuery?.trim() ? (
                <Column align="center" paddingY="xl">
                    <Text variant="body-default-m" color="neutral-500">
                        No posts found matching your search.
                    </Text>
                </Column>
            ) : (
                <Column align="center" paddingY="xl">
                    <Text variant="body-default-m" color="neutral-500">
                        No posts available.
                    </Text>
                </Column>
            )}
        </>
    );
}
