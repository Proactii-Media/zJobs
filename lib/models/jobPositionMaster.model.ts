// lib/models/jobPosition.model.ts
import mongoose, { Schema, Document } from "mongoose";

interface JobPosition extends Document {
  position: string;
}

const jobPositionSchema: Schema = new Schema({
  position: { type: String, required: true, unique: true },
});

const JobPositionMasterModel =
  mongoose.models.JobPosition ||
  mongoose.model<JobPosition>("JobPosition", jobPositionSchema);

export default JobPositionMasterModel;
