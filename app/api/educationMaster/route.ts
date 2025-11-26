// app/api/educationMaster/route.ts
import { NextRequest, NextResponse } from "next/server";
import EducationDegreeModel from "@/lib/models/educationMaster.model";
import { connectToDB } from "@/lib/mongodb"; // Assuming you have a MongoDB connection utility

export async function GET() {
  try {
    // Ensure MongoDB connection
    await connectToDB();

    // Fetch all degrees
    const degrees = await EducationDegreeModel.find({});

    return NextResponse.json(
      degrees.map((degree) => ({ degree: degree.degree })),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching degrees:", error);
    return NextResponse.json(
      { message: "Error fetching degrees", error },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Ensure MongoDB connection
    await connectToDB();

    // Parse the request body
    const body = await req.json();
    const { degree } = body;

    // Validate input
    if (!degree) {
      return NextResponse.json(
        { error: "Degree is required" },
        { status: 400 }
      );
    }

    // Check if degree already exists
    const existingDegree = await EducationDegreeModel.findOne({ degree });
    if (existingDegree) {
      return NextResponse.json(
        { error: "Degree already exists" },
        { status: 400 }
      );
    }

    // Create and save new degree
    const newDegree = new EducationDegreeModel({ degree });
    await newDegree.save();

    return NextResponse.json({ degree: newDegree.degree }, { status: 201 });
  } catch (error) {
    console.error("Error adding degree:", error);
    return NextResponse.json(
      { error: "Failed to add degree" },
      { status: 500 }
    );
  }
}
