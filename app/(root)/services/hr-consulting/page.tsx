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
  BarChart2,
  Settings,
  Cpu,
  Users,
  TrendingUp,
  Shield,
  Target,
  GitBranch,
  FileText,
  Lightbulb,
  Award,
  Zap,
} from "lucide-react";

const services = [
  {
    icon: BarChart2,
    title: "Strategic HR Alignment",
    description:
      "Align HR initiatives with your business objectives for maximum impact and growth",
  },
  {
    icon: Settings,
    title: "Process Optimization",
    description:
      "Implement industry best practices to enhance HR operational efficiency",
  },
  {
    icon: Cpu,
    title: "HR Tech Integration",
    description:
      "Deploy modern HR technology solutions to streamline and simplify processes",
  },
  {
    icon: Users,
    title: "Capability Assessment",
    description:
      "Comprehensive evaluation of human capabilities and skill gap analysis",
  },
  {
    icon: TrendingUp,
    title: "Performance Management",
    description:
      "Design and implement effective performance measurement systems",
  },
  {
    icon: Shield,
    title: "Succession Planning",
    description:
      "Build robust business contingency plans through strategic succession management",
  },
  {
    icon: Target,
    title: "Reward Systems",
    description:
      "Develop competitive compensation strategies to attract and retain top talent",
  },
  {
    icon: Zap,
    title: "Incentive Planning",
    description:
      "Create customized incentive programs that drive business growth",
  },
  {
    icon: GitBranch,
    title: "Organizational Design",
    description:
      "Optimize organizational structure for improved efficiency and effectiveness",
  },
  {
    icon: FileText,
    title: "Policy Development",
    description:
      "Design and implement comprehensive HR policies aligned with business goals",
  },
  {
    icon: Lightbulb,
    title: "Innovation Culture",
    description: "Foster a culture of continuous improvement and innovation",
  },
  {
    icon: Award,
    title: "Employee Experience",
    description:
      "Enhance workplace satisfaction and engagement through strategic initiatives",
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
                <BreadcrumbPage>HR Consulting</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Hero Section */}
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
                HR Consulting & Advisory
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-6 text-xl text-indigo-700"
              >
                Transform your HR function into a strategic business partner
              </motion.p>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-4 text-base text-indigo-600/80"
              >
                At Z JOBS, we provide comprehensive HR consulting services that
                help organizations optimize their human resource practices and
                align them with business objectives. Our expert consultants work
                closely with you to develop tailored solutions that enhance
                operational efficiency, improve employee engagement, and drive
                business growth. From strategic planning to policy
                implementation, we ensure your HR function becomes a key
                contributor to your organization&apos;s success.
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
                src="/images/hr-consulting.jpg"
                alt="HR Consulting"
                width={800}
                height={600}
                className="rounded-2xl shadow-xl relative z-10"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Services Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-gradient-to-b from-indigo-50/50 to-white py-16"
      >
        <div className="container max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-indigo-900 text-center mb-12">
            Our HR Consulting Services
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
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
                    {service.title}
                  </h3>
                  <p className="text-indigo-600/80">{service.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Additional Value Proposition */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white py-16"
      >
        <div className="container max-w-7xl mx-auto px-4">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-8 md:p-12 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Why Choose Our HR Consulting Services?
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="mb-4">
                  Our team of experienced HR consultants brings industry-leading
                  expertise to help you:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    Optimize HR operations and reduce costs
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    Improve employee engagement and retention
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    Ensure compliance with latest regulations
                  </li>
                </ul>
              </div>
              <div>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    Drive strategic organizational change
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    Implement best-in-class HR practices
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    Develop future-ready HR strategies
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default page;
