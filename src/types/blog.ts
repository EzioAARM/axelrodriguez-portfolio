export interface BlogAuthor {
    name: string;
    avatar: string;
}

export interface BlogPostMetadata {
    title: string;
    publishedAt: string;
    summary: string;
    image?: string;
    tag?: string;
    author?: BlogAuthor;
    team?: BlogAuthor[];
    excerpt?: string;
}

export interface BlogPost {
    slug: string;
    content: string;
    metadata: BlogPostMetadata;
}
