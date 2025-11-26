import React from "react";
import { Loader } from "lucide-react"; // Importing Loader icon from Lucide

const Loading: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <Loader className="animate-spin h-10 w-10 text-blue-500" />
      <p className="mt-4 text-lg text-gray-700">Loading...</p>
    </div>
  );
};

export default Loading;
