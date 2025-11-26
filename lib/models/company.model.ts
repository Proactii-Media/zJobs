import mongoose, { Document, Schema } from "mongoose";

interface Company extends Document {
  name: string;
  address: string;
  email: string;
  phone: string;
  companyType: string;
}

const companySchema: Schema = new Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  companyType: { type: String, required: true },
});

const companyModel =
  mongoose.models.Company || mongoose.model<Company>("Company", companySchema);

export default companyModel;
