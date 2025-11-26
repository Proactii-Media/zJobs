// app/actions/educationMasterActions.ts
"use server";

import EducationDegreeModel from "@/lib/models/educationMaster.model";
import { connectToDB } from "@/lib/mongodb";
import { revalidatePath } from "next/cache";

export async function addDegree(formData: FormData) {
  try {
    // Ensure MongoDB connection
    await connectToDB();

    // Get degree from form data
    const degree = formData.get("degree") as string;

    // Validate input
    if (!degree || degree.trim() === "") {
      return {
        success: false,
        error: "Degree is required",
      };
    }

    // Check if degree already exists
    const existingDegree = await EducationDegreeModel.findOne({
      degree: degree.trim(),
    });

    if (existingDegree) {
      return {
        success: false,
        error: "Degree already exists",
      };
    }

    // Create and save new degree
    const newDegree = new EducationDegreeModel({
      degree: degree.trim(),
    });
    await newDegree.save();

    // Revalidate the path to update the UI
    revalidatePath("/master");

    return {
      success: true,
      degree: newDegree.degree,
    };
  } catch (error) {
    console.error("Error adding degree:", error);
    return {
      success: false,
      error: "Failed to add degree",
    };
  }
}

export async function fetchDegrees() {
  try {
    // Ensure MongoDB connection
    await connectToDB();

    // Fetch all degrees
    const degrees = await EducationDegreeModel.find({});

    return degrees.map((degree) => degree.degree);
  } catch (error) {
    console.error("Error fetching degrees:", error);
    return [];
  }
}
