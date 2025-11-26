"use client";
import React, { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AdminJobResumeFormData,
  AdminJobResumeFormSchema,
} from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { fetchDegrees } from "@/lib/actions/educationMaster.actions";
import { fetchJobPositions } from "@/lib/actions/jobPositionMaster.actions";

const AdminJobApplicationForm = () => {
  // * useStates
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfError, setPdfError] = useState("");
  const [degrees, setDegrees] = useState<string[]>([]);
  const [positions, setPositions] = useState<string[]>([]);

  // * hooks
  const router = useRouter();

  // * form default values
  const form = useForm<AdminJobResumeFormData>({
    resolver: zodResolver(AdminJobResumeFormSchema),
    defaultValues: {
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
        resumeType: "admin",
        pdfData: {
          fileName: "",
          contentType: "",
          data: "",
        },
      },
      jobTitle: "",
    },
  });

  // * pdf file handling
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

  // * submit form
  const onSubmit = async (data: AdminJobResumeFormData) => {
    setIsSubmitting(true);
    setPdfError("");

    try {
      if (!pdfFile) {
        setPdfError("Please upload a PDF file");
        setIsSubmitting(false);
        return;
      }

      const reader = new FileReader();
      const pdfData = await new Promise<string>((resolve, reject) => {
        reader.onloadend = () => {
          const base64Data = reader.result?.toString().split(",")[1] || "";
          resolve(base64Data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(pdfFile);
      });

      const formData = {
        personalDetails: data.personalDetails,
        educationalDetails: data.educationalDetails,
        professionalDetails: {
          ...data.professionalDetails,
          pdfData: {
            fileName: pdfFile.name,
            contentType: pdfFile.type,
            data: pdfData,
          },
        },
        jobTitle: data.jobTitle,
      };

      const response = await fetch("/api/adminJobApplication", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit form");
      }

      form.reset();
      setPdfFile(null);
    } catch (error) {
      console.error("Error:", error);
      setPdfError(
        error instanceof Error ? error.message : "Failed to submit form"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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

  return (
    <section className="sm:px-5 md:px-1 lg:px-2">
      <h1 className="text-black text-2xl font-semibold sm:mb-5 md:mb-2">
        Add Application
      </h1>
      <div className="bg-white border border-gray-300 rounded-xl p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Details Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Personal Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="personalDetails.name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter your full name" />
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
                          placeholder="Enter your email"
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
                        <Input
                          {...field}
                          type="tel"
                          placeholder="Enter your phone number"
                        />
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
                        <Input {...field} placeholder="Enter your address" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Educational Details Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Educational Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

            {/* Professional Details Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Professional Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="professionalDetails.experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Experience</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter your experience" />
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
                  {pdfFile && (
                    <p className="text-green-500 text-sm mt-1">
                      Selected file: {pdfFile.name}
                    </p>
                  )}
                </FormItem>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-row gap-5">
              <Button
                type="submit"
                disabled={isSubmitting}
                onClick={() => router.push("/admin/jobApplications")}
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="px-6"
                onClick={() => router.back()}
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

export default AdminJobApplicationForm;
