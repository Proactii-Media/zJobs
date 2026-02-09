"use server";

import Blog, { IBlog, IBlogInput } from "../models/blog.model";
import { connectToDB } from "../mongodb";
import { unstable_cache, revalidateTag } from "next/cache";

/* ---------------------------------------
   Create Blog
---------------------------------------- */
export async function createBlog(blogData: IBlogInput) {
  try {
    await connectToDB();

    const newBlog = await Blog.create(blogData);

    // 🔥 Invalidate blog cache
    revalidateTag("blogs");

    return JSON.parse(JSON.stringify(newBlog));
  } catch (error) {
    console.error("Failed to create blog:", error);
    throw new Error("Failed to create blog");
  }
}

/* ---------------------------------------
   Get Blogs (CACHED + TAGGED)
---------------------------------------- */
export const getBlogs = unstable_cache(
  async () => {
    await connectToDB();

    const blogs = await Blog.find({ isActive: true })
      .sort({ createdAt: -1 })
      .lean();

    return JSON.parse(JSON.stringify(blogs));
  },
  ["blogs"],
  {
    tags: ["blogs"], // 👈 REQUIRED for Vercel
    revalidate: 60,  // ISR fallback
  }
);

/* ---------------------------------------
   Get Single Blog
---------------------------------------- */
export async function getBlogById(id: string) {
  try {
    await connectToDB();

    const blog = await Blog.findById(id).lean();

    if (!blog) {
      throw new Error("Blog not found");
    }

    return JSON.parse(JSON.stringify(blog));
  } catch (error) {
    console.error(`Failed to fetch blog with id ${id}:`, error);
    throw new Error("Failed to fetch blog");
  }
}

/* ---------------------------------------
   Update Blog
---------------------------------------- */
export async function updateBlog(id: string, updateData: Partial<IBlog>) {
  try {
    await connectToDB();

    const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, {
      new: true,
    }).lean();

    if (!updatedBlog) {
      throw new Error("Blog not found");
    }

    // 🔥 Invalidate blog cache
    revalidateTag("blogs");

    return JSON.parse(JSON.stringify(updatedBlog));
  } catch (error) {
    console.error(`Failed to update blog with id ${id}:`, error);
    throw new Error("Failed to update blog");
  }
}

/* ---------------------------------------
   Delete Blog
---------------------------------------- */
export async function deleteBlog(id: string) {
  try {
    await connectToDB();

    const deletedBlog = await Blog.findByIdAndDelete(id).lean();

    if (!deletedBlog) {
      throw new Error("Blog not found");
    }

    // 🔥 Invalidate blog cache
    revalidateTag("blogs");

    return JSON.parse(JSON.stringify(deletedBlog));
  } catch (error) {
    console.error(`Failed to delete blog with id ${id}:`, error);
    throw new Error("Failed to delete blog");
  }
}
