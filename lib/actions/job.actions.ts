"use server";
import { connectToDB } from "../mongodb";
import Job, { IJobInput } from "../models/job.model";

export async function getJobs() {
  try {
    await connectToDB();
    const jobs = await Job.find({ isActive: true }).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(jobs));
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw error;
  }
}

export async function getFeaturedJobs(limit: number = 8) {
  try {
    await connectToDB();
    const jobs = await Job.find({ isActive: true })
      .sort({ rating: -1 })
      .limit(limit);
    return jobs;
  } catch (error) {
    console.error("Error fetching featured jobs:", error);
    throw error;
  }
}

export async function getJobsByCategory(category: string) {
  try {
    await connectToDB();
    const jobs = await Job.find({
      isActive: true,
      jobType: { $in: [category] },
    }).sort({ createdAt: -1 });
    return jobs;
  } catch (error) {
    console.error("Error fetching jobs by category:", error);
    throw error;
  }
}

export async function getJobById(id: string) {
  try {
    await connectToDB();
    const job = await Job.findById(id);
    if (!job) throw new Error("Job not found");
    return job;
  } catch (error) {
    console.error("Error fetching job:", error);
    throw error;
  }
}

export async function createJob(jobData: IJobInput) {
  try {
    await connectToDB();
    const newJob = await Job.create(jobData);
    return newJob;
  } catch (error) {
    console.error("Error creating job:", error);
    throw error;
  }
}

export async function updateJob(id: string, jobData: Partial<IJobInput>) {
  try {
    await connectToDB();
    const updatedJob = await Job.findByIdAndUpdate(
      id,
      { $set: jobData },
      { new: true, runValidators: true }
    );
    if (!updatedJob) throw new Error("Job not found");
    return updatedJob;
  } catch (error) {
    console.error("Error updating job:", error);
    throw error;
  }
}

export async function deleteJob(id: string) {
  try {
    await connectToDB();
    const deletedJob = await Job.findByIdAndDelete(id);
    if (!deletedJob) throw new Error("Job not found");
    return deletedJob;
  } catch (error) {
    console.error("Error deleting job:", error);
    throw error;
  }
}

export async function searchJobs(searchQuery: string) {
  try {
    await connectToDB();
    const jobs = await Job.find({
      isActive: true,
      $or: [
        { title: { $regex: searchQuery, $options: "i" } },
        { company: { $regex: searchQuery, $options: "i" } },
        { location: { $regex: searchQuery, $options: "i" } },
        { description: { $regex: searchQuery, $options: "i" } },
      ],
    }).sort({ createdAt: -1 });
    return jobs;
  } catch (error) {
    console.error("Error searching jobs:", error);
    throw error;
  }
}

export async function getJobsWithApplicationCount() {
  try {
    await connectToDB();

    const jobsWithApplications = await Job.aggregate([
      {
        $lookup: {
          from: "jobapplications",
          localField: "title",
          foreignField: "jobTitle",
          as: "applications",
        },
      },
      {
        $addFields: {
          applicationCount: { $size: "$applications" },
          applicationIds: {
            $map: { input: "$applications", as: "app", in: "$$app._id" },
          },
          applicantName: {
            $map: {
              input: "$applications",
              as: "app",
              in: "$$app.personalDetails.name",
            },
          },
          applicantEmail: {
            $map: {
              input: "$applications",
              as: "app",
              in: "$$app.personalDetails.email",
            },
          },
          applicantPhone: {
            $map: {
              input: "$applications",
              as: "app",
              in: "$$app.personalDetails.phone",
            },
          },
          applicantAddress: {
            $map: {
              input: "$applications",
              as: "app",
              in: "$$app.personalDetails.address",
            },
          },
        },
      },
      {
        $project: {
          applications: 0, // Exclude full application details to keep response minimal
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);
    return jobsWithApplications;
  } catch (error) {
    console.error("Detailed aggregation error:", error);
    throw error;
  }
}
