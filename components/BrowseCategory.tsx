import React from "react";
import { ArrowRight } from "lucide-react";
import { jobCategories } from "@/constants";
import Link from "next/link";

const BrowseCategory = () => {
  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Browse by category
              </h2>
              <p className="text-gray-600 mt-2">
                Recruitment Made Easy in 100 seconds
              </p>
            </div>
            <Link
              href="/find-jobs"
              className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              All Categories
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {jobCategories.map((category) => (
              <div
                key={category.title}
                className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 group hover:bg-indigo-900 cursor-pointer"
              >
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-white transition-colors duration-300 mb-2">
                  {category.title}
                </h3>
                <p className="text-gray-500 text-sm mb-4 group-hover:text-white/80 transition-colors duration-300">
                  {category.jobs}
                </p>
                <Link
                  href="/find-jobs"
                  className="text-indigo-600 group-hover:text-white flex items-center gap-1 text-sm font-medium transition-all duration-300"
                >
                  Explore Jobs
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform duration-300"
                  />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrowseCategory;
