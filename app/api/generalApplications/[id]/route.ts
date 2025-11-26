import { connectToDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import GeneralApplications from "@/lib/models/generalApplication.model";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDB();

    const job = await GeneralApplications.findById(params.id);

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json(job);
  } catch (error) {
    console.error("Error fetching job:", error);
    return NextResponse.json({ error: "Failed to fetch job" }, { status: 500 });
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
      const updatedApplication = await GeneralApplications.findByIdAndUpdate(
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

      const updatedApplication = await GeneralApplications.findByIdAndUpdate(
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
                await GeneralApplications.findById(id)
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
