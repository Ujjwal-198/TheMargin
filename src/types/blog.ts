
export interface blog {
    title: string;
    slug: string;
    content: string;
    featuredImage?: {
        url: string;
        alt: string;
    };
    author: string;
    authorName?: string;
    status?: "DRAFT" | "PUBLISHED";
    createdAt: Date;
    updatedAt: Date;
}

export interface BlogDocument {
    title: string;
    slug: string;
    content: string;
    featuredImage?: {
        url: string;
        alt: string;
    };
    author: string;
    authorName?: string;
    status?: "DRAFT" | "PUBLISHED";
    createdAt: Date;
    updatedAt: Date;
}
