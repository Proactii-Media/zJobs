import EducationMaster from "@/components/EducationMaster";
import PositionMaster from "@/components/JobPositionMaster";
import React from "react";

const page = () => {
  return (
    <section className="sm:px-5 md:px-1 lg:px-2">
      <h1 className="text-black text-2xl font-semibold sm:mb-5 md:mb-2">
        Master
      </h1>
      <div className="bg-white border border-gray-300 rounded-xl p-6">
        <EducationMaster />
        <PositionMaster />
      </div>
    </section>
  );
};

export default page;
