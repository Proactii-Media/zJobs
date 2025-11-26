import {
  createJobApplication,
  getJobApplications,
  updateJobApplication,
  deleteJobApplication,
  getJobApplicationsByTitle,
  getJobApplicationsByExperience,
} from "@/lib/actions/jobApplication.actions";
import { connectToDB } from "@/lib/mongodb";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { jobResumeFormSchema, type jobResumeFormData } from "@/lib/validations";
import { NextResponse } from "next/server";
import { z } from "zod";

// * GET all applications or search if query parameter is present
export async function GET(request: Request) {
  try {
    await connectToDB();

    //* Get query parameters
    const url = new URL(request.url);
    const jobTitle = url.searchParams.get("jobTitle");
    const experience = url.searchParams.get("experience");

    let applications;

    //* Handle different query scenarios
    if (jobTitle) {
      applications = await getJobApplicationsByTitle(jobTitle);
    } else if (experience) {
      applications = await getJobApplicationsByExperience(experience);
    } else {
      applications = await getJobApplications();
    }

    const count = applications.length;

    //* Return both the count and the applications
    return NextResponse.json({
      count,
      applications,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Failed to fetch job applications:", err);
    return NextResponse.json(
      { error: "Failed to fetch job applications" },
      { status: 500 }
    );
  }
}

// * POST new application
export async function POST(request: Request) {
  try {
    await connectToDB();
    const body = await request.json();

    // * Validate the complete form data using the resumeFormSchema
    try {
      const validatedData = jobResumeFormSchema.parse(body);
      const newApplication = await createJobApplication(validatedData);
      return NextResponse.json(newApplication, { status: 201 });
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
    console.error("Failed to create application:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create application",
        details: error instanceof Error ? error.cause : undefined,
      },
      { status: 500 }
    );
  }
}

// * PUT update application
export async function PUT(request: Request) {
  try {
    await connectToDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Application ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();

    // * Partial validation for update data
    try {
      const validatedData = jobResumeFormSchema.partial().parse(body);
      const updatedApplication = await updateJobApplication(id, validatedData);
      return NextResponse.json(updatedApplication);
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
    console.error("Failed to update application:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to update application",
      },
      { status: 500 }
    );
  }
}

// * DELETE application
export async function DELETE(request: Request) {
  try {
    await connectToDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Application ID is required" },
        { status: 400 }
      );
    }

    const deletedApplication = await deleteJobApplication(id);
    return NextResponse.json(deletedApplication);
  } catch (error) {
    console.error("Failed to delete application:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete application",
      },
      { status: 500 }
    );
  }
}
