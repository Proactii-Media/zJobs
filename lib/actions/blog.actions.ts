"use server";
import Blog, { IBlog, IBlogInput } from "../models/blog.model";
import { connectToDB } from "../mongodb";

//* Create a new blog post
export async function createBlog(blogData: IBlogInput) {
  try {
    await connectToDB(); //! Ensure MongoDB is connected

    //* Mongoose's create method automatically handles model creation and saving
    const newBlog = await Blog.create(blogData);
    return newBlog;
  } catch (error) {
    console.error("Failed to create blog:", error);
    throw new Error("Failed to create blog");
  }
}

//* Get all blog posts
export async function getBlogs() {
  try {
    await connectToDB();
    const blogs = await Blog.find({ isActive: true })
      .sort({ createdAt: -1 })
      .lean();
    return JSON.parse(JSON.stringify(blogs));
  } catch (error) {
    console.error("Failed to fetch blogs:", error);
    throw new Error("Failed to fetch blogs");
  }
}

//* Get a single blog by ID
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

//* Update a blog post
export async function updateBlog(id: string, updateData: Partial<IBlog>) {
  try {
    await connectToDB();
    // Convert the updated blog to a plain object
    const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, {
      new: true,
    }).lean();
    if (!updatedBlog) {
      throw new Error("Blog not found");
    }
    return updatedBlog;
  } catch (error) {
    console.error(`Failed to update blog with id ${id}:`, error);
    throw new Error("Failed to update blog");
  }
}

//* Delete a blog post
export async function deleteBlog(id: string) {
  try {
    await connectToDB();
    const deletedBlog = await Blog.findByIdAndDelete(id).lean();
    if (!deletedBlog) {
      throw new Error("Blog not found");
    }
    return deletedBlog;
  } catch (error) {
    console.error(`Failed to delete blog with id ${id}:`, error);
    throw new Error("Failed to delete blog");
  }
}
