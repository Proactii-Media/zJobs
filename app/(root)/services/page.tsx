"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Users,
  UserPlus,
  Calculator,
  Search,
  HeartHandshake,
} from "lucide-react";
import Link from "next/link";

const services = [
  {
    id: 1,
    title: "Contract Staffing",
    description:
      "Flexible workforce solutions to meet your temporary and project-based staffing needs",
    icon: Users,
    color: "bg-cyan-400",
    textColor: "text-cyan-950",
    shadowColor: "shadow-cyan-200",
    route: "/services/contract-staffing",
  },
  {
    id: 2,
    title: "Permanent Recruitment",
    description:
      "End-to-end recruitment solutions for building your permanent workforce",
    icon: UserPlus,
    color: "bg-blue-400",
    textColor: "text-blue-950",
    shadowColor: "shadow-blue-200",
    route: "/services/permanent-recruitment",
  },
  {
    id: 3,
    title: "Payroll Management",
    description:
      "Comprehensive payroll solutions to streamline your HR operations",
    icon: Calculator,
    color: "bg-indigo-400",
    textColor: "text-indigo-950",
    shadowColor: "shadow-indigo-200",
    route: "/services/payroll-management",
  },
  {
    id: 4,
    title: "Executive Search",
    description:
      "Strategic talent acquisition for senior and executive positions",
    icon: Search,
    color: "bg-purple-400",
    textColor: "text-purple-950",
    shadowColor: "shadow-purple-200",
    route: "/services/executive-search",
  },
  {
    id: 5,
    title: "HR Consulting & Advisory",
    description: "Expert guidance on HR strategy, policies, and best practices",
    icon: HeartHandshake,
    color: "bg-pink-400",
    textColor: "text-pink-950",
    shadowColor: "shadow-pink-200",
    route: "/services/hr-consulting",
  },
];

const ServicesPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
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
                <BreadcrumbPage>Services</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center justify-center py-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-indigo-900 text-center">
          Creative <span className="text-orange-600">Solutions</span> We Provide
        </h1>
        <p className="mt-6 text-xl text-indigo-700 max-w-2xl text-center px-4">
          Empowering organizations through innovative HR solutions and expert
          talent management
        </p>
        <p className="mt-4 text-base text-indigo-600/80 max-w-3xl text-center px-4">
          In today&apos;s world, only technology and capital do not provide a
          competitive edge. The next frontier of competitive advantage is Talent
          and People. Team HR helps organizations develop, re-design and deploy
          HR systems and processes.
        </p>
      </motion.div>

      {/* Services Grid - Redesigned */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container max-w-7xl mx-auto px-4 py-8 relative"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.id}
                variants={itemVariants}
                className="relative group"
              >
                <Link href={service.route}>
                  <div
                    className={`
                    relative rounded-2xl overflow-hidden p-6
                    ${service.color} group-hover:scale-[1.02]
                    transition-all duration-300 ease-out
                    shadow-lg ${service.shadowColor}
                    border border-white/20 backdrop-blur-sm
                  `}
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                    <div className="relative z-10">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 bg-white/90 rounded-xl flex items-center justify-center">
                          <Icon className={`${service.textColor}`} size={24} />
                        </div>
                        <span className="text-3xl font-bold text-white/90">
                          {service.id}
                        </span>
                      </div>
                      <h3 className="text-2xl font-semibold text-white mb-3">
                        {service.title}
                      </h3>
                      <p className="text-white/90 text-sm leading-relaxed">
                        {service.description}
                      </p>

                      <div className="mt-6 flex items-center text-white/90 text-sm font-medium">
                        <span className="group-hover:mr-4 transition-all duration-300">
                          Learn more
                        </span>
                        <svg
                          className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform duration-300"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
};

export default ServicesPage;
