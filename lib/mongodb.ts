
import mongoose from "mongoose";

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URL) {
    throw new Error("Missing MongoDB URL");
  }

  try {
    // Reuse existing connection
    if (mongoose.connection.readyState === 1) {
      console.log("MongoDB already connected");
      return;
    }

await mongoose.connect(process.env.MONGODB_URL!, {
  serverSelectionTimeoutMS: 30000,
});

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};
