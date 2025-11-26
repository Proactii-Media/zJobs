"use server";

import JobPositionModel from "@/lib/models/jobPositionMaster.model";
import { connectToDB } from "@/lib/mongodb";
import { revalidatePath } from "next/cache";

export async function addJobPosition(formData: FormData) {
  try {
    // Ensure MongoDB connection
    await connectToDB();

    // Get position from form data
    const position = formData.get("position") as string;

    // Validate input
    if (!position || position.trim() === "") {
      return {
        success: false,
        error: "Position is required",
      };
    }

    // Check if position already exists
    const existingPosition = await JobPositionModel.findOne({
      position: position.trim(),
    });

    if (existingPosition) {
      return {
        success: false,
        error: "Position already exists",
      };
    }

    // Create and save new position
    const newPosition = new JobPositionModel({
      position: position.trim(),
    });
    await newPosition.save();

    // Revalidate the path to update the UI
    revalidatePath("/master");

    return {
      success: true,
      position: newPosition.position,
    };
  } catch (error: unknown) {
    // Log the error for server-side debugging
    console.error("Error adding position:", error);

    // Return a user-friendly error message
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";

    return {
      success: false,
      error: errorMessage,
    };
  }
}

export async function fetchJobPositions() {
  try {
    // Ensure MongoDB connection
    await connectToDB();

    // Fetch all positions
    const positions = await JobPositionModel.find({});

    return positions.map((position) => position.position);
  } catch (error: unknown) {
    // Log the error for server-side debugging
    console.error("Error fetching positions:", error);

    // Return an empty array in case of error
    return [];
  }
}
