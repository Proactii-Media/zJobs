import { NextRequest, NextResponse } from "next/server";
import CompanyModel from "@/lib/models/company.model";
import { connectToDB } from "@/lib/mongodb";

export async function GET() {
  try {
    // Ensure MongoDB connection
    await connectToDB();

    // Fetch all companies
    const companies = await CompanyModel.find({});

    return NextResponse.json(
      companies.map((company) => ({
        id: company._id,
        name: company.name,
        email: company.email,
        address: company.address,
        phone: company.phone,
        companyType: company.companyType,
      })),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching companies:", error);
    return NextResponse.json(
      { message: "Error fetching companies", error },
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
    const { name, address, email, phone, companyType } = body;

    // Validate inputs
    const validationErrors: string[] = [];
    if (!name) validationErrors.push("Name is required");
    if (!address) validationErrors.push("Address is required");
    if (!email) validationErrors.push("Email is required");
    if (!phone) validationErrors.push("Phone is required");
    if (!companyType) validationErrors.push("Company Type is required");

    if (validationErrors.length > 0) {
      return NextResponse.json({ errors: validationErrors }, { status: 400 });
    }

    // Check if company already exists (using email as unique identifier)
    const existingCompany = await CompanyModel.findOne({ email });
    if (existingCompany) {
      return NextResponse.json(
        { error: "A company with this email already exists" },
        { status: 400 }
      );
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

    return NextResponse.json(
      {
        id: newCompany._id,
        name: newCompany.name,
        email: newCompany.email,
        address: newCompany.address,
        phone: newCompany.phone,
        companyType: newCompany.companyType,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding company:", error);
    return NextResponse.json(
      { error: "Failed to add company" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // Ensure MongoDB connection
    await connectToDB();

    // Parse the request body to get the company ID
    const body = await req.json();
    const { id } = body;

    // Validate input
    if (!id) {
      return NextResponse.json(
        { error: "Company ID is required" },
        { status: 400 }
      );
    }

    // Find and delete the company
    const deletedCompany = await CompanyModel.findByIdAndDelete(id);

    if (!deletedCompany) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Company deleted successfully", company: deletedCompany },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting company:", error);
    return NextResponse.json(
      { error: "Failed to delete company" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    // Ensure MongoDB connection
    await connectToDB();

    // Parse the request body
    const body = await req.json();
    const { id, name, address, email, phone, companyType } = body;

    // Validate inputs
    const validationErrors: string[] = [];
    if (!id) validationErrors.push("Company ID is required");
    if (!name) validationErrors.push("Name is required");
    if (!address) validationErrors.push("Address is required");
    if (!email) validationErrors.push("Email is required");
    if (!phone) validationErrors.push("Phone is required");
    if (!companyType) validationErrors.push("Company Type is required");

    if (validationErrors.length > 0) {
      return NextResponse.json({ errors: validationErrors }, { status: 400 });
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
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        id: updatedCompany._id,
        name: updatedCompany.name,
        email: updatedCompany.email,
        address: updatedCompany.address,
        phone: updatedCompany.phone,
        companyType: updatedCompany.companyType,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating company:", error);
    return NextResponse.json(
      { error: "Failed to update company" },
      { status: 500 }
    );
  }
}
