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
  Users,
  Building2,
  TrendingUp,
  Clock,
  Coins,
  Target,
} from "lucide-react";

const benefits = [
  {
    icon: Building2,
    title: "Flexible Workforce",
    description:
      "Scale your team up or down based on project demands and seasonal needs",
  },
  {
    icon: Coins,
    title: "Cost-Effective",
    description:
      "Reduce overhead costs and optimize your staffing budget efficiently",
  },
  {
    icon: Clock,
    title: "Quick Deployment",
    description:
      "Get skilled professionals onboard rapidly for time-sensitive projects",
  },
  {
    icon: Target,
    title: "Core Focus",
    description:
      "Concentrate on your core business while we handle staffing needs",
  },
  {
    icon: TrendingUp,
    title: "Enhanced Productivity",
    description:
      "Access specialized skills when needed to boost project outcomes",
  },
  {
    icon: Users,
    title: "Talent Pool",
    description:
      "Access our vast network of pre-vetted professional contractors",
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
                <BreadcrumbPage>Contract Staffing</BreadcrumbPage>
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
                Contractual Staffing
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-6 text-xl text-indigo-700"
              >
                Z JOBS is one of the leading service providers that manages
                contract staffing.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-4 text-base text-indigo-600/80"
              >
                Contractual employment allows multiple benefits to businesses.
                It not only provides flexible hiring as per the demand of the
                workforce based on the projects or seasonal needs but also
                enables the employer to focus on the areas of core competence.
                This is a massive advantage if we talk in terms of cost-cutting.
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
                src="/images/contract-staffing1.png"
                alt="Contract Staffing"
                width={800}
                height={600}
                className="rounded-2xl shadow-xl relative z-10"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Benefits Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-gradient-to-b from-indigo-50/50 to-white py-16"
      >
        <div className="container max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-indigo-900 text-center mb-12">
            Benefits of Contract Staffing
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
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
                    {benefit.title}
                  </h3>
                  <p className="text-indigo-600/80">{benefit.description}</p>
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
