// models/EducationDegree.ts
import mongoose, { Schema, Document } from "mongoose";

interface EducationDegree extends Document {
  degree: string;
}

const educationDegreeSchema: Schema = new Schema({
  degree: { type: String, required: true, unique: true },
});

const EducationMasterModel =
  mongoose.models.EducationDegree ||
  mongoose.model<EducationDegree>("EducationDegree", educationDegreeSchema);

export default EducationMasterModel;
