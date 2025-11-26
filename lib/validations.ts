import { z } from "zod";
import { Path } from "react-hook-form";

export const pdfDataSchema = z.object({
  fileName: z.string(),
  contentType: z.string(),
  data: z.string(),
});

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z
    .string({
      required_error: "Mobile number is required",
    })
    .length(10, {
      message: "Mobile number must be 10 digits long.",
    }),
  pdfData: pdfDataSchema,
});

export const jobApplication = z.object({
  jobTitle: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" }),
  experience: z
    .string()
    .min(1, { message: "Name must be at least 1 characters long" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z
    .string({
      required_error: "Mobile number is required",
    })
    .length(10, {
      message: "Mobile number must be 10 digits long.",
    }),
  pdfData: pdfDataSchema,
});

export const blogSchema = z.object({
  _id: z.string().optional(),
  image: z.string().min(1, "Image is required."),
  user: z.string().min(2, "User name is too short."),
  date: z.string().min(1, "Please enter a valid date."),
  heading: z.string().min(1, "Please enter a heading."),
  description: z
    .string()
    .min(10, "Description should be at least 10 characters."),
  category: z.string().min(2, "Please enter a proper category"),
  metaTitle: z.string().min(1, "Meta title is required."),
  metaDescription: z.string().min(1, "Meta description is required."),
  metaKeywords: z.string().optional(),
});

// * Zod schema for job form
export const jobSchema = z.object({
  company: z.string().min(1, "Company name is required"),
  title: z.string().min(1, "Job title is required"),
  stateCode: z.string().min(1, "State is required"),
  cityName: z.string().min(1, "City is required"),
  deadline: z.string().min(1, "Deadline is required"),
  salaryMin: z.string().min(1, "Minimum salary is required"),
  salaryMax: z.string().min(1, "Maximum salary is required"),
  description: z.string().min(1, "Description is required"),
  requirements: z.array(z.string()),
  isActive: z.boolean(),
  jobType: z.array(z.string()).min(1, "Select at least one job type"),
});

// * company schema
export const companySchema = z.object({
  name: z.string().min(2, "Company name is too short"),
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .min(2, { message: "Email is too short" }),
  phone: z
    .string({
      required_error: "Mobile number is required",
    })
    .length(10, {
      message: "Mobile number must be 10 digits long.",
    }),
  address: z.string(),
  companyType: z.string(),
});

// * Personal Details Schema
const personalDetailsSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" }),
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .min(1, { message: "Email is required" }),
  phone: z
    .string({
      required_error: "Mobile number is required",
    })
    .length(10, {
      message: "Mobile number must be 10 digits long.",
    }),
  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters long" }),
});

// * Educational Details Schema
const educationalDetailsSchema = z.object({
  degree: z
    .string()
    .min(2, { message: "Degree must be at least 2 characters long" }),
  graduationYear: z
    .string()
    .regex(/^\d{4}$/, { message: "Please enter a valid graduation year" }),
  university: z
    .string()
    .min(2, { message: "University name must be at least 2 characters long" }),
});

// * Professional Details Schema (including PDF)
const professionalDetailsSchema = z.object({
  experience: z
    .string()
    .min(1, { message: "Experience must be at least 1 characters long" }),
  resumeType: z.enum(["general"]).default("general"),
  pdfData: pdfDataSchema,
});

// * Complete Resume Form Schema
export const resumeFormSchema = z.object({
  personalDetails: personalDetailsSchema,
  educationalDetails: educationalDetailsSchema,
  professionalDetails: professionalDetailsSchema,
});

// * Type for the form data
export type ResumeFormData = z.infer<typeof resumeFormSchema>;

// * Updated validate step function with proper typing
export const validateStep = (
  data: ResumeFormData,
  step: number
): { valid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  try {
    switch (step) {
      case 1:
        personalDetailsSchema.parse(data.personalDetails);
        break;
      case 2:
        educationalDetailsSchema.parse(data.educationalDetails);
        break;
      case 3:
        professionalDetailsSchema.parse(data.professionalDetails);
        break;
      default:
        return { valid: false, errors: { form: "Invalid step" } };
    }
    return { valid: true, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      error.errors.forEach((err) => {
        // * Get the full path for nested fields
        const path = err.path.join(".");
        errors[path] = err.message;
      });
    }
    return { valid: false, errors };
  }
};

// * Add this helper type to map error paths to form fields
export const mapErrorToFormField = (
  error: string,
  step: number
): Path<ResumeFormData> => {
  // * Map the error path to the correct nested form field path
  switch (step) {
    case 1:
      return `personalDetails.${error}` as Path<ResumeFormData>;
    case 2:
      return `educationalDetails.${error}` as Path<ResumeFormData>;
    case 3:
      return `professionalDetails.${error}` as Path<ResumeFormData>;
    default:
      return error as Path<ResumeFormData>;
  }
};

//! vacancy job schema
// * Personal Details Schema
const jobPersonalDetailsSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" }),
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .min(1, { message: "Email is required" }),
  phone: z
    .string({
      required_error: "Mobile number is required",
    })
    .length(10, {
      message: "Mobile number must be 10 digits long.",
    }),
  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters long" }),
});

// * Educational Details Schema
const jobEducationalDetailsSchema = z.object({
  degree: z
    .string()
    .min(2, { message: "Degree must be at least 2 characters long" }),
  graduationYear: z
    .string()
    .regex(/^\d{4}$/, { message: "Please enter a valid graduation year" }),
  university: z
    .string()
    .min(2, { message: "University name must be at least 2 characters long" }),
});

// * Professional Details Schema (including PDF)
const jobProfessionalDetailsSchema = z.object({
  experience: z
    .string()
    .min(1, { message: "Experience must be at least 1 characters long" }),
  resumeType: z.enum(["vacancy"]).default("vacancy"),
  pdfData: pdfDataSchema,
});

// * Complete Resume Form Schema
export const jobResumeFormSchema = z.object({
  personalDetails: jobPersonalDetailsSchema,
  educationalDetails: jobEducationalDetailsSchema,
  professionalDetails: jobProfessionalDetailsSchema,
  jobTitle: z.string(),
});

// * Type for the form data
export type jobResumeFormData = z.infer<typeof jobResumeFormSchema>;

// * Updated validate step function with proper typing
export const jobValidateStep = (
  data: jobResumeFormData,
  step: number
): { valid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  try {
    switch (step) {
      case 1:
        jobPersonalDetailsSchema.parse(data.personalDetails);
        break;
      case 2:
        jobEducationalDetailsSchema.parse(data.educationalDetails);
        break;
      case 3:
        jobProfessionalDetailsSchema.parse(data.professionalDetails);
        break;
      default:
        return { valid: false, errors: { form: "Invalid step" } };
    }
    return { valid: true, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      error.errors.forEach((err) => {
        // * Get the full path for nested fields
        const path = err.path.join(".");
        errors[path] = err.message;
      });
    }
    return { valid: false, errors };
  }
};

// * Add this helper type to map error paths to form fields
export const mapJobErrorToFormField = (
  error: string,
  step: number
): Path<jobResumeFormData> => {
  // * Map the error path to the correct nested form field path
  switch (step) {
    case 1:
      return `jobPersonalDetailsSchema.${error}` as Path<jobResumeFormData>;
    case 2:
      return `jobEducationalDetailsSchema.${error}` as Path<jobResumeFormData>;
    case 3:
      return `jobProfessionalDetailsSchema.${error}` as Path<jobResumeFormData>;
    default:
      return error as Path<jobResumeFormData>;
  }
};

//! admin job schema
// * Personal Details Schema
const AdminJobPersonalDetailsSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" }),
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .min(1, { message: "Email is required" }),
  phone: z
    .string({
      required_error: "Mobile number is required",
    })
    .length(10, {
      message: "Mobile number must be 10 digits long.",
    }),
  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters long" }),
});

// * Educational Details Schema
const AdminJobEducationalDetailsSchema = z.object({
  degree: z
    .string()
    .min(2, { message: "Degree must be at least 2 characters long" }),
  graduationYear: z
    .string()
    .regex(/^\d{4}$/, { message: "Please enter a valid graduation year" }),
  university: z
    .string()
    .min(2, { message: "University name must be at least 2 characters long" }),
});

// * Professional Details Schema (including PDF)
const AdminJobProfessionalDetailsSchema = z.object({
  experience: z
    .string()
    .min(1, { message: "Experience must be at least 1 characters long" }),
  resumeType: z.enum(["admin"]).default("admin"),
  pdfData: pdfDataSchema,
});

// * Complete Resume Form Schema
export const AdminJobResumeFormSchema = z.object({
  personalDetails: AdminJobPersonalDetailsSchema,
  educationalDetails: AdminJobEducationalDetailsSchema,
  professionalDetails: AdminJobProfessionalDetailsSchema,
  jobTitle: z.string(),
});

// * Type for the form data
export type AdminJobResumeFormData = z.infer<typeof AdminJobResumeFormSchema>;

// * Updated validate step function with proper typing
export const AdminJobValidateStep = (
  data: AdminJobResumeFormData,
  step: number
): { valid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  try {
    switch (step) {
      case 1:
        AdminJobPersonalDetailsSchema.parse(data.personalDetails);
        break;
      case 2:
        AdminJobEducationalDetailsSchema.parse(data.educationalDetails);
        break;
      case 3:
        AdminJobProfessionalDetailsSchema.parse(data.professionalDetails);
        break;
      default:
        return { valid: false, errors: { form: "Invalid step" } };
    }
    return { valid: true, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      error.errors.forEach((err) => {
        // * Get the full path for nested fields
        const path = err.path.join(".");
        errors[path] = err.message;
      });
    }
    return { valid: false, errors };
  }
};

// * Add this helper type to map error paths to form fields
export const mapAdminJobErrorToFormField = (
  error: string,
  step: number
): Path<AdminJobResumeFormData> => {
  // * Map the error path to the correct nested form field path
  switch (step) {
    case 1:
      return `AdminJobPersonalDetailsSchema.${error}` as Path<AdminJobResumeFormData>;
    case 2:
      return `AdminJobEducationalDetailsSchema.${error}` as Path<AdminJobResumeFormData>;
    case 3:
      return `AdminJobProfessionalDetailsSchema.${error}` as Path<AdminJobResumeFormData>;
    default:
      return error as Path<AdminJobResumeFormData>;
  }
};
