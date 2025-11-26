"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import Loader from "@/components/Loader";
import { useRouter, useParams } from "next/navigation";
import dynamic from "next/dynamic";

// Dynamic import for React Quill
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import { Button } from "@/components/ui/button";

interface Job {
  _id: string;
  company: string;
  title: string;
  location: string;
  jobType: string[];
  description: string;
  requirements: string;
  deadline: string;
  salaryMin: string;
  salaryMax: string;
  posted: string;
  isActive: boolean;
}

const ViewJob = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [job, setJob] = useState<Job>();
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) return;
      try {
        const response = await fetch(`/api/jobs/${id}`);
        if (!response.ok) throw new Error("Failed to fetch job");

        const jobData = await response.json();
        setJob(jobData);
      } catch (error) {
        console.error("Failed to fetch job:", error);
        alert("Failed to load job data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Loader />
      </div>
    );
  }

  if (!job) {
    return <div>Job not found</div>;
  }

  return (
    <section className="sm:px-5 md:px-1 lg:px-2">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-black text-2xl font-semibold">View Job</h1>
        <Button
          onClick={() => router.back()}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      <div className="bg-white border border-gray-300 rounded-xl p-6 text-black">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Company Name
            </label>
            <div className="p-2 bg-gray-50 rounded-md">{job.company}</div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Job Title</label>
            <div className="p-2 bg-gray-50 rounded-md">{job.title}</div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <div className="p-2 bg-gray-50 rounded-md">{job.location}</div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Application Deadline
            </label>
            <div className="p-2 bg-gray-50 rounded-md">
              {new Date(job.deadline).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Minimum Salary (₹)
            </label>
            <div className="p-2 bg-gray-50 rounded-md">
              {job.salaryMin.toLocaleString()}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Maximum Salary (₹)
            </label>
            <div className="p-2 bg-gray-50 rounded-md">
              {job.salaryMax.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">Job Type</label>
          <div className="flex flex-wrap gap-2">
            {job.jobType.map((type: string) => (
              <span
                key={type}
                className="px-3 py-1 bg-gray-100 rounded-full text-sm"
              >
                {type}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Job Description
            </label>
            <div className="prose max-w-none">
              <ReactQuill
                value={job.description || ""}
                readOnly={true}
                theme="snow"
                modules={{ toolbar: false }}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Job Requirements
            </label>
            <div className="prose max-w-none">
              <ReactQuill
                value={
                  Array.isArray(job.requirements)
                    ? job.requirements.join("\n")
                    : job.requirements
                }
                readOnly={true}
                theme="snow"
                modules={{ toolbar: false }}
              />
            </div>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">Status</label>
          <div className="p-2 bg-gray-50 rounded-md">
            {job.isActive ? "Active" : "Inactive"}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ViewJob;
