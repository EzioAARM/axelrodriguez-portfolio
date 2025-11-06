"use client";

import { useState, useEffect } from "react";
import { Posts } from "./Posts";
import { Column, Text, Flex, Spinner } from "@once-ui-system/core";
import type { BlogPost } from "@/types/blog";

interface SearchablePostsProps {
    searchQuery: string;
    range?: [number] | [number, number];
    columns?: "1" | "2" | "3";
    thumbnail?: boolean;
    direction?: "row" | "column";
    exclude?: string[];
}

export function SearchablePosts({
    searchQuery,
    range,
    columns = "1",
    thumbnail = false,
    exclude = [],
    direction,
}: SearchablePostsProps) {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchPosts() {
            try {
                setLoading(true);
                const response = await fetch("/api/blog");
                if (!response.ok) {
                    throw new Error("Failed to fetch posts");
                }
                const fetchedPosts = await response.json();
                setPosts(fetchedPosts);
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

    if (loading) {
        return (
            <Column align="center" paddingY="xl">
                <Flex fillWidth paddingY="128" horizontal="center">
                    <Spinner />
                </Flex>
            </Column>
        );
    }

    if (error) {
        return (
            <Column align="center" paddingY="xl">
                <Text variant="body-default-m" color="red-500">
                    {error}
                </Text>
            </Column>
        );
    }

    return (
        <Posts
            posts={posts}
            range={range}
            searchQuery={searchQuery}
            columns={columns}
            thumbnail={thumbnail}
            direction={direction}
            exclude={exclude}
        />
    );
}
