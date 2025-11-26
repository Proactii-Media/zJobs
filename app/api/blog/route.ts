import { createBlog, getBlogs } from "@/lib/actions/blog.actions"; //! Import blog action functions
import { connectToDB } from "@/lib/mongodb"; //! Connect to MongoDB
import { blogSchema } from "@/lib/validations"; //! Schema for blog validation
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDB(); //! Ensure MongoDB is connected
    const blogs = await getBlogs(); //* Fetch all blogs
    return NextResponse.json(blogs); //* Respond with blogs
  } catch (error) {
    console.error("Failed to fetch blogs:", error);
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectToDB(); //! Ensure MongoDB is connected
    const body = await request.json();

    //* Validate the incoming blog data
    const validatedData = blogSchema.parse(body);

    //* Create a new blog entry in the database
    const newBlog = await createBlog(validatedData);

    //* Respond with the newly created blog
    return NextResponse.json(newBlog, { status: 201 });
  } catch (error) {
    console.error("Failed to create blog:", error);
    return NextResponse.json(
      { error: "Failed to create blog" },
      { status: 500 }
    );
  }
}
