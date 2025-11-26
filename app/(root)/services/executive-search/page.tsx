"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Search,
  Globe,
  Lock,
  BarChart,
  UserCheck,
  Clock,
  Users,
  Award,
  Target,
} from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Simplified Complex Searches",
    description: "Streamlined process for identifying top executive talent",
  },
  {
    icon: Globe,
    title: "PAN India Closures",
    description: "Extensive reach across all major Indian markets",
  },
  {
    icon: Users,
    title: "Vast Industry Reach",
    description: "Deep connections across diverse industry sectors",
  },
  {
    icon: Lock,
    title: "Confidentiality",
    description: "Ensuring complete discretion throughout the search process",
  },
  {
    icon: BarChart,
    title: "Compensation Benchmarking",
    description: "Data-driven insights for competitive executive packages",
  },
  {
    icon: UserCheck,
    title: "Competency Mapping",
    description: "Thorough assessment of leadership capabilities",
  },
  {
    icon: Clock,
    title: "On-time Closure",
    description: "Efficient and timely placement process",
  },
  {
    icon: Target,
    title: "Vast Talent Pool",
    description: "Access to pre-vetted executive candidates",
  },
  {
    icon: Award,
    title: "A Decade of Excellence",
    description: "Proven track record in executive placements",
  },
];

const page = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-indigo-50 h-14 flex items-center">
        <div className="container max-w-7xl mx-auto px-4">
          <Breadcrumb>
            <BreadcrumbList className="text-sm md:text-base">
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="/"
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="/services"
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  Services
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Executive Search</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Hero Section with Floating Elements */}
      <div className="relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="container max-w-7xl mx-auto px-4 py-16 relative z-10"
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-4xl md:text-5xl font-bold text-indigo-900"
              >
                Executive Search
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-6 text-xl text-indigo-700"
              >
                Specialized recruitment service for senior-level and executive
                positions
              </motion.p>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-4 text-base text-indigo-600/80"
              >
                We at Z JOBS offers tailor-made highly professional and
                high-quality leadership consulting services. With over a
                decade&apos;s presence, we have developed a talent pool of
                professionals from PAN India. Our executive search service
                specializes in recruiting highly qualified candidates for
                senior-level and executive jobs across public and private
                sectors, as well as not-for-profit organizations.
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-3xl transform rotate-3 opacity-20"></div>
              <Image
                src="/images/executive-search.jpg"
                alt="Executive Search"
                width={800}
                height={600}
                className="rounded-2xl shadow-xl relative z-10"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-gradient-to-b from-indigo-50/50 to-white py-16"
      >
        <div className="container max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-indigo-900 text-center mb-12">
            Features of Our Executive Search Service
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-indigo-100/50"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="text-white" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-indigo-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-indigo-600/80">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default page;
