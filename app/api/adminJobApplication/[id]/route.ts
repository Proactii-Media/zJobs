import { deleteJobApplication } from "@/lib/actions/adminJobApplication.actions";
import JobApplication from "@/lib/models/adminJobApplication.model";
import { connectToDB } from "@/lib/mongodb";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

// * GET application details based on id or search if query parameter is present
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDB();

    const application = await JobApplication.findById(params.id);

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(application);
  } catch (error) {
    console.error("Error fetching application:", error);
    return NextResponse.json(
      { error: "Failed to fetch application" },
      { status: 500 }
    );
  }
}

// * DELETE application
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Application ID is required" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid application ID" },
        { status: 400 }
      );
    }

    await connectToDB();

    const deletedApplication = await deleteJobApplication(id);
    if (!deletedApplication) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(deletedApplication, { status: 200 });
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

// * UPDATE application
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid application ID" },
        { status: 400 }
      );
    }

    await connectToDB();

    // Check if it's a PDF update (multipart form data) or regular update (JSON)
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      // Handle PDF update
      const formData = await request.formData();
      const pdfFile = formData.get("pdf") as File;

      if (!pdfFile) {
        return NextResponse.json(
          { error: "No PDF file provided" },
          { status: 400 }
        );
      }

      // Convert PDF to base64
      const buffer = await pdfFile.arrayBuffer();
      const base64Data = Buffer.from(buffer).toString("base64");

      // Update only the PDF data
      const updatedApplication = await JobApplication.findByIdAndUpdate(
        id,
        {
          $set: {
            "professionalDetails.pdfData": {
              fileName: pdfFile.name,
              contentType: pdfFile.type,
              data: base64Data,
            },
          },
        },
        { new: true }
      );

      if (!updatedApplication) {
        return NextResponse.json(
          { error: "Application not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(updatedApplication);
    } else {
      // Handle regular update (JSON data)
      const jsonData = await request.json();

      const updatedApplication = await JobApplication.findByIdAndUpdate(
        id,
        {
          $set: {
            jobTitle: jsonData.jobTitle,
            personalDetails: jsonData.personalDetails,
            educationalDetails: jsonData.educationalDetails,
            professionalDetails: {
              ...jsonData.professionalDetails,
              // Preserve existing PDF data if it exists
              pdfData: (
                await JobApplication.findById(id)
              )?.professionalDetails?.pdfData,
            },
          },
        },
        { new: true }
      );

      if (!updatedApplication) {
        return NextResponse.json(
          { error: "Application not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(updatedApplication);
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
