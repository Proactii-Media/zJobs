"use client";
import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { clientImages } from "@/constants";
import Image from "next/image";

const Clients = () => {
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
    },
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb Section */}
      <div className="bg-indigo-50 h-14 flex items-center shadow-sm">
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
                <BreadcrumbPage>Clients</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-7xl mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Our Trusted Clients
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            We&apos;re proud to work with industry leaders who trust us with
            their business
          </p>
        </div>

        {/* Clients Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {clientImages.map((client, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="group hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                <div className="p-6">
                  <div className="relative h-40 w-full mb-4 bg-white rounded-lg overflow-hidden">
                    <Image
                      src={client.icon}
                      alt={client.name}
                      fill
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-center text-slate-700 font-medium group-hover:text-indigo-600 transition-colors duration-300">
                    {client.name}
                  </h3>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Clients;
