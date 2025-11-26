"use server";

import CompanyModel from "@/lib/models/company.model";
import { connectToDB } from "@/lib/mongodb";
import { revalidatePath } from "next/cache";

export async function addCompany(formData: FormData) {
  try {
    // Ensure MongoDB connection
    await connectToDB();

    // Extract company data from form
    const name = formData.get("name") as string;
    const address = formData.get("address") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const companyType = formData.get("companyType") as string;

    // Validate inputs
    const validationErrors: string[] = [];
    if (!name || name.trim() === "") validationErrors.push("Name is required");
    if (!address || address.trim() === "")
      validationErrors.push("Address is required");
    if (!email || email.trim() === "")
      validationErrors.push("Email is required");
    if (!phone || phone.trim() === "")
      validationErrors.push("Phone is required");
    if (!companyType || companyType.trim() === "")
      validationErrors.push("Company Type is required");

    if (validationErrors.length > 0) {
      return {
        success: false,
        errors: validationErrors,
      };
    }

    // Check if company already exists (using email as unique identifier)
    const existingCompany = await CompanyModel.findOne({
      email: email.trim(),
    });

    if (existingCompany) {
      return {
        success: false,
        error: "A company with this email already exists",
      };
    }

    // Create and save new company
    const newCompany = new CompanyModel({
      name: name.trim(),
      address: address.trim(),
      email: email.trim(),
      phone: phone.trim(),
      companyType: companyType.trim(),
    });
    await newCompany.save();

    // Revalidate the path to update the UI
    revalidatePath("/companies");

    return {
      success: true,
      company: newCompany,
    };
  } catch (error) {
    console.error("Error adding company:", error);
    return {
      success: false,
      error: "Failed to add company",
    };
  }
}

export async function fetchCompanies() {
  try {
    // Use the new method that includes vacancy count
    const companies = await getCompaniesWithVacancyCount();
    return companies;
  } catch (error) {
    console.error("Error fetching companies:", error);
    return [];
  }
}

export async function deleteCompany(id: string) {
  try {
    // Ensure MongoDB connection
    await connectToDB();

    // Find and delete the company
    const deletedCompany = await CompanyModel.findByIdAndDelete(id);

    if (!deletedCompany) {
      return {
        success: false,
        error: "Company not found",
      };
    }

    // Revalidate the path to update the UI
    revalidatePath("/companies");

    return {
      success: true,
      company: deletedCompany,
    };
  } catch (error) {
    console.error("Error deleting company:", error);
    return {
      success: false,
      error: "Failed to delete company",
    };
  }
}

export async function updateCompany(id: string, formData: FormData) {
  try {
    // Ensure MongoDB connection
    await connectToDB();

    // Extract company data from form
    const name = formData.get("name") as string;
    const address = formData.get("address") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const companyType = formData.get("companyType") as string;

    // Validate inputs
    const validationErrors: string[] = [];
    if (!name || name.trim() === "") validationErrors.push("Name is required");
    if (!address || address.trim() === "")
      validationErrors.push("Address is required");
    if (!email || email.trim() === "")
      validationErrors.push("Email is required");
    if (!phone || phone.trim() === "")
      validationErrors.push("Phone is required");
    if (!companyType || companyType.trim() === "")
      validationErrors.push("Company Type is required");

    if (validationErrors.length > 0) {
      return {
        success: false,
        errors: validationErrors,
      };
    }

    // Find and update the company
    const updatedCompany = await CompanyModel.findByIdAndUpdate(
      id,
      {
        name: name.trim(),
        address: address.trim(),
        email: email.trim(),
        phone: phone.trim(),
        companyType: companyType.trim(),
      },
      { new: true } // Return the updated document
    );

    if (!updatedCompany) {
      return {
        success: false,
        error: "Company not found",
      };
    }

    // Revalidate the path to update the UI
    revalidatePath("/companies");

    return {
      success: true,
      company: updatedCompany,
    };
  } catch (error) {
    console.error("Error updating company:", error);
    return {
      success: false,
      error: "Failed to update company",
    };
  }
}

export async function getCompaniesWithVacancyCount() {
  try {
    // Ensure MongoDB connection
    await connectToDB();

    // Aggregate companies with their job vacancy counts
    const companiesWithVacancies = await CompanyModel.aggregate([
      {
        $lookup: {
          from: "jobs", // Assuming your job collection is named "jobs"
          localField: "name",
          foreignField: "company",
          as: "vacancies",
        },
      },
      {
        $addFields: {
          vacancyCount: { $size: "$vacancies" },
          activeVacancyCount: {
            $size: {
              $filter: {
                input: "$vacancies",
                as: "job",
                cond: { $eq: ["$$job.isActive", true] },
              },
            },
          },
          jobId: {
            $map: { input: "$vacancies", as: "job", in: "$$job._id" },
          },
          title: {
            $map: { input: "$vacancies", as: "job", in: "$$job.title" },
          },
          cityName: {
            $map: { input: "$vacancies", as: "job", in: "$$job.cityName" },
          },
          posted: {
            $map: { input: "$vacancies", as: "job", in: "$$job.posted" },
          },
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          phone: 1,
          address: 1,
          companyType: 1,
          vacancyCount: 1,
          activeVacancyCount: 1,
          jobId: 1,
          title: 1,
          cityName: 1,
          posted: 1,
        },
      },
    ]);

    console.log("this is vacancy name", companiesWithVacancies);
    return companiesWithVacancies;
  } catch (error) {
    console.error("Error fetching companies with vacancies:", error);
    throw error;
  }
}
