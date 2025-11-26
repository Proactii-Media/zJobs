"use server";

import GeneralApplications, {
  IGeneralApplication,
} from "../models/generalApplication.model";
import { connectToDB } from "../mongodb";
import mongoose from "mongoose";

// Create user
export async function createGeneralApplication(userData: IGeneralApplication) {
  try {
    await connectToDB();

    // Validate email presence and format
    if (!userData.personalDetails?.email) {
      throw new Error("Email is required");
    }

    // Validate email format
    if (!/\S+@\S+\.\S+/.test(userData.personalDetails.email)) {
      throw new Error("Invalid email format");
    }

    // Check if user with same email already exists
    const existingUser = await GeneralApplications.findOne({
      "personalDetails.email": userData.personalDetails.email,
    });

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Additional validation before saving
    if (
      !userData.personalDetails?.name ||
      !userData.personalDetails?.phone ||
      !userData.personalDetails?.address
    ) {
      throw new Error("All personal details are required");
    }

    const newUser = new GeneralApplications(userData);
    return await newUser.save();
  } catch (error) {
    console.error("Failed to create user:", error);
    if (error instanceof mongoose.Error.ValidationError) {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      throw new Error(`Validation failed: ${validationErrors.join(", ")}`);
    }
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Failed to create user");
  }
}

// Get all users
export async function getGeneralApplications() {
  try {
    await connectToDB();
    const users = await GeneralApplications.find({}).sort({ createdAt: -1 }); // Sort by newest first
    return JSON.parse(JSON.stringify(users));
  } catch (error) {
    console.error("Failed to fetch users:", error);
    throw new Error("Failed to fetch users");
  }
}

// Get user by ID
export async function getGeneralApplicationById(id: string) {
  try {
    await connectToDB();
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid user ID");
    }

    const user = await GeneralApplications.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    console.error(`Failed to fetch user with id ${id}:`, error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Failed to fetch user");
  }
}

// Get user by email
export async function getGeneralApplicationByEmail(email: string) {
  try {
    await connectToDB();
    const user = await GeneralApplications.findOne({
      "personalDetails.email": email,
    });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    console.error(`Failed to fetch user with email ${email}:`, error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Failed to fetch user");
  }
}

// Update user
export async function updateGeneralApplication(
  id: string,
  updateData: Partial<IGeneralApplication>
) {
  try {
    await connectToDB();
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid user ID");
    }

    // If email is being updated, check for uniqueness
    if (updateData.personalDetails?.email) {
      const existingUser = await GeneralApplications.findOne({
        "personalDetails.email": updateData.personalDetails.email,
        _id: { $ne: id }, // Exclude current user from check
      });
      if (existingUser) {
        throw new Error("Email already in use");
      }
    }

    const updatedUser = await GeneralApplications.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true, // Run mongoose validation on update
      }
    );

    if (!updatedUser) {
      throw new Error("User not found");
    }
    return updatedUser;
  } catch (error) {
    console.error(`Failed to update user with id ${id}:`, error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Failed to update user");
  }
}

// Delete user
export async function deleteGeneralApplication(id: string) {
  try {
    await connectToDB();
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid user ID");
    }

    const deletedUser = await GeneralApplications.findByIdAndDelete(id);
    if (!deletedUser) {
      throw new Error("User not found");
    }
    return deletedUser;
  } catch (error) {
    console.error(`Failed to delete user with id ${id}:`, error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Failed to delete user");
  }
}

// Search users
export async function searchGeneralApplication(query: string) {
  try {
    await connectToDB();
    const users = await GeneralApplications.find({
      $or: [
        { "personalDetails.name": { $regex: query, $options: "i" } },
        { "personalDetails.email": { $regex: query, $options: "i" } },
        { "educationalDetails.university": { $regex: query, $options: "i" } },
        { "educationalDetails.degree": { $regex: query, $options: "i" } },
      ],
    });
    return JSON.parse(JSON.stringify(users));
  } catch (error) {
    console.error("Failed to search users:", error);
    throw new Error("Failed to search users");
  }
}
