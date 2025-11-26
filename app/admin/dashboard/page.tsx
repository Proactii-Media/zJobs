"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BriefcaseIcon,
  UsersIcon,
  PencilLine,
  User,
  ActivityIcon,
  RefreshCwIcon,
  Factory,
} from "lucide-react";
import Link from "next/link";
import Loader from "@/components/Loader";

const DashboardPage = () => {
  // State for various data points
  const [dashboardData, setDashboardData] = useState({
    blogCount: 0,
    jobApplicationCount: 0,
    jobCount: 0,
    generalApplicationCount: 0,
    totalCompanyCount: 0,
    loading: true,
  });

  // Fetch data effect
  const fetchData = async () => {
    try {
      setDashboardData((prev) => ({ ...prev, loading: true }));
      const [
        blogRes,
        jobApplicationRes,
        jobRes,
        generalApplicationRes,
        companyDataRes,
      ] = await Promise.all([
        fetch("/api/blog"),
        fetch("/api/jobApplication"),
        fetch("/api/jobs"),
        fetch("/api/generalApplications"),
        fetch("/api/company"),
      ]);

      const blogData = await blogRes.json();
      const jobApplicationData = await jobApplicationRes.json();
      const jobData = await jobRes.json();
      const generalApplicationData = await generalApplicationRes.json();
      const companyData = await companyDataRes.json();

      setDashboardData({
        blogCount: blogData.length,
        jobApplicationCount: jobApplicationData.count,
        jobCount: jobData.length,
        generalApplicationCount: generalApplicationData.length,
        totalCompanyCount: companyData.length,
        loading: false,
      });
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setDashboardData((prev) => ({ ...prev, loading: false }));
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, []);

  // Loader component with Framer Motion
  if (dashboardData.loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-center min-h-screen bg-gray-100"
      >
        <motion.div
          transition={{
            repeat: Infinity,
            duration: 1,
            ease: "linear",
          }}
        >
          <Loader />
        </motion.div>
      </motion.div>
    );
  }

  // Data for Bar Chart and Pie Chart
  const chartData = [
    { name: "Blogs", value: dashboardData.blogCount },
    {
      name: "Total Companies",
      value: dashboardData.totalCompanyCount,
    },
    { name: "Jobs Posted", value: dashboardData.jobCount },
    {
      name: "General Applications",
      value: dashboardData.generalApplicationCount,
    },
    { name: "Job Applications", value: dashboardData.jobApplicationCount },
  ];

  // COLORS for Pie Chart
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF2042"];

  // Overview cards configuration
  const overviewCards = [
    {
      title: "Total Blogs",
      value: dashboardData.blogCount,
      icon: PencilLine,
      route: "/admin/blog",
      color: "text-blue-500",
    },
    {
      title: "Total Companies",
      value: dashboardData.totalCompanyCount,
      icon: Factory,
      route: "/admin/company",
      color: "text-orange-500",
    },
    {
      title: "General Applications",
      value: dashboardData.generalApplicationCount,
      icon: User,
      route: "/admin/generalApplications",
      color: "text-green-500",
    },
    {
      title: "Job Applications",
      value: dashboardData.jobApplicationCount,
      icon: UsersIcon,
      route: "/admin/jobApplications",
      color: "text-purple-500",
    },
    {
      title: "Jobs Posted",
      value: dashboardData.jobCount,
      icon: BriefcaseIcon,
      route: "/admin/job",
      color: "text-red-500",
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 bg-gray-50"
    >
      <div className="flex justify-between items-center mb-6">
        <motion.h1
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-gray-800"
        >
          Dashboard Overview
        </motion.h1>
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={fetchData}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
          >
            <RefreshCwIcon className="h-5 w-5" />
            <span className="text-sm">Refresh</span>
          </motion.button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6 mb-8">
        <AnimatePresence>
          {overviewCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{
                delay: index * 0.1,
                duration: 0.5,
              }}
            >
              <Link
                href={card.route}
                className="hover:scale-105 transition-transform"
              >
                <Card className="h-full shadow-md hover:shadow-lg">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {card.title}
                    </CardTitle>
                    <card.icon className={`h-5 w-5 ${card.color}`} />
                  </CardHeader>
                  <CardContent>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="text-2xl font-bold"
                    >
                      {card.value}
                    </motion.div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Charts Container */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="grid grid-cols-1 gap-8"
      >
        {/* Bar Chart - Simple Comparative View */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center">
              <ActivityIcon className="mr-2 h-5 w-5 text-blue-600" />
              Item Comparison
            </CardTitle>
          </CardHeader>
          <CardContent className="w-full">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="value"
                  fill="#8884d8"
                  animationBegin={0}
                  animationDuration={1500}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart - Distribution of Items */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center">
              <UsersIcon className="mr-2 h-5 w-5 text-purple-600" />
              Item Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={1500}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
    </motion.section>
  );
};

export default DashboardPage;
