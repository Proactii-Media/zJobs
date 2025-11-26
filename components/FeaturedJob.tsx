"use client";
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Star, MapPin, Clock, HelpCircle, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getJobs } from "@/lib/actions/job.actions";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import Loader from "@/components/Loader";

// Define Job interface
interface Job {
  _id: string;
  title: string;
  location: string;
  jobType: string[];
  salaryMin: number;
  salaryMax: number;
  currency: string;
  rating: number;
  posted: string;
  deadline: string;
}

const FeaturedJob = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch jobs
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const fetchedJobs = await getJobs();

      // Sort by rating to get the most highly-rated jobs
      const sortedJobs = fetchedJobs
        .sort((a: Job, b: Job) => b.rating - a.rating)
        .slice(0, 4); // Get top 4 jobs

      setJobs(sortedJobs);
      setError(null);
    } catch (err) {
      setError("Failed to fetch featured jobs");
      console.error("Error fetching featured jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Helper function to format salary
  const formatSalary = (min: number, max: number, currency: string): string => {
    return `${currency}${min.toLocaleString()} - ${currency}${max.toLocaleString()}`;
  };

  // Calculate days left
  const calculateDaysLeft = (deadline: string): string => {
    return formatDistanceToNow(new Date(deadline), { addSuffix: true });
  };

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="flex flex-col justify-center items-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Featured Jobs
            </h2>
            <p className="text-gray-600 text-lg">
              Discover your next career opportunity
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader />
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-8">{error}</div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {jobs.map((job, index) => (
                <motion.div
                  key={job._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="h-full"
                >
                  <Card className="group h-full p-6 transition-all duration-300 hover:shadow-xl hover:border-indigo-600 bg-gradient-to-br from-white to-indigo-50/30 relative overflow-hidden">
                    <Link href={`/find-jobs/${job._id}`}>
                      {/* Decorative Elements */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-500" />
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-100 rounded-full -ml-12 -mb-12 transition-transform group-hover:scale-150 duration-500" />

                      <div className="relative">
                        {/* Header Section */}
                        <div className="flex justify-between items-start gap-4 mb-4">
                          <div className="flex-1 min-w-0">
                            <motion.h3
                              className="text-lg md:text-xl font-semibold mb-2 flex items-center gap-2 truncate text-gray-900"
                              whileHover={{ x: 5 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              {job.title}
                              <motion.span
                                whileHover={{ rotate: 180 }}
                                transition={{ duration: 0.3 }}
                              >
                                <HelpCircle className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                              </motion.span>
                            </motion.h3>

                            <div className="flex items-center text-gray-600 text-sm mb-3 group-hover:text-indigo-600 transition-colors duration-300">
                              <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                              <span className="truncate">{job.location}</span>
                            </div>
                          </div>
                        </div>

                        {/* Job Types */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {job.jobType.map((type, typeIndex) => (
                            <motion.span
                              key={typeIndex}
                              whileHover={{ scale: 1.05 }}
                              className="px-3 py-1 text-xs md:text-sm rounded-full bg-indigo-50 text-indigo-700 border border-transparent hover:border-indigo-200 hover:bg-white transition-all duration-300"
                            >
                              {type}
                            </motion.span>
                          ))}
                        </div>

                        {/* Salary Section */}
                        <div className="flex items-center text-gray-700 mb-4 group-hover:text-indigo-700 transition-colors duration-300">
                          <span className="font-medium">
                            {formatSalary(
                              job.salaryMin,
                              job.salaryMax,
                              job.currency
                            )}
                          </span>
                          <span className="text-gray-400 ml-1">/year</span>
                        </div>

                        {/* Footer Section */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-4 border-t border-gray-100 group-hover:border-indigo-100 transition-colors duration-300">
                          <motion.div
                            className="flex items-center text-sm text-gray-500"
                            whileHover={{ x: 3 }}
                          >
                            <Clock className="w-4 h-4 mr-1" />
                            Posted {formatDistanceToNow(
                              new Date(job.posted)
                            )}{" "}
                            ago
                          </motion.div>

                          <div className="flex items-center gap-4">
                            <motion.div
                              className="flex"
                              whileHover={{ scale: 1.05 }}
                            >
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 transform transition-transform duration-300 group-hover:scale-110 ${
                                    i < job.rating
                                      ? "text-yellow-400"
                                      : "text-gray-200"
                                  }`}
                                  fill={
                                    i < job.rating ? "currentColor" : "none"
                                  }
                                />
                              ))}
                            </motion.div>
                            <motion.span
                              className="text-sm text-gray-500 group-hover:text-indigo-600 transition-colors duration-300"
                              whileHover={{ x: 3 }}
                            >
                              Closes {calculateDaysLeft(job.deadline)}
                            </motion.span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}

          <motion.div
            className="flex items-center justify-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Link href="/find-jobs">
              <Button
                variant="outline"
                className="group px-6 py-3 text-lg font-semibold border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all duration-300"
              >
                View All Jobs
                <ChevronRight
                  size={20}
                  className="ml-2 group-hover:translate-x-2 transition-transform duration-300"
                />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedJob;
