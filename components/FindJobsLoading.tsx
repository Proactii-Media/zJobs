import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const FindJobsLoading: React.FC = () => {
  return (
    <div className="container max-w-7xl mx-auto px-4 py-6">
      {/* Search box skeleton */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      {/* Job list skeletons */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between mb-4 animate-pulse">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-6 w-12" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FindJobsLoading;
