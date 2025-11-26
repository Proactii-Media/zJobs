"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter, useParams } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import Loader from "@/components/Loader";
import { State, City } from "country-state-city";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  IState as StateType,
  ICity as CityType,
} from "country-state-city/lib/interface";

// Dynamic import for React Quill
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import { jobSchema } from "@/lib/validations";
import { fetchJobPositions } from "@/lib/actions/jobPositionMaster.actions";
import { toast } from "@/hooks/use-toast";
import { CompanySelect } from "@/components/CompanyMaster";

const JOB_TYPES = [
  "Full-time",
  "Part-time",
  "Remote",
  "On-site",
  "Hybrid",
  "Contract",
] as const;

type JobFormData = z.infer<typeof jobSchema>;

const EditJob = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [states, setStates] = useState<StateType[]>([]);
  const [cities, setCities] = useState<CityType[]>([]);
  const [positions, setPositions] = useState<string[]>([]);

  // Get India's country code
  const INDIA_COUNTRY_CODE = "IN";

  const router = useRouter();
  const { id } = useParams();

  const form = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      company: "",
      title: "",
      stateCode: "",
      cityName: "",
      deadline: "",
      salaryMin: "",
      salaryMax: "",
      description: "",
      requirements: [],
      isActive: true,
      jobType: [],
    },
  });

  // Initialize states for India
  useEffect(() => {
    const indianStates = State.getStatesOfCountry(INDIA_COUNTRY_CODE);
    setStates(indianStates);
  }, []);

  // Update cities when state changes
  useEffect(() => {
    if (selectedState) {
      const citiesOfState = City.getCitiesOfState(
        INDIA_COUNTRY_CODE,
        selectedState
      );
      setCities(citiesOfState);
    } else {
      setCities([]);
    }
  }, [selectedState]);

  useEffect(() => {
    form.setValue("jobType", selectedJobTypes, {
      shouldValidate: true,
    });
  }, [selectedJobTypes, form]);

  useEffect(() => {
    const loadPositions = async () => {
      try {
        const fetchedPositions = await fetchJobPositions();
        setPositions(fetchedPositions);
      } catch (error: unknown) {
        console.error(error);
      }
    };

    loadPositions();
  }, []);

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) return;
      try {
        const response = await fetch(`/api/jobs/${id}`);
        if (!response.ok) throw new Error("Failed to fetch job");

        const job = await response.json();

        // Extract state and city from location string
        const locationParts = job.location.split(", ");
        const cityName = locationParts[0];
        const stateName = locationParts[1];

        // Find state code from state name
        const stateObj = states.find((state) => state.name === stateName);
        const stateCode = stateObj?.isoCode || "";

        // Set selected state and city
        setSelectedState(stateCode);
        setSelectedCity(cityName);

        form.reset({
          company: job.company,
          title: job.title,
          stateCode: stateCode,
          cityName: cityName,
          deadline: job.deadline,
          salaryMin: job.salaryMin.toString(),
          salaryMax: job.salaryMax.toString(),
          description: job.description || "",
          requirements: job.requirements || [],
          isActive: job.isActive,
          jobType: job.jobType,
        });

        setSelectedJobTypes(job.jobType);
      } catch (error) {
        console.error("Failed to fetch job:", error);
        alert("Failed to load job data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJob();
  }, [id, form, states]);

  const handleSubmit = async (data: JobFormData) => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      // Get state and city names for location string
      const stateName =
        states.find((state) => state.isoCode === selectedState)?.name || "";
      const cityName = selectedCity;
      const formattedLocation = `${cityName}, ${stateName}, India`;

      const formattedData = {
        ...data,
        location: formattedLocation,
        salaryMin: parseFloat(data.salaryMin),
        salaryMax: parseFloat(data.salaryMax),
        currency: "₹",
      };

      const response = await fetch(`/api/jobs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Job updated successfully",
        });
        router.push("/admin/job");
      } else {
        const errorData = await response.json();
        console.error("Failed to update job:", errorData);
        toast({
          title: "Error",
          description: `Failed to update job: ${
            errorData.error || "Unknown error"
          }`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating job:", error);
      toast({
        title: "Error",
        description: `Error updating job: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleJobTypeChange = (type: string) => {
    setSelectedJobTypes((current) => {
      if (current.includes(type)) {
        return current.filter((t) => t !== type);
      } else {
        return [...current, type];
      }
    });
  };

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
        Edit Job
      </h1>
      <div className="bg-white border border-gray-300 rounded-xl p-6 text-black">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            {/* Job Title */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <CompanySelect
                        value={field.value}
                        onChange={(value) => {
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="title"
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
            </div>

            {/* Location Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              {/* Country (Static - India) */}
              <FormItem>
                <FormLabel>Country</FormLabel>
                <Input value="India" disabled className="bg-gray-50" />
              </FormItem>

              {/* State Dropdown */}
              <FormField
                control={form.control}
                name="stateCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        setSelectedState(value);
                        field.onChange(value);
                        form.setValue("cityName", ""); // Reset city when state changes
                        setSelectedCity(""); // Reset selected city
                      }}
                      value={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select State" />
                      </SelectTrigger>
                      <SelectContent>
                        {states.map((state) => (
                          <SelectItem key={state.isoCode} value={state.isoCode}>
                            {state.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* City Dropdown */}
              <FormField
                control={form.control}
                name="cityName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        setSelectedCity(value);
                        field.onChange(value);
                      }}
                      value={field.value}
                      disabled={!selectedState}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select City" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city.name} value={city.name}>
                            {city.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Rest of the form fields */}
            <div className="mt-4">
              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Application Deadline</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <FormField
                control={form.control}
                name="salaryMin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Salary (₹)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        placeholder="e.g. 500000"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="salaryMax"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Salary (₹)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        placeholder="e.g. 800000"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="jobType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Type</FormLabel>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {JOB_TYPES.map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          {...field}
                          checked={selectedJobTypes.includes(type)}
                          onCheckedChange={() => handleJobTypeChange(type)}
                        />
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          {type}
                        </label>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Description</FormLabel>
                    <FormControl>
                      <ReactQuill
                        theme="snow"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="requirements"
                render={({ field: { onChange, value, ...field } }) => (
                  <FormItem>
                    <FormLabel>Job Requirements</FormLabel>
                    <FormControl>
                      <ReactQuill
                        {...field}
                        theme="snow"
                        value={Array.isArray(value) ? value.join("\n") : ""}
                        onChange={(val) => onChange(val.split("\n"))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 mt-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="!mt-0">Active Job Listing</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-row gap-5">
              <Button
                type="submit"
                className="text-white px-6 mt-5"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update"}
              </Button>
              <Button
                className="px-6 mt-5"
                onClick={() => {
                  router.back();
                }}
                variant="outline"
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

export default EditJob;
