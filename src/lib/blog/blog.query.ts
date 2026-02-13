import mongoose from "mongoose";
import { Blog } from "./blog.model";
import { blog as blogType } from "../../types/blog";
import { connectMongoose } from "../mongoose";

export function mapBlog(blog: any): blogType {
    const authorId = blog.author?._id?.toString?.() ?? blog.author?.toString?.() ?? blog.author;
    const authorName = blog.author?.firstName
        ? `${blog.author.firstName} ${blog.author.lastName ?? ""}`.trim()
        : undefined;

    return {
        title: blog.title,
        slug: blog.slug,
        content: blog.content,
        featuredImage: blog.featuredImage
            ? {
                url: blog.featuredImage.url,
                alt: blog.featuredImage.alt,
            }
            : undefined,
        author: authorId,
        authorName,
        status: blog.status,
        createdAt: blog.createdAt,
        updatedAt: blog.updatedAt,
    };
}

export async function getBlogById(id: string) {
    await connectMongoose();

    try {
        const blog = await Blog.findById(id).populate("author", "firstName lastName").lean();
        return blog ? mapBlog(blog) : null;
    } catch (error) {
        throw new Error("Database error");
    }
}

export async function getBlogsByAuthor(authorId: string) {
    await connectMongoose();

    try {
        const blogs = await Blog.find({ author: authorId }).populate("author", "firstName lastName").lean();
        return blogs.map(mapBlog);
    } catch (error) {
        throw new Error("Database error");
    }
}

export async function getBlogsByAuthorPaginated(authorId: string, page = 1, limit = 6) {
    await connectMongoose();

    try {
        const safePage = Number.isFinite(page) && page > 0 ? page : 1;
        const safeLimit = Number.isFinite(limit) && limit > 0 ? limit : 6;
        const skip = (safePage - 1) * safeLimit;

        const blogs = await Blog.find({ author: authorId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(safeLimit)
            .populate("author", "firstName lastName")
            .lean();

        return blogs.map(mapBlog);
    } catch (error) {
        throw new Error("Database error");
    }
}

export async function countBlogsByAuthor(authorId: string) {
    await connectMongoose();

    try {
        return await Blog.countDocuments({ author: authorId });
    } catch (error) {
        throw new Error("Database error");
    }
}

export async function getLatestBlogs() {
    await connectMongoose();

    try {
        const blogs = await Blog.find().sort({ createdAt: -1 }).limit(3).populate("author", "firstName lastName").lean();
        return blogs.map(mapBlog);
    } catch (error) {
        throw new Error("Database error");
    }
}

export async function seedBlogs() {
    await connectMongoose();

    const existingBlogs = await Blog.find().lean();
    if (existingBlogs.length > 0) {
        return;
    }

    const blogData = [
        {
            title: "Blog 1",
            slug: "blog-1",
            content: "This is the content of blog 1.",
            author: new mongoose.Types.ObjectId(),
            status: "PUBLISHED",
        },
        {
            title: "Blog 2",
            slug: "blog-2",
            content: "This is the content of blog 2.",
            author: new mongoose.Types.ObjectId(),
            status: "PUBLISHED",
        },
        {
            title: "Blog 3",
            slug: "blog-3",
            content: "This is the content of blog 3.",
            author: new mongoose.Types.ObjectId(),
            status: "PUBLISHED",
        },
        {
            title: "Blog 4",
            slug: "blog-4",
            content: "This is the content of blog 4.",
            author: new mongoose.Types.ObjectId(),
            status: "PUBLISHED",
        },
        {
            title: "Blog 5",
            slug: "blog-5",
            content: "This is the content of blog 5.",
            author: new mongoose.Types.ObjectId(),
            status: "PUBLISHED",
        },
    ];
    for (const blog of blogData) {
        await Blog.create(blog);
    }
}


export async function createBlog(blog: blogType) {
    await connectMongoose();

    if (!blog.title || !blog.slug || !blog.content || !blog.author) {
        throw new Error("Missing required fields");
    }

    try {
        const createdBlog = await Blog.create(blog);
        return mapBlog(createdBlog);
    } catch (error) {
        throw new Error("Database error");
    }
}

export async function getBlogBySlug(slug: string) {
    await connectMongoose();

    try {
        const blog = await Blog.findOne({ slug }).populate("author", "firstName lastName").lean();
        return blog ? mapBlog(blog) : null;
    } catch (error) {
        throw new Error("Database error");
    }
}

export async function getAllBlogs() {
    await connectMongoose();

    try {
        const blogs = await Blog.find().populate("author", "firstName lastName").lean();
        if (blogs.length === 0) {
            await seedBlogs();
            const seededBlogs = await Blog.find().populate("author", "firstName lastName").lean();
            return seededBlogs.map(mapBlog);
        }
        return blogs.map(mapBlog);
    } catch (error) {
        throw new Error("Database error");
    }
}

export async function getBlogs(limit?: number) {
    await connectMongoose();

    try {
        const query = Blog.find().populate("author", "firstName lastName").sort({ createdAt: -1 });
        if (typeof limit === "number" && Number.isFinite(limit) && limit > 0) {
            query.limit(limit);
        }
        const blogs = await query.lean();
        return blogs.map(mapBlog);
    } catch (error) {
        throw new Error("Database error");
    }
}

export async function getBlogsPaginated(page = 1, limit = 6) {
    await connectMongoose();

    try {
        const safePage = Number.isFinite(page) && page > 0 ? page : 1;
        const safeLimit = Number.isFinite(limit) && limit > 0 ? limit : 6;
        const skip = (safePage - 1) * safeLimit;

        const blogs = await Blog.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(safeLimit)
            .populate("author", "firstName lastName")
            .lean();

        return blogs.map(mapBlog);
    } catch (error) {
        throw new Error("Database error");
    }
}

export async function countAllBlogs() {
    await connectMongoose();

    try {
        return await Blog.countDocuments();
    } catch (error) {
        throw new Error("Database error");
    }
}

export async function getPublishedBlogsPaginated(page = 1, limit = 6) {
    await connectMongoose();

    try {
        const safePage = Number.isFinite(page) && page > 0 ? page : 1;
        const safeLimit = Number.isFinite(limit) && limit > 0 ? limit : 6;
        const skip = (safePage - 1) * safeLimit;

        const blogs = await Blog.find({ status: "PUBLISHED" })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(safeLimit)
            .populate("author", "firstName lastName")
            .lean();

        if (blogs.length === 0 && safePage === 1) {
            // If no published blogs and on first page, seed blogs
            await seedBlogs();
            const seededBlogs = await Blog.find({ status: "PUBLISHED" })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(safeLimit)
                .populate("author", "firstName lastName")
                .lean();
            return seededBlogs.map(mapBlog);
        }

        return blogs.map(mapBlog);
    } catch (error) {
        throw new Error("Database error");
    }
}

export async function countPublishedBlogs() {
    await connectMongoose();

    try {
        return await Blog.countDocuments({ status: "PUBLISHED" });
    } catch (error) {
        throw new Error("Database error");
    }
}

export async function getPublishedBlogsByAuthorPaginated(authorId: string, page = 1, limit = 6) {
    await connectMongoose();

    try {
        const safePage = Number.isFinite(page) && page > 0 ? page : 1;
        const safeLimit = Number.isFinite(limit) && limit > 0 ? limit : 6;
        const skip = (safePage - 1) * safeLimit;

        const blogs = await Blog.find({ author: authorId, status: "PUBLISHED" })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(safeLimit)
            .populate("author", "firstName lastName")
            .lean();

        return blogs.map(mapBlog);
    } catch (error) {
        throw new Error("Database error");
    }
}

export async function countPublishedBlogsByAuthor(authorId: string) {
    await connectMongoose();

    try {
        return await Blog.countDocuments({ author: authorId, status: "PUBLISHED" });
    } catch (error) {
        throw new Error("Database error");
    }
}

export async function updateBlog(slug: string, updatedData: Partial<blogType>) {
    await connectMongoose();

    try {
        const blog = await Blog.findOneAndUpdate({ slug }, updatedData, { new: true }).lean();
        return blog ? mapBlog(blog) : null;
    } catch (error) {
        throw new Error("Database error");
    }
}

export async function deleteBlog(slug: string) {
    await connectMongoose();

    try {
        const blog = await Blog.findOneAndDelete({ slug }).lean();
        return blog ? mapBlog(blog) : null;
    } catch (error) {
        throw new Error("Database error");
    }
}
