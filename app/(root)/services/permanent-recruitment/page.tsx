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
  Target,
  Search,
  UserCheck,
  Briefcase,
} from "lucide-react";

const benefits = [
  {
    icon: Search,
    title: "Industry Expertise",
    description:
      "Specialized recruitment across BFSI, IT, Manufacturing, Healthcare, and more",
  },
  {
    icon: UserCheck,
    title: "Multi-Level Hiring",
    description: "Support in hiring from entry level to senior level personnel",
  },
  {
    icon: Building2,
    title: "Sector Coverage",
    description:
      "Experience across Construction, Education, Shipping, and Retail sectors",
  },
  {
    icon: Target,
    title: "Strategic Focus",
    description:
      "Strategic approach to finding the perfect fit for your organization",
  },
  {
    icon: Briefcase,
    title: "Portfolio Services",
    description: "Part of our comprehensive human resources services portfolio",
  },
  {
    icon: Users,
    title: "Experienced Team",
    description:
      "Backed by a team with vast experience in diverse industry sectors",
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
                <BreadcrumbPage>Permanent Recruitment</BreadcrumbPage>
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
                Permanent Recruitment
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-6 text-xl text-indigo-700"
              >
                Z JOBS delivers strategic permanent recruitment solutions across
                diverse industry sectors.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-4 text-base text-indigo-600/80"
              >
                Our permanent recruitment business constitutes a strategically
                important part of our human resources services portfolio. With
                vast experience across BFSI, IT, Manufacturing, Healthcare,
                Construction, Education, Shipping, Retail Sector (e-commerce),
                Sales and services sectors, we excel in matching the right
                talent with your organizational needs.
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
                src="/images/permenant-recruitment.png"
                alt="Permanent Recruitment"
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
            Our Recruitment Expertise
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
