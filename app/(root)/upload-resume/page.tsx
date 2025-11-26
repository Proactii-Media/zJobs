"use client";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  mapErrorToFormField,
  resumeFormSchema,
  validateStep,
  type ResumeFormData,
} from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, Circle } from "lucide-react";
import { fetchDegrees } from "@/lib/actions/educationMaster.actions";

const steps = [
  { title: "Personal Details", fields: ["name", "email", "phone", "address"] },
  {
    title: "Educational Details",
    fields: ["degree", "graduationYear", "university"],
  },
  { title: "Professional Details", fields: ["experience"] },
];

const GeneralResume = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfError, setPdfError] = useState<string>("");
  const [showValidationAlert, setShowValidationAlert] = useState(false);
  const [degrees, setDegrees] = useState<string[]>([]);

  const form = useForm<ResumeFormData>({
    resolver: zodResolver(resumeFormSchema),
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
        resumeType: "general",
        pdfData: {
          fileName: "",
          contentType: "",
          data: "",
        },
      },
    },
  });

  const validateCurrentStep = () => {
    const formData = form.getValues();
    const { valid, errors } = validateStep(formData, currentStep);

    if (!valid) {
      Object.entries(errors).forEach(([field, message]) => {
        // Use the helper function to map the error to the correct form field path
        const formField = mapErrorToFormField(field, currentStep);
        form.setError(formField, {
          type: "manual",
          message,
        });
      });
      setShowValidationAlert(true);
      setTimeout(() => setShowValidationAlert(false), 3000);
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const onSubmit = async (data: ResumeFormData) => {
    if (!validateCurrentStep()) return;
    setIsSubmitting(true);
    setPdfError("");

    try {
      if (!pdfFile) {
        setPdfError("Please upload a PDF file");
        setIsSubmitting(false);
        return;
      }

      // Read PDF file
      const reader = new FileReader();
      const pdfData = await new Promise<string>((resolve, reject) => {
        reader.onloadend = () => {
          const base64Data = reader.result?.toString().split(",")[1] || "";
          resolve(base64Data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(pdfFile);
      });

      // Prepare the complete form data
      const formData = {
        personalDetails: {
          name: data.personalDetails.name,
          email: data.personalDetails.email,
          phone: data.personalDetails.phone,
          address: data.personalDetails.address,
        },
        educationalDetails: {
          degree: data.educationalDetails.degree,
          graduationYear: data.educationalDetails.graduationYear,
          university: data.educationalDetails.university,
        },
        professionalDetails: {
          experience: data.professionalDetails.experience,
          resumeType: "general" as const,
          pdfData: {
            fileName: pdfFile.name,
            contentType: pdfFile.type,
            data: pdfData,
          },
        },
      };

      const response = await fetch("/api/generalApplications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit form");
      }

      // Reset form on success
      form.reset();
      setPdfFile(null);
      setCurrentStep(1);
      // Add success message or redirect here
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

        setDegrees(fetchedDegrees);
      } catch (error: unknown) {
        console.error("Error fetching degrees:", error);
      }
    };

    loadDegrees();
  }, []);

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-orange-50 p-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-32 -left-32 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 -right-32 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto relative">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.h1
            className="text-5xl font-bold bg-gradient-to-r from-indigo-900 via-indigo-700 to-orange-600 bg-clip-text text-transparent mb-4"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            Upload Your Resume
          </motion.h1>
          <motion.p
            className="text-lg text-slate-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Complete your professional profile in three simple steps
          </motion.p>
        </motion.div>

        {/* Enhanced Progress Steps */}
        <div className="mb-16 relative">
          <div className="absolute top-1/2 left-0 w-full h-1.5 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 rounded-full -translate-y-1/2" />
          <div
            className="absolute top-1/2 left-0 h-1.5 bg-gradient-to-r from-indigo-600 via-indigo-800 to-orange-500 rounded-full -translate-y-1/2 transition-all duration-500"
            style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
          />
          <div className="relative flex justify-between">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <motion.div
                  className={`flex items-center justify-center w-14 h-14 rounded-full border-2 shadow-lg ${
                    index + 1 <= currentStep
                      ? "border-indigo-600 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white"
                      : "border-slate-300 bg-white text-slate-400"
                  } transition-colors duration-300`}
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {index + 1 <= currentStep ? (
                    <CheckCircle2 className="w-7 h-7" />
                  ) : (
                    <Circle className="w-7 h-7" />
                  )}
                </motion.div>
                <span
                  className={`mt-3 font-medium text-sm ${
                    index + 1 <= currentStep
                      ? "text-indigo-900"
                      : "text-slate-400"
                  }`}
                >
                  {step.title}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Enhanced Validation Alert */}
        <AnimatePresence>
          {showValidationAlert && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6"
            >
              <Alert
                variant="destructive"
                className="border-l-4 border-red-500 bg-red-50/80 backdrop-blur-sm"
              >
                <AlertDescription className="flex items-center">
                  Please fill in all required fields before proceeding.
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-t-4 border-t-orange-500 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-900 to-orange-600 bg-clip-text text-transparent">
                {steps[currentStep - 1].title}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* Step 1: Personal Details */}
                  {currentStep === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <FormField
                        control={form.control}
                        name="personalDetails.name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700">
                              Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="border-slate-200 h-11 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300"
                              />
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
                            <FormLabel className="text-slate-700">
                              Email
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="email"
                                className="border-slate-200 h-11 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300"
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
                            <FormLabel className="text-slate-700">
                              Phone
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="tel"
                                className="border-slate-200 h-11 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300"
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
                            <FormLabel className="text-slate-700">
                              Address
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="border-slate-200 h-11 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  )}
                  {/* Step 2: Educational Details */}
                  {currentStep === 2 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <FormField
                        control={form.control}
                        name="educationalDetails.degree"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700">
                              Degree
                            </FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={(value) => {
                                  field.onChange(value);
                                }}
                                {...field}
                              >
                                <SelectTrigger className="border-slate-200 h-11 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300">
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
                            <FormLabel className="text-slate-700">
                              Graduation Year
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="border-slate-200 h-11 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300"
                              />
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
                            <FormLabel className="text-slate-700">
                              University
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="border-slate-200 h-11 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  )}

                  {/* Step 3: Professional Details */}
                  {currentStep === 3 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <FormField
                        control={form.control}
                        name="professionalDetails.experience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700">
                              Experience
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="border-slate-200 h-11 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormItem>
                        <FormLabel className="text-slate-700">
                          Upload Resume (PDF)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept="application/pdf"
                            onChange={handleFileChange}
                            className="border-slate-200 h-11 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300"
                          />
                        </FormControl>
                        {pdfError && (
                          <p className="text-red-500 text-sm mt-1">
                            {pdfError}
                          </p>
                        )}
                        {pdfFile && (
                          <p className="text-green-500 text-sm mt-1">
                            Selected file: {pdfFile.name}
                          </p>
                        )}
                      </FormItem>
                    </motion.div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between mt-8 pt-6 border-t border-slate-100">
                    {currentStep > 1 && (
                      <Button
                        type="button"
                        onClick={prevStep}
                        variant="outline"
                        className="text-slate-600 hover:text-slate-700 border-slate-200 hover:bg-slate-50 transition-all duration-300"
                      >
                        Previous
                      </Button>
                    )}
                    {currentStep < 3 ? (
                      <Button
                        type="button"
                        onClick={nextStep}
                        className="bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 text-white ml-auto shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        Next
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white ml-auto shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        {isSubmitting ? "Submitting..." : "Submit"}
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default GeneralResume;
