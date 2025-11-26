import { NextResponse } from "next/server";
import { getJobsWithApplicationCount } from "@/lib/actions/job.actions";

export async function GET() {
  try {
    const jobs = await getJobsWithApplicationCount();
    return NextResponse.json(jobs, { status: 200 });
  } catch (error) {
    console.error("Error in GET jobs with applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs with applications" },
      { status: 500 }
    );
  }
}
