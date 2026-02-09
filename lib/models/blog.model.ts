import mongoose, { Document, Schema } from "mongoose";

export interface IBlog extends Document {
  _id: string;
  image: string;
  user: string;
  date: string;
  heading: string;
  description: string;
  category: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords?: string;
}

export type IBlogInput = Omit<IBlog, keyof Document>;

const blogSchema: Schema = new Schema<IBlog>({
  image: { type: String, required: true },
  user: { type: String, required: true },
  date: { type: String, required: true },
  heading: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  metaTitle: { type: String, required: true },
  metaDescription: { type: String, required: true },
  metaKeywords: { type: String, required: false },
});

export default mongoose.models.Blog ||
  mongoose.model<IBlog>("Blog", blogSchema);
