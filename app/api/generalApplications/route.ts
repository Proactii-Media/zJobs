import {
  createGeneralApplication,
  getGeneralApplications,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getGeneralApplicationById,
  updateGeneralApplication,
  deleteGeneralApplication,
  searchGeneralApplication,
} from "@/lib/actions/generalApplications.actions";
import { connectToDB } from "@/lib/mongodb";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { resumeFormSchema, type ResumeFormData } from "@/lib/validations";
import { NextResponse } from "next/server";
import { z } from "zod";

// GET all users or search users if query parameter is present
export async function GET(request: Request) {
  try {
    await connectToDB();
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");

    if (query) {
      const searchResults = await searchGeneralApplication(query);
      return NextResponse.json(searchResults);
    }

    const users = await getGeneralApplications();
    return NextResponse.json(users);
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to fetch users",
      },
      { status: 500 }
    );
  }
}

// POST new user
export async function POST(request: Request) {
  try {
    await connectToDB();
    const body = await request.json();

    // Validate the complete form data using the resumeFormSchema
    try {
      const validatedData = resumeFormSchema.parse(body);
      const newUser = await createGeneralApplication(validatedData);
      return NextResponse.json(newUser, { status: 201 });
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        const formattedErrors: Record<string, string> = {};
        validationError.errors.forEach((err) => {
          formattedErrors[err.path.join(".")] = err.message;
        });
        return NextResponse.json(
          { error: "Validation failed", details: formattedErrors },
          { status: 400 }
        );
      }
      throw validationError;
    }
  } catch (error) {
    console.error("Failed to create user:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to create user",
        details: error instanceof Error ? error.cause : undefined,
      },
      { status: 500 }
    );
  }
}

// PUT update user
export async function PUT(request: Request) {
  try {
    await connectToDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Partial validation for update data
    try {
      const validatedData = resumeFormSchema.partial().parse(body);
      const updatedUser = await updateGeneralApplication(id, validatedData);
      return NextResponse.json(updatedUser);
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        const formattedErrors: Record<string, string> = {};
        validationError.errors.forEach((err) => {
          formattedErrors[err.path.join(".")] = err.message;
        });
        return NextResponse.json(
          { error: "Validation failed", details: formattedErrors },
          { status: 400 }
        );
      }
      throw validationError;
    }
  } catch (error) {
    console.error("Failed to update user:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to update user",
      },
      { status: 500 }
    );
  }
}

// DELETE user
export async function DELETE(request: Request) {
  try {
    await connectToDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const deletedUser = await deleteGeneralApplication(id);
    return NextResponse.json(deletedUser);
  } catch (error) {
    console.error("Failed to delete user:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to delete user",
      },
      { status: 500 }
    );
  }
}
