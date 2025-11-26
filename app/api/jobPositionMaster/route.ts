// app/api/jobPosition/route.ts
import { NextRequest, NextResponse } from "next/server";
import JobPositionModel from "@/lib/models/jobPositionMaster.model";
import { connectToDB } from "@/lib/mongodb";

export async function GET() {
  try {
    // Ensure MongoDB connection
    await connectToDB();

    // Fetch all positions
    const positions = await JobPositionModel.find({});

    return NextResponse.json(
      positions.map((position) => ({ position: position.position })),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching positions:", error);
    return NextResponse.json(
      { message: "Error fetching positions", error },
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
    const { position } = body;

    // Validate input
    if (!position) {
      return NextResponse.json(
        { error: "Position is required" },
        { status: 400 }
      );
    }

    // Check if position already exists
    const existingPosition = await JobPositionModel.findOne({ position });
    if (existingPosition) {
      return NextResponse.json(
        { error: "Position already exists" },
        { status: 400 }
      );
    }

    // Create and save new position
    const newPosition = new JobPositionModel({ position });
    await newPosition.save();

    return NextResponse.json(
      { position: newPosition.position },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding position:", error);
    return NextResponse.json(
      { error: "Failed to add position" },
      { status: 500 }
    );
  }
}
