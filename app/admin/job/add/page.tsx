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
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
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

// Job types
const JOB_TYPES = [
  "Full-time",
  "Part-time",
  "Remote",
  "On-site",
  "Hybrid",
  "Contract",
] as const;

type JobFormData = z.infer<typeof jobSchema>;

const AddJob = () => {
  // States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [states, setStates] = useState<StateType[]>([]);
  const [cities, setCities] = useState<CityType[]>([]);
  const [positions, setPositions] = useState<string[]>([]);

  // Get India's country code
  const INDIA_COUNTRY_CODE = "IN";

  // Hooks
  const router = useRouter();
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

  // Update form values when selectedJobTypes changes
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
        console.error("Error fetching Job Title:", error);
      }
    };

    loadPositions();
  }, []);

  const handleSubmit = async (data: JobFormData) => {
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
        posted: new Date().toISOString(),
      };

      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Job posted successfully",
        });
        form.reset();
        router.push("/admin/job");
      } else {
        const errorData = await response.json();
        console.error("Failed to submit form:", errorData);
        toast({
          title: "Error",
          description: `Failed to submit form: ${
            errorData.error || "Unknown error"
          }`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: `Error submitting form: ${
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

  return (
    <section className="sm:px-5 md:px-1 lg:px-2">
      <h1 className="text-black text-2xl font-semibold sm:mb-5 md:mb-2">
        Add Job
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

            {/* Deadline */}
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

            {/* Salary Information */}
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

            {/* Job Types */}
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

            {/* Description and Requirements */}
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
                        value={Array.isArray(value) ? value.join("\n") : ""} // Join array as a single string
                        onChange={(val) => onChange(val.split("\n"))} // Split string into array on newlines
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Active Status */}
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

            {/* Submit Button */}
            <div className="flex flex-row gap-5">
              <Button
                type="submit"
                className="text-white px-6 mt-5"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
              <Button
                className="px-6 mt-5 "
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

export default AddJob;
