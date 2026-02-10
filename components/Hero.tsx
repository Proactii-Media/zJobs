import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  Briefcase,
  Palette,
  Code,
  BookOpen,
  FileText,
  Settings,
  Monitor,
  BarChart,
  Users,
} from "lucide-react";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";

// Type for job suggestion with icon
interface SuggestedJobWithIcon {
  label: string;
  icon: React.ReactNode;
}

// Map suggested jobs to include icons
const suggestedJobsWithIcons: SuggestedJobWithIcon[] = [
  { label: "Designer", icon: <Palette className="mr-2 w-4 h-4" /> },
  { label: "Developer", icon: <Code className="mr-2 w-4 h-4" /> },
  { label: "Tester", icon: <FileText className="mr-2 w-4 h-4" /> },
  { label: "Writing", icon: <BookOpen className="mr-2 w-4 h-4" /> },
  { label: "Project Manager", icon: <Settings className="mr-2 w-4 h-4" /> },
  { label: "Software Engineer", icon: <Monitor className="mr-2 w-4 h-4" /> },
  { label: "Product Manager", icon: <Users className="mr-2 w-4 h-4" /> },
  { label: "Data Analyst", icon: <BarChart className="mr-2 w-4 h-4" /> },
];

const Hero: React.FC = () => {
  const [country, setCountry] = useState<string>("India");
  const [state, setState] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const router = useRouter();

  const handleSearchClick = useCallback(() => {
    const params = new URLSearchParams();

    if (searchTerm.trim()) {
      params.set("search", searchTerm);
    }

    if (state) {
      params.set("state", state);
    }

    router.push(`/find-jobs?${params.toString()}`);
  }, [searchTerm, state, router]);

  // Wave Animation Variants
  const waveVariants = {
    initial: {
      backgroundPosition: "0% 50%",
      filter: "hue-rotate(0deg)",
    },
    animate: {
      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
      filter: [
        "hue-rotate(0deg)",
        "hue-rotate(60deg)",
        "hue-rotate(120deg)",
        "hue-rotate(0deg)",
      ],
      transition: {
        duration: 15,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  // Stagger container variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      y: 50,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 150,
      },
    },
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900">
      {/* Enhanced Animated Wave Background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-[length:400%_400%] opacity-40"
        variants={waveVariants}
        initial="initial"
        animate="animate"
      />

      {/* Layered Background Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.1)_0%,_rgba(0,0,0,0.3)_100%)]" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="min-h-screen flex flex-col justify-center items-center text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-4 text-white"
            variants={itemVariants}
          >
            Discover Your
            <span className="block md:inline bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent md:ml-4 mt-2 md:mt-0">
              Dream Job
            </span>
          </motion.h1>

          {/* Subheader */}
          <motion.p
            className="text-base md:text-xl text-indigo-100 mb-6 md:mb-8 max-w-2xl px-4"
            variants={itemVariants}
          >
            Unlock your potential with personalized job recommendations and
            seamless career exploration.
          </motion.p>

          {/* Search Container */}
          <motion.div
            className="w-full max-w-3xl bg-white/10 backdrop-blur-lg rounded-2xl p-4 md:p-6 border border-white/20 shadow-2xl"
            variants={itemVariants}
          >
            <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_auto] gap-3 md:gap-4">
              {/* Job Search Input */}
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
                <input
                  type="text"
                  placeholder="Search jobs, keywords..."
                  className="w-full pl-8 md:pl-10 pr-4 py-2 md:py-3 text-sm md:text-base rounded-lg bg-white/90 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Country Dropdown */}
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
                <CountryDropdown
                  value={country}
                  onChange={(val) => setCountry(val)}
                  classes="w-full pl-8 md:pl-10 pr-4 py-2 md:py-3 text-sm md:text-base rounded-lg bg-white/90 border border-white/30"
                  defaultOptionLabel="Country"
                />
              </div>

              {/* State Dropdown */}
              <RegionDropdown
                country={country}
                value={state}
                onChange={(val) => setState(val)}
                classes="w-full px-4 py-2 md:py-3 text-sm md:text-base rounded-lg bg-white/90 border border-white/30"
                defaultOptionLabel="State"
              />

              {/* Search Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSearchClick}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 flex items-center justify-center"
              >
                <Search className="w-4 h-4 md:w-5 md:h-5" />
              </motion.button>
            </div>
          </motion.div>

          {/* Suggested Jobs */}
          <motion.div
            className="mt-6 md:mt-8 flex flex-wrap justify-center gap-2 md:gap-4 px-4"
            variants={containerVariants}
          >
            {suggestedJobsWithIcons.map((job) => (
              <motion.button
                key={job.label}
                variants={itemVariants}
                className="flex items-center bg-white/10 text-white px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm rounded-full hover:bg-white/20 transition"
                onClick={() => setSearchTerm(job.label)}
              >
                {job.icon}
                {job.label}
              </motion.button>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
