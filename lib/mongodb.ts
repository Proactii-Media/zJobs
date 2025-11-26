import mongoose from "mongoose";

let isConnected = false; //! Track the connection status

export const connectToDB = async () => {
  //! Enable strict query mode for Mongoose.
  mongoose.set("strictQuery", true);

  //! Ensure MongoDB URL is available in environment variables.
  if (!process.env.MONGODB_URL) {
    console.error("Missing MongoDB URL");
    throw new Error("Missing MongoDB URL");
  }

  //! If the connection is already established, return.
  if (isConnected) {
    console.log("MongoDB connection already established");
    return;
  }

  try {
    //! Connect to the MongoDB database
    await mongoose.connect(process.env.MONGODB_URL);

    isConnected = true; //! Set the connection status to true
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw new Error("Failed to connect to MongoDB");
  }
};
