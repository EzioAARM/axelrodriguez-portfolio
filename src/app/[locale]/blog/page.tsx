"use client";

import {
    Column,
    Heading,
    Icon,
    IconButton,
    Input,
    Meta,
    Row,
    Schema,
} from "@once-ui-system/core";
import { Mailchimp } from "@/components";
import { SearchablePosts } from "@/components/blog/SearchablePosts";
import { baseURL, blog, person } from "@/resources";
import { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Blog() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchValue, setSearchValue] = useState<string>("");
    const [isSearching, setIsSearching] = useState(false);

    // Get search query from URL on component mount
    useEffect(() => {
        const query = searchParams.get("q") || "";
        setSearchValue(query);
        setIsSearching(!!query);
    }, [searchParams]);

    const handleSearchChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setSearchValue(e.target.value);
        },
        []
    );

    const handleSearch = useCallback(() => {
        if (searchValue.trim()) {
            setIsSearching(true);
            // Update URL with search query
            router.push(`/blog?q=${encodeURIComponent(searchValue.trim())}`);
        } else {
            handleClearSearch();
        }
    }, [searchValue, router]);

    const handleClearSearch = useCallback(() => {
        setSearchValue("");
        setIsSearching(false);
        // Remove search query from URL
        router.push("/blog");
    }, [router]);

    const handleKeyPress = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") {
                handleSearch();
            }
        },
        [handleSearch]
    );

    return (
        <Column maxWidth="m" paddingTop="24">
            <Row align="center" paddingX="24" marginBottom="24">
                <Input
                    id="search-input"
                    label="Search posts"
                    value={searchValue}
                    onChange={handleSearchChange}
                    onKeyPress={handleKeyPress}
                    hasPrefix={<Icon name="search" size="xs" />}
                    hasSuffix={
                        searchValue.length > 0 ? (
                            <IconButton
                                variant="ghost"
                                icon="close"
                                size="s"
                                onClick={handleClearSearch}
                                aria-label="Clear search"
                            />
                        ) : null
                    }
                />
            </Row>
            <Schema
                as="blogPosting"
                baseURL={baseURL}
                title={blog.title}
                description={blog.description}
                path={blog.path}
                image={`/api/og/generate?title=${encodeURIComponent(
                    blog.title
                )}`}
                author={{
                    name: person.name,
                    url: `${baseURL}/blog`,
                    image: `${baseURL}${person.avatar}`,
                }}
            />
            <Heading
                marginBottom="l"
                variant="heading-strong-xl"
                marginLeft="24"
            >
                {blog.title}
            </Heading>
            <Column fillWidth flex={1} gap="40">
                {isSearching ? (
                    <>
                        <Heading
                            as="h2"
                            variant="heading-strong-xl"
                            marginLeft="l"
                        >
                            Search results for &quot;{searchValue}&quot;
                        </Heading>
                        <SearchablePosts
                            searchQuery={searchValue}
                            columns="2"
                            thumbnail
                        />
                    </>
                ) : (
                    <>
                        <SearchablePosts
                            searchQuery=""
                            range={[1, 1]}
                            thumbnail
                        />
                        <SearchablePosts
                            searchQuery=""
                            range={[2, 3]}
                            columns="2"
                            thumbnail
                            direction="column"
                        />
                        <Mailchimp marginBottom="l" />
                        <Heading
                            as="h2"
                            variant="heading-strong-xl"
                            marginLeft="l"
                        >
                            Earlier posts
                        </Heading>
                        <SearchablePosts
                            searchQuery=""
                            range={[4]}
                            columns="2"
                        />
                    </>
                )}
            </Column>
        </Column>
    );
}
