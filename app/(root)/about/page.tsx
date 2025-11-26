"use client";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Eye, BarChart3, Lightbulb } from "lucide-react";
import Image from "next/image";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

const AboutUsPage = () => {
  // Create animation controls for each section
  const missionControls = useAnimation();
  const visionControls = useAnimation();
  const valuesControls = useAnimation();

  // Set up intersection observers for each section
  const [missionRef, missionInView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });
  const [visionRef, visionInView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });
  const [valuesRef, valuesInView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5, staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  };

  // Handle animations when sections come into view
  useEffect(() => {
    if (missionInView) {
      missionControls.start("visible");
    }
  }, [missionInView, missionControls]);

  useEffect(() => {
    if (visionInView) {
      visionControls.start("visible");
    }
  }, [visionInView, visionControls]);

  useEffect(() => {
    if (valuesInView) {
      valuesControls.start("visible");
    }
  }, [valuesInView, valuesControls]);

  return (
    <section className="min-h-screen">
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
                <BreadcrumbPage>About Us</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Hero Section */}
      <motion.div
        className="flex flex-col items-center justify-center py-16 bg-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl font-semibold text-neutral-700">About Us</h1>
        <p className="py-4 text-xl text-neutral-600">
          Choose the right Candidate
        </p>
      </motion.div>

      {/* Company Introduction */}
      <motion.div
        className="container max-w-7xl mx-auto px-4 py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2 className="text-3xl font-semibold mb-6 text-neutral-800">
              Z JOBS
            </h2>
            <p className="text-neutral-600 leading-relaxed">
              Z Jobs prides itself as one of the leaders in human resources
              services company with a focus on providing executive search and
              recruitment services to client organization.
            </p>
            <p className="mt-4 text-neutral-600 leading-relaxed">
              We provide flexible end-to-end solutions that assist companies and
              individuals to meet their objectives by giving the best possible
              service. Established in 2008 by a team of professionals focusing
              on placement services.
            </p>
            <p className="mt-4 text-neutral-600 leading-relaxed">
              We are an effective interface between the professional and
              corporate. if you or your company have been thinking of
              outsourcing the recruiting process we would like to meet with you
              to discuss your future objectives and how our services may be of
              help in obtaining your overall goals.
            </p>
          </motion.div>
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="relative w-full h-full">
              <Image
                src="/images/right-candidate1.jpg"
                alt="image"
                height={600}
                width={600}
                className="h-fit w-fit"
              />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Mission, Vision, Values */}
      <div className="bg-gray-50 py-16">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Mission - Image from right, text from left */}
            <motion.div
              ref={missionRef}
              className="bg-white p-8"
              initial={{ opacity: 0, x: -100 }}
              animate={missionInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-orange-500 text-2xl font-semibold mb-4">
                MISSION
              </h3>
              <p className="text-neutral-600 text-center sm:text-base text-xs">
                To achieve excellence in business and exceed expectations of our
                customers, stakeholders & employees.
              </p>
            </motion.div>
            <motion.div
              className="p-8 flex items-center justify-center"
              initial={{ opacity: 0, x: 100 }}
              animate={missionInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <div className="w-36 h-36 bg-indigo-900 flex items-center justify-center rounded-lg flex-shrink-0">
                <Lightbulb className="w-20 h-20 text-white" />
              </div>
            </motion.div>

            {/* Vision - Image from left, text from right */}
            <motion.div
              className="p-8 flex items-center justify-center"
              initial={{ opacity: 0, x: -100 }}
              animate={visionInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <div className="w-36 h-36 bg-orange-500 flex items-center justify-center rounded-lg flex-shrink-0">
                <Eye className="w-20 h-20 text-white" />
              </div>
            </motion.div>
            <motion.div
              ref={visionRef}
              className="bg-white p-8"
              initial={{ opacity: 0, x: 100 }}
              animate={visionInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-indigo-900 text-2xl font-semibold mb-4">
                VISION
              </h3>
              <p className="text-neutral-600 text-center sm:text-base text-xs">
                To be a leader in Staffing for Small, Medium & Large
                organizations.
              </p>
            </motion.div>

            {/* Values - Image from right, text from left */}
            <motion.div
              ref={valuesRef}
              className="bg-white p-8"
              initial={{ opacity: 0, x: -100 }}
              animate={valuesInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-orange-500 text-2xl font-semibold mb-4">
                VALUES
              </h3>
              <p className="text-neutral-600 text-center sm:text-base text-xs">
                Integrity and Honesty. Our focus is on performance improvement
                by placing the right candidates at the right place at the right
                time & to be a value added partner for our clients.
              </p>
            </motion.div>
            <motion.div
              className="p-8 flex items-center justify-center"
              initial={{ opacity: 0, x: 100 }}
              animate={valuesInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <div className="w-36 h-36 bg-indigo-900 flex items-center justify-center rounded-lg flex-shrink-0">
                <BarChart3 className="w-20 h-20 text-white" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Services & Features */}
      <motion.div
        className="container max-w-7xl mx-auto px-4 py-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-semibold mb-8 text-center">
          Why Choose Z JOBS
        </h2>
        <div className="grid md:grid-cols-2 gap-12">
          {/* Market Position */}
          <div className="flex justify-center items-center">
            <Image
              src="/images/about-us.png"
              alt="Z JOBS Market Position"
              height={800}
              width={800}
              className="rounded-full sm:h-auto sm:w-auto md:h-auto md:w-full"
            />
          </div>

          {/* Features List */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <ul className="space-y-4">
              {[
                "Same Day Salary Disbursement",
                "Systematic induction and joining formalities",
                "Monthly payroll & Tax computation",
                "Salary slips, maintenance of attendance & leave records",
                "Full & Final Settlement with last salary",
                "PF Withdrawal assistance within 45 days of submission of documents",
                "Employees made to sign a document to maintain confidential information",
                "Quick turn-out time to backfill depleted workforce",
                "Monthly Dashboard",
                "100% adherence to statutory compliances",
                "Group Medical & Accidental Policy to all employees",
                "Mass Recruitment support across India",
              ].map((feature, index) => (
                <motion.li
                  key={index}
                  className="flex items-start space-x-3"
                  variants={itemVariants}
                >
                  <div className="w-5 h-5 mt-1 rounded-full bg-orange-500 flex-shrink-0"></div>
                  <span className="text-neutral-600">{feature}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default AboutUsPage;
