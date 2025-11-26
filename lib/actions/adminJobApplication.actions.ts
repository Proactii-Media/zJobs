import JobApplication, {
  IJobApplication,
} from "../models/adminJobApplication.model";
import { connectToDB } from "../mongodb";
import mongoose from "mongoose";

// * Create job application
export async function createJobApplication(applicationData: IJobApplication) {
  try {
    await connectToDB();

    if (!applicationData.personalDetails?.email) {
      throw new Error("Email is required");
    }

    if (!/\S+@\S+\.\S+/.test(applicationData.personalDetails.email)) {
      throw new Error("Invalid email format");
    }

    const existingApplication = await JobApplication.findOne({
      "personalDetails.email": applicationData.personalDetails.email,
    });

    if (existingApplication) {
      throw new Error("Application with this email already exists");
    }

    if (
      !applicationData.personalDetails?.name ||
      !applicationData.personalDetails?.phone ||
      !applicationData.personalDetails?.address
    ) {
      throw new Error("All personal details are required");
    }

    const newApplication = new JobApplication(applicationData);
    return await newApplication.save();
  } catch (error) {
    console.error("Failed to create application:", error);
    if (error instanceof mongoose.Error.ValidationError) {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      throw new Error(`Validation failed: ${validationErrors.join(", ")}`);
    }
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Failed to create application");
  }
}

// * Get all applications
export async function getJobApplications() {
  try {
    await connectToDB();
    const applications = await JobApplication.find({}).sort({ createdAt: -1 });
    //* Convert Mongoose documents to plain objects
    return JSON.parse(JSON.stringify(applications));
  } catch (error) {
    console.error("Failed to fetch job applications:", error);
    throw new Error("Failed to fetch job applications");
  }
}
// * Get application by ID
export async function getJobApplicationById(id: string) {
  try {
    await connectToDB();
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid application ID");
    }

    const application = await JobApplication.findById(id);
    if (!application) {
      throw new Error("Application not found");
    }
    return application;
  } catch (error) {
    console.error(`Failed to fetch application with id ${id}:`, error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Failed to fetch application");
  }
}

// * Update application
export async function updateJobApplication(
  id: string,
  updateData: Partial<IJobApplication>
) {
  try {
    await connectToDB();
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid application ID");
    }

    if (updateData.personalDetails?.email) {
      const existingApplication = await JobApplication.findOne({
        "personalDetails.email": updateData.personalDetails.email,
        _id: { $ne: id },
      });
      if (existingApplication) {
        throw new Error("Email already in use");
      }
    }

    const updatedApplication = await JobApplication.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedApplication) {
      throw new Error("Application not found");
    }
    return updatedApplication;
  } catch (error) {
    console.error(`Failed to update application with id ${id}:`, error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Failed to update application");
  }
}

// * Delete application
export async function deleteJobApplication(id: string) {
  try {
    await connectToDB();
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid application ID");
    }

    const deletedApplication = await JobApplication.findByIdAndDelete(id);
    if (!deletedApplication) {
      throw new Error("Application not found");
    }
    return deletedApplication;
  } catch (error) {
    console.error(`Failed to delete application with id ${id}:`, error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Failed to delete application");
  }
}

// * Search job applications
export async function searchJobApplications(query: string) {
  try {
    await connectToDB();
    const applications = await JobApplication.find({
      $or: [
        { "personalDetails.name": { $regex: query, $options: "i" } },
        { "personalDetails.email": { $regex: query, $options: "i" } },
        { "educationalDetails.university": { $regex: query, $options: "i" } },
        { "educationalDetails.degree": { $regex: query, $options: "i" } },
      ],
    });
    return JSON.parse(JSON.stringify(applications));
  } catch (error) {
    console.error("Failed to search applications:", error);
    throw new Error("Failed to search applications");
  }
}

export async function getJobApplicationsByTitle(jobTitle: string) {
  try {
    await connectToDB();
    return await JobApplication.find({
      jobTitle: { $regex: new RegExp(jobTitle, "i") },
    }).sort({ createdAt: -1 });
  } catch (error) {
    console.error(
      `Failed to fetch job applications for title ${jobTitle}:`,
      error
    );
    throw new Error("Failed to fetch job applications by title");
  }
}

export async function getJobApplicationsByExperience(minExperience: string) {
  try {
    await connectToDB();
    return await JobApplication.find({
      experience: { $gte: minExperience },
    }).sort({ createdAt: -1 });
  } catch (error) {
    console.error(
      `Failed to fetch job applications for experience ${minExperience}:`,
      error
    );
    throw new Error("Failed to fetch job applications by experience");
  }
}
