"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Star,
  ChevronRight,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { IJob } from "@/lib/models/job.model";
import JobRatingForm from "@/components/JobRatingForm";
import JobApply from "@/components/JobApply";

const MotionCard = motion(Card);

interface JobDescriptionPageProps {
  params: {
    id: string;
  };
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const JobDescriptionPage = ({ params }: JobDescriptionPageProps) => {
  const [job, setJob] = useState<IJob | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(`/api/jobs/${params.id}`);
        const data = await response.json();
        setJob(data);
      } catch (error) {
        console.error("Error fetching job:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-slate-600">Job not found</p>
      </div>
    );
  }

  const formatSalary = (min: number, max: number, currency: string) => {
    return `${currency}${min.toLocaleString()} - ${currency}${max.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb with enhanced hover effects */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-indigo-50 h-14 flex items-center shadow-sm border-b"
      >
        <div className="container max-w-7xl mx-auto px-4">
          <Breadcrumb>
            <BreadcrumbList className="text-sm md:text-base">
              <BreadcrumbItem>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <BreadcrumbLink
                    href="/"
                    className="text-indigo-600 hover:text-indigo-800 transition-colors duration-300"
                  >
                    Home
                  </BreadcrumbLink>
                </motion.div>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <BreadcrumbLink
                    href="/find-jobs"
                    className="text-indigo-600 hover:text-indigo-800 transition-colors duration-300"
                  >
                    Find Jobs
                  </BreadcrumbLink>
                </motion.div>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Job Description</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Job Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header Card */}
            <MotionCard
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/80 backdrop-blur-sm"
            >
              <CardContent className="p-6">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex justify-between items-start"
                >
                  <div>
                    <motion.h1
                      initial={{ x: -20 }}
                      animate={{ x: 0 }}
                      className="text-2xl font-bold text-slate-900 mb-2"
                    >
                      {job.title}
                    </motion.h1>
                    <motion.div
                      whileHover={{ x: 5 }}
                      className="flex items-center gap-2 text-slate-600 mb-4 group"
                    >
                      <MapPin className="w-4 h-4 group-hover:text-indigo-600 transition-colors duration-300" />
                      <span className="group-hover:text-indigo-600 transition-colors duration-300">
                        {job.location}
                      </span>
                    </motion.div>
                  </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {[
                    { icon: Briefcase, text: job.jobType.join(", ") },
                    {
                      icon: DollarSign,
                      text: `${formatSalary(
                        job.salaryMin,
                        job.salaryMax,
                        job.currency
                      )} / year`,
                    },
                    {
                      icon: Calendar,
                      text: `Posted ${formatDistanceToNow(
                        new Date(job.posted)
                      )} ago`,
                    },
                    {
                      icon: Clock,
                      text: `Apply by ${formatDistanceToNow(
                        new Date(job.deadline)
                      )}`,
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ x: 5 }}
                      className="flex items-center gap-2 text-slate-600 group"
                    >
                      <item.icon className="w-4 h-4 group-hover:text-indigo-600 transition-colors duration-300" />
                      <span className="group-hover:text-indigo-600 transition-colors duration-300">
                        {item.text}
                      </span>
                    </motion.div>
                  ))}
                </div>

                <motion.div className="flex flex-wrap gap-2">
                  {job.jobType.map((type) => (
                    <motion.div
                      key={type}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Badge
                        variant="secondary"
                        className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-all duration-300"
                      >
                        {type}
                      </Badge>
                    </motion.div>
                  ))}
                </motion.div>
              </CardContent>
            </MotionCard>

            {/* Job Description Card */}
            <MotionCard
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
              className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/80 backdrop-blur-sm"
            >
              <CardContent className="p-6">
                <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2"
                >
                  <ChevronRight className="w-5 h-5 text-indigo-600" />
                  Job Description
                </motion.h2>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="prose prose-slate max-w-none prose-headings:text-indigo-900 prose-a:text-indigo-600"
                  dangerouslySetInnerHTML={{ __html: job.description }}
                />
              </CardContent>
            </MotionCard>

            {/* Requirements Card */}
            <MotionCard
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.3 }}
              className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/80 backdrop-blur-sm"
            >
              <CardContent className="p-6">
                <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2"
                >
                  <ChevronRight className="w-5 h-5 text-indigo-600" />
                  Requirements
                </motion.h2>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="prose prose-slate max-w-none [&>ul]:list-disc [&>ul]:pl-6 [&>ol]:list-decimal [&>ol]:pl-6"
                  dangerouslySetInnerHTML={{ __html: job.requirements }}
                />
              </CardContent>
            </MotionCard>

            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.4 }}
            >
              <JobRatingForm
                jobId={job._id}
                currentRating={job.rating}
                onRatingSubmit={(newRating: number) => {
                  setJob((prevJob) => {
                    if (!prevJob) return null;
                    return {
                      ...prevJob,
                      rating: newRating,
                    } as IJob;
                  });
                }}
              />
            </motion.div>
          </div>

          {/* Right Column - Apply Now Card */}
          <div className="lg:col-span-1">
            <div className="relative lg:h-[calc(100vh-4rem)]">
              <div className="sticky top-20">
                <motion.div
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.5 }}
                >
                  <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center justify-between mb-6"
                      >
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.6 + i * 0.1 }}
                            >
                              <Star
                                className={`w-5 h-5 ${
                                  i < job.rating
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-300"
                                }`}
                              />
                            </motion.div>
                          ))}
                          <span className="ml-2 text-slate-600">
                            {job.rating.toFixed(1)}
                          </span>
                        </div>
                        <motion.div whileHover={{ scale: 1.05 }}>
                          <Badge
                            variant="secondary"
                            className={`
                          ${
                            job.isActive
                              ? "bg-green-50 text-green-700 border border-green-200"
                              : "bg-red-50 text-red-700 border border-red-200"
                          }
                          transition-all duration-300
                        `}
                          >
                            {job.isActive ? "Active" : "Closed"}
                          </Badge>
                        </motion.div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                      >
                        <JobApply jobTitle={job.title} />
                      </motion.div>

                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="text-center text-sm text-slate-500 mt-4"
                      >
                        Application deadline:
                        <br />
                        <span className="font-medium">
                          {new Date(job.deadline).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </motion.p>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDescriptionPage;
