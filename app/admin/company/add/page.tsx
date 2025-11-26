"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormField,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { companySchema } from "@/lib/validations"; // Assuming you'll create this in your validations file
import Link from "next/link";

type CompanyFormData = z.infer<typeof companySchema>;

const AddCompany = () => {
  // States
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hooks
  const router = useRouter();
  const form = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      companyType: "",
    },
  });

  // Submit Handler
  const handleSubmit = async (data: CompanyFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/company", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // Reset form and redirect
        form.reset();
        router.push("/admin/company");
      } else {
        // Handle error responses
        const errorData = await response.json();
        console.error("Failed to submit form:", errorData);
        alert(
          `Failed to submit form: ${
            errorData.error || errorData.errors?.join(", ") || "Unknown error"
          }`
        );
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(
        `Error submitting form: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="sm:px-5 md:px-1 lg:px-2">
      <h1 className="text-black text-2xl font-semibold sm:mb-5 md:mb-2">
        Add Company
      </h1>
      <div className="bg-white border border-gray-300 rounded-xl p-6 text-black">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {/* Company Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter company name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter email address"
                        type="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter phone number"
                        type="tel"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Company Type */}
              <FormField
                control={form.control}
                name="companyType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Type</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter company type" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Address */}
            <div className="mt-4">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter company address" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Submit Button */}
            <div className="flex flex-row gap-5">
              <Button
                type="submit"
                className="text-white px-6 mt-5"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Add Company"}
              </Button>
              <Link href="/admin/company">
                <Button className="px-6 mt-5" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </section>
  );
};

export default AddCompany;
