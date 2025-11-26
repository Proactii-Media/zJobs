import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "./ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { contactSchema } from "@/lib/validations";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { z } from "zod";
import Image from "next/image";

type ContactFormData = z.infer<typeof contactSchema>;

const ResumeUpload = () => {
  // * useStates
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfError, setPdfError] = useState<string>("");

  // * hooks
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      pdfData: {
        fileName: "",
        contentType: "",
        data: "",
      },
    },
  });

  // * functions
  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setPdfError("");

    try {
      if (!pdfFile) {
        setPdfError("Please upload a PDF file");
        return;
      }

      // Convert PDF to base64 and structure the data
      const reader = new FileReader();

      const pdfData = await new Promise<{
        fileName: string;
        contentType: string;
        data: string;
      }>((resolve, reject) => {
        reader.onloadend = () => {
          const base64Data = reader.result?.toString().split(",")[1] || "";
          resolve({
            fileName: pdfFile.name,
            contentType: pdfFile.type,
            data: base64Data,
          });
        };
        reader.onerror = reject;
        reader.readAsDataURL(pdfFile);
      });

      const formData = {
        ...data,
        pdfData,
      };

      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit form");
      }

      const result = await response.json();
      console.log("User created:", result);
      setIsDialogOpen(false);
      form.reset();
      setPdfFile(null);
    } catch (error) {
      console.error("Error submitting form:", error);
      setPdfError(
        error instanceof Error ? error.message : "Failed to submit form"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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

  return (
    <div className="sm:block hidden">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="bg-indigo-900 hover:bg-indigo-950 text-white px-4 py-2 rounded transition-transform duration-500 ease-in-out hover:translate-y-[-2px]">
            Upload Resume
          </Button>
        </DialogTrigger>

        <DialogContent className="bg-indigo-900 border-none sm:max-w-[800px] text-white">
          <div className="flex flex-col sm:flex-row">
            <div className="w-full sm:w-1/2 p-4 flex items-center justify-center">
              <Image
                src="/images/upload-resume.png"
                height={500}
                width={500}
                alt="contact-us"
                className="object-contain w-full"
              />
            </div>
            <div className="w-full sm:w-1/2 p-4 bg-white rounded-xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold mb-4 text-black">
                  Get A <span className="text-blue-1">Call Back</span> From Us
                </DialogTitle>
              </DialogHeader>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black">Name</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            {...field}
                            placeholder="Enter your name"
                            className={`w-full border p-2 rounded transition focus:border-blue-1 text-black ${
                              form.formState.errors.name
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                          />
                        </FormControl>
                        <FormMessage>
                          {form.formState.errors.name?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black">Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            {...field}
                            placeholder="Enter your email"
                            className={`w-full border p-2 rounded transition focus:border-blue-1 text-black ${
                              form.formState.errors.email
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                          />
                        </FormControl>
                        <FormMessage>
                          {form.formState.errors.email?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black">Phone</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            {...field}
                            placeholder="Enter your Phone Number"
                            className={`w-full border p-2 rounded transition focus:border-blue-1 text-black ${
                              form.formState.errors.phone
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                          />
                        </FormControl>
                        <FormMessage>
                          {form.formState.errors.phone?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />

                  <FormItem>
                    <FormLabel className="text-black">Upload Resume</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        className="w-full border p-2 rounded transition focus:border-blue-1 text-black"
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

                  <div className="flex justify-end gap-4">
                    <Button
                      type="submit"
                      className="bg-indigo-900 text-white px-4 py-2 rounded"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Submit"}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResumeUpload;
