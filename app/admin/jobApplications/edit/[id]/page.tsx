"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormField,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter, useParams } from "next/navigation";
import Loader from "@/components/Loader";
import { pdfDataSchema } from "@/lib/validations";
import { fetchDegrees } from "@/lib/actions/educationMaster.actions";
import { fetchJobPositions } from "@/lib/actions/jobPositionMaster.actions";

const jobApplicationSchema = z.object({
  jobTitle: z.string().min(1, "Job title is required"),
  personalDetails: z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    address: z.string().min(1, "Address is required"),
  }),
  educationalDetails: z.object({
    degree: z.string().min(1, "Degree is required"),
    graduationYear: z.string().min(1, "Graduation year is required"),
    university: z.string().min(1, "University is required"),
  }),
  professionalDetails: z.object({
    experience: z.string().min(1, "Experience details are required"),
    resumeType: z.string(),
    pdfData: pdfDataSchema,
  }),
});

type JobApplicationFormData = z.infer<typeof jobApplicationSchema>;

const EditJobApplication = () => {
  // * useStates
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPdfName, setCurrentPdfName] = useState<string>("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfError, setPdfError] = useState("");
  const [resumeType, setResumeType] = useState<string>("");
  const [degrees, setDegrees] = useState<string[]>([]);
  const [positions, setPositions] = useState<string[]>([]);

  // * hooks
  const router = useRouter();
  const { id } = useParams();

  const form = useForm<JobApplicationFormData>({
    resolver: zodResolver(jobApplicationSchema),
    defaultValues: {
      jobTitle: "",
      personalDetails: {
        name: "",
        email: "",
        phone: "",
        address: "",
      },
      educationalDetails: {
        degree: "",
        graduationYear: "",
        university: "",
      },
      professionalDetails: {
        experience: "",
        resumeType: "",
        pdfData: {
          fileName: "",
          contentType: "",
          data: "",
        },
      },
    },
  });

  // * pdf handling
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setPdfError("");
    if (!file) {
      setPdfError("Please select a file");
      return;
    }
    if (file.type !== "application/pdf") {
      setPdfError("Please upload only PDF files");
      return;
    }
    setPdfFile(file);
  };

  const handleSubmit = async (data: JobApplicationFormData) => {
    if (!id) return;
    setIsSubmitting(true);

    try {
      // * Determine the endpoint based on the stored resumeType
      const endpoint =
        resumeType === "admin"
          ? `/api/adminJobApplication/${id}`
          : `/api/jobApplication/${id}`;

      //  * If there's a new PDF file, handle it first
      if (pdfFile) {
        const formData = new FormData();
        formData.append("pdf", pdfFile);

        const pdfResponse = await fetch(endpoint, {
          method: "PUT",
          body: formData,
        });

        if (!pdfResponse.ok) {
          throw new Error("Failed to update PDF");
        }
      }

      // * Prepare the data for update, ensuring resumeType is preserved
      const updatedData = {
        ...data,
        professionalDetails: {
          ...data.professionalDetails,
          resumeType: resumeType, // * Use the stored resumeType
        },
      };

      // * Send the form data to the appropriate endpoint
      const jsonResponse = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!jsonResponse.ok) {
        const errorData = await jsonResponse.json();
        throw new Error(errorData.error || "Failed to update job application");
      }

      router.push("/admin/jobApplications");
    } catch (error) {
      console.error("Error updating job application:", error);
      alert(
        `Error updating job application: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // * useEffects
  useEffect(() => {
    const fetchJobApplication = async () => {
      if (!id) return;
      try {
        // * Initially try to fetch the data from the main endpoint
        const response = await fetch(`/api/jobApplication/${id}`);
        const application = await response.json();

        // * Get the resumeType from the response
        const applicationType =
          application.professionalDetails?.resumeType || "vacancy";
        setResumeType(applicationType);

        if (application.professionalDetails?.pdfData?.fileName) {
          setCurrentPdfName(application.professionalDetails.pdfData.fileName);
        }

        // * Set form data
        form.reset({
          jobTitle: application.jobTitle,
          personalDetails: {
            name: application.personalDetails.name,
            email: application.personalDetails.email,
            phone: application.personalDetails.phone,
            address: application.personalDetails.address,
          },
          educationalDetails: {
            degree: application.educationalDetails.degree,
            graduationYear: application.educationalDetails.graduationYear,
            university: application.educationalDetails.university,
          },
          professionalDetails: {
            experience: application.professionalDetails.experience,
            resumeType: applicationType, // Set the resumeType from response
            pdfData: application.professionalDetails.pdfData || {
              fileName: "",
              contentType: "",
              data: "",
            },
          },
        });
      } catch (error) {
        console.error("Failed to fetch job application:", error);
        alert("Failed to load job application data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobApplication();
  }, [id, form]);

  useEffect(() => {
    const loadDegrees = async () => {
      try {
        const fetchedDegrees = await fetchDegrees();
        const fetchedPositions = await fetchJobPositions();
        setDegrees(fetchedDegrees);
        setPositions(fetchedPositions);
      } catch (error: unknown) {
        console.error("Error fetching degrees:", error);
      }
    };

    loadDegrees();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Loader />
      </div>
    );
  }

  return (
    <section className="sm:px-5 md:px-1 lg:px-2">
      <h1 className="text-black text-2xl font-semibold sm:mb-5 md:mb-2">
        Edit Job Application
      </h1>
      <div className="bg-white border border-gray-300 rounded-xl p-6 text-black">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {/* Job Title */}
            <FormField
              control={form.control}
              name="jobTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter job title" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Personal Details */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Personal Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="personalDetails.name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter full name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="personalDetails.email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="Enter email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="personalDetails.phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter phone number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="personalDetails.address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter address" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Educational Details */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Educational Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="educationalDetails.degree"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Degree</FormLabel>
                      <FormControl>
                        <Select
                          {...field}
                          onValueChange={(value) => {
                            field.onChange(value);
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a degree" />
                          </SelectTrigger>
                          <SelectContent>
                            {degrees.map((degree) => (
                              <SelectItem key={degree} value={degree}>
                                {degree}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="educationalDetails.graduationYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Graduation Year</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter graduation year" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="educationalDetails.university"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>University</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter university name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Professional Details */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Professional Details</h2>
              <FormField
                control={form.control}
                name="professionalDetails.experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Experience</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter professional experience"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="jobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                        }}
                        {...field}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a position" />
                        </SelectTrigger>
                        <SelectContent>
                          {positions.map((position) => (
                            <SelectItem key={position} value={position}>
                              {position}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Current PDF Display */}
              <div className="mt-2">
                <FormItem>
                  <FormLabel>Upload Resume (PDF)</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="application/pdf"
                      onChange={handleFileChange}
                      className="file:mr-4 file:py-1 file:px-4 py-1.5 file:rounded-ful file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-slate-700 hover:file:bg-slate-100"
                    />
                  </FormControl>
                  {pdfError && (
                    <p className="text-red-500 text-sm mt-1">{pdfError}</p>
                  )}
                  {currentPdfName && !pdfFile && (
                    <p className="text-gray-600 text-sm mt-1">
                      Current file: {currentPdfName}
                    </p>
                  )}
                  {pdfFile && (
                    <p className="text-green-500 text-sm mt-1">
                      Selected file: {pdfFile.name}
                    </p>
                  )}
                </FormItem>
              </div>
            </div>

            <div className="flex flex-row gap-5">
              <Button
                type="submit"
                className="text-white px-6"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update"}
              </Button>
              <Button
                className="px-6"
                onClick={() => router.back()}
                variant="outline"
                type="button"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </section>
  );
};

export default EditJobApplication;
