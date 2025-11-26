import { NextRequest, NextResponse } from "next/server";
import CompanyModel from "@/lib/models/company.model";
import { connectToDB } from "@/lib/mongodb";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Ensure MongoDB connection
    await connectToDB();

    // Find the specific company by ID
    const company = await CompanyModel.findById(params.id);

    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    return NextResponse.json(company, { status: 200 });
  } catch (error) {
    console.error("Error fetching company:", error);
    return NextResponse.json(
      { message: "Error fetching company", error },
      { status: 500 }
    );
  }
}
