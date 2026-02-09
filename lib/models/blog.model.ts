import mongoose, { Document, Schema } from "mongoose";

export interface IBlog extends Document {
  image: string;
  user: string;
  date: string;
  heading: string;
  description: string;
  category: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords?: string;
  isActive?: boolean;
}

export type IBlogInput = Omit<IBlog, keyof Document>;

const blogSchema = new Schema<IBlog>(
  {
    image: { type: String, required: true },
    user: { type: String, required: true },
    date: { type: String, required: true },
    heading: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    metaTitle: { type: String, required: true },
    metaDescription: { type: String, required: true },
    metaKeywords: { type: String },
    isActive: { type: Boolean, default: true }, // ✅ REQUIRED
  },
  {
    timestamps: true, // ✅ createdAt & updatedAt
  }
);

const Blog =
  mongoose.models.Blog || mongoose.model<IBlog>("Blog", blogSchema);

export default Blog;
