import mongoose, { Schema, model, models } from "mongoose";

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },

    slug: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },

    content: {
        type: String,
        required: true,
    },

    featuredImage: {
        url: String,
        alt: String,
    },

    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    status: {
        type: String,
        enum: ["DRAFT", "PUBLISHED"],
        default: "DRAFT",
    },
},
    { timestamps: true }
);

export const Blog = models.Blog || model("Blog", blogSchema);