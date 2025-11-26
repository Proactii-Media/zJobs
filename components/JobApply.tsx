import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  Send,
} from "lucide-react";
import {
  jobResumeFormData,
  jobResumeFormSchema,
  jobValidateStep,
  mapJobErrorToFormField,
} from "@/lib/validations";
import { fetchDegrees } from "@/lib/actions/educationMaster.actions";

interface JobApplyProps {
  jobTitle?: string;
}

const steps = [
  { title: "Personal Details", fields: ["name", "email", "phone", "address"] },
  {
    title: "Educational Details",
    fields: ["degree", "graduationYear", "university"],
  },
  { title: "Professional Details", fields: ["experience"] },
];

const formVariants = {
  enter: { x: 20, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -20, opacity: 0 },
};

const JobApplicationDialog = ({ jobTitle = "" }: JobApplyProps) => {
  // * useStates
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfError, setPdfError] = useState("");
  const [showValidationAlert, setShowValidationAlert] = useState(false);
  const [degrees, setDegrees] = useState<string[]>([]);

  // * form default values
  const form = useForm<jobResumeFormData>({
    resolver: zodResolver(jobResumeFormSchema),
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
        resumeType: "vacancy",
        pdfData: {
          fileName: "",
          contentType: "",
          data: "",
        },
      },
      jobTitle: jobTitle,
    },
  });

  // * step function for next and previous steps
  const validateCurrentStep = () => {
    const formData = form.getValues();
    const { valid, errors } = jobValidateStep(formData, currentStep);

    if (!valid) {
      Object.entries(errors).forEach(([field, message]) => {
        const formField = mapJobErrorToFormField(field, currentStep);
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

  // * onSubmit
  const onSubmit = async (data: jobResumeFormData) => {
    if (!validateCurrentStep()) return;
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
        jobTitle: jobTitle,
      };

      const response = await fetch("/api/jobApplication", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit form");
      }

      setIsOpen(false);
      form.reset();
      setPdfFile(null);
      setCurrentStep(1);
    } catch (error) {
      console.error("Error:", error);
      setPdfError(
        error instanceof Error ? error.message : "Failed to submit form"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // * pdf file upload handler
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

  useEffect(() => {
    form.setValue("jobTitle", jobTitle);
  }, [jobTitle, form]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 text-white w-full flex items-center justify-center">
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
          >
            Apply Now
            <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.div>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-gradient-to-r from-indigo-600/20 via-transparent to-orange-500/20 shadow-2xl border-0">
        <DialogHeader className="relative">
          <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-orange-500 bg-clip-text text-transparent pb-2">
            Apply for {jobTitle}
          </DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="relative mb-8 mt-4">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200/50 rounded-full -translate-y-1/2" />
          <motion.div
            className="absolute top-1/2 left-0 h-1 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-orange-500 -translate-y-1/2"
            initial={{ width: "0%" }}
            animate={{ width: `${((currentStep - 1) / 2) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
          <div className="relative flex justify-between">
            {steps.map((step, index) => (
              <div key={step.title} className="flex flex-col items-center">
                <motion.div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors duration-300 ${
                    index + 1 <= currentStep
                      ? "border-indigo-600 bg-gradient-to-r from-indigo-400 to-indigo-900 text-white"
                      : "border-slate-300 bg-white text-slate-400"
                  }`}
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {index + 1 <= currentStep ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <Circle className="w-4 h-4" />
                  )}
                </motion.div>
                <span
                  className={`mt-2 text-sm font-medium ${
                    index + 1 <= currentStep
                      ? "bg-gradient-to-r from-indigo-600 to-orange-500 bg-clip-text text-transparent"
                      : "text-slate-400"
                  }`}
                >
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {showValidationAlert && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Alert
                variant="destructive"
                className="mb-4 bg-red-50 border-red-200"
              >
                <AlertDescription className="text-red-800">
                  Please fill in all required fields before proceeding.
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <AnimatePresence mode="wait">
              {/* Step 1: Personal Details */}
              {currentStep === 1 && (
                <motion.div
                  key={currentStep}
                  variants={formVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <FormField
                    control={form.control}
                    name="personalDetails.name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
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
                          <Input {...field} type="email" />
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
                          <Input {...field} type="tel" />
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
                          <Input {...field} />
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
                  key={currentStep}
                  variants={formVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <FormField
                    control={form.control}
                    name="educationalDetails.degree"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Degree</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                            }}
                            {...field}
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
                          <Input {...field} />
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
                          <Input {...field} />
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
                  key={currentStep}
                  variants={formVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <FormField
                    control={form.control}
                    name="professionalDetails.experience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Experience</FormLabel>
                        <FormControl>
                          <Input {...field} />
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
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <motion.div
              className="flex justify-between pt-4 border-t border-slate-200/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {currentStep > 1 && (
                <Button
                  type="button"
                  onClick={prevStep}
                  variant="outline"
                  className="text-slate-600 border-slate-300 hover:bg-slate-50 transition-all duration-300 group"
                >
                  <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                  Previous
                </Button>
              )}
              {currentStep < 3 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="bg-gradient-to-r from-indigo-600 to-orange-500 hover:from-indigo-700 hover:to-orange-600 text-white ml-auto group transition-all duration-300"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-indigo-600 to-orange-500 hover:from-indigo-700 hover:to-orange-600 text-white ml-auto group transition-all duration-300 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="mr-2"
                    >
                      <Circle className="w-4 h-4" />
                    </motion.div>
                  ) : (
                    "Submit Application"
                  )}
                </Button>
              )}
            </motion.div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default JobApplicationDialog;
