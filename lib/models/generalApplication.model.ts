import mongoose from "mongoose";

// Interface definitions
interface IPdfData {
  fileName: string;
  contentType: string;
  data: string;
}

interface IPersonalDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface IEducationalDetails {
  degree: string;
  graduationYear: string;
  university: string;
}

interface IProfessionalDetails {
  experience: string;
  resumeType: "general";
  pdfData: IPdfData;
}

export interface IGeneralApplication {
  personalDetails: IPersonalDetails;
  educationalDetails: IEducationalDetails;
  professionalDetails: IProfessionalDetails;
}

// Schema definitions
const pdfDataSchema = new mongoose.Schema<IPdfData>({
  fileName: { type: String, required: true },
  contentType: { type: String, required: true },
  data: { type: String, required: true },
});

const personalDetailsSchema = new mongoose.Schema<IPersonalDetails>({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v: string) {
        return /\S+@\S+\.\S+/.test(v);
      },
      message: "Invalid email format",
    },
  },
  phone: { type: String, required: true },
  address: { type: String, required: true },
});

const educationalDetailsSchema = new mongoose.Schema<IEducationalDetails>({
  degree: { type: String, required: true },
  graduationYear: { type: String, required: true },
  university: { type: String, required: true },
});

const professionalDetailsSchema = new mongoose.Schema<IProfessionalDetails>({
  experience: { type: String, required: true },
  resumeType: {
    type: String,
    enum: ["general"],
    default: "general",
    required: true,
  },
  pdfData: { type: pdfDataSchema, required: true },
});

// Main user schema
const userSchema = new mongoose.Schema<IGeneralApplication>(
  {
    personalDetails: { type: personalDetailsSchema, required: true },
    educationalDetails: { type: educationalDetailsSchema, required: true },
    professionalDetails: { type: professionalDetailsSchema, required: true },
  },
  { timestamps: true }
);

// Remove the sparse index and add a normal unique index for email
userSchema.index({ "personalDetails.email": 1 }, { unique: true });

// Pre-save middleware to ensure email is present and valid
userSchema.pre("save", function (next) {
  const email = this.personalDetails.email;

  if (!email) {
    const err = new Error("Email is required");
    return next(err);
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    const err = new Error("Invalid email format");
    return next(err);
  }

  next();
});

// Clean up the collection and recreate index if the model is being redefined
const modelName = "User";
if (mongoose.models[modelName]) {
  delete mongoose.models[modelName];
}

// Export the model
const GeneralApplications = mongoose.model<IGeneralApplication>(
  modelName,
  userSchema
);

export default GeneralApplications;
