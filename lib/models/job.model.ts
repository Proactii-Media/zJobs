import mongoose, { Document } from "mongoose";

export interface IJob extends Document {
  _id: string;
  company: string;
  title: string;
  stateCode: string;
  cityName: string;
  location: string; // Computed field for full location string
  salaryMin: number;
  salaryMax: number;
  currency: string;
  jobType: string[];
  description: string;
  requirements: string[];
  posted: string;
  deadline: string;
  rating: number;
  isActive: boolean;
}

export interface IJobInput {
  company: string;
  title: string;
  stateCode: string;
  cityName: string;
  location: string;
  salaryMin: number;
  salaryMax: number;
  currency: string;
  jobType: string[];
  description: string;
  requirements: string[];
  posted: string;
  deadline: string;
  rating: number;
  isActive: boolean;
}

const jobSchema = new mongoose.Schema<IJob>(
  {
    company: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    stateCode: {
      type: String,
      required: true,
    },
    cityName: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    salaryMin: {
      type: Number,
      required: true,
    },
    salaryMax: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
      default: "₹",
      enum: ["₹"], // Only allowing Rupees
    },
    jobType: [
      {
        type: String,
        required: true,
        enum: [
          "Full-time",
          "Part-time",
          "Remote",
          "On-site",
          "Hybrid",
          "Contract",
        ],
      },
    ],
    description: {
      type: String,
      required: true,
    },
    requirements: [
      {
        type: String,
        required: true,
      },
    ],
    posted: {
      type: String,
      required: true,
    },
    deadline: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
      max: 5,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Job || mongoose.model<IJob>("Job", jobSchema);
