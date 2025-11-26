import React from "react";
import { motion } from "framer-motion";
import { FileCheck, Search, Users, Briefcase, Star, Award } from "lucide-react";

const WhatZjobsDo = () => {
  const features = [
    {
      icon: <Search className="w-6 h-6" />,
      text: "Recruitment is a defining activity for both companies as well as candidates. For companies, it sets the pace & creates the operational horsepower for growth. For individuals, it defines the quality of life.",
      gradientFrom: "from-orange-500",
      gradientTo: "to-orange-600",
      decorativeIcons: [<Briefcase key="1" />, <Star key="2" />],
    },
    {
      icon: <Users className="w-6 h-6" />,
      text: "Z Jobs is a market leader in specialist recruitment services providing tailor made recruitment solutions across verticals, with a branch network that has extensive geographic coverage in India",
      gradientFrom: "from-indigo-800",
      gradientTo: "to-indigo-900",
      decorativeIcons: [<Award key="1" />, <Users key="2" />],
    },
    {
      icon: <FileCheck className="w-6 h-6" />,
      text: "Through research and accurate mapping of interests of both our clients, as well as, our candidates, we provide relevant & reliable service",
      gradientFrom: "from-orange-500",
      gradientTo: "to-orange-600",
      decorativeIcons: [<FileCheck key="1" />, <Search key="2" />],
    },
  ];

  // Custom floating animation for decorative elements
  const floatingAnimation = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: [0.2, 0.5, 0.2],
      scale: [1, 1.2, 1],
      transition: {
        duration: 3,
        repeat: Infinity,
      },
    },
  };

  return (
    <section className="relative py-20 bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 overflow-hidden">
      {/* Animated connection lines */}
      <div className="absolute inset-0">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`line-${i}`}
            className="absolute h-px bg-white/20"
            style={{
              width: "100px",
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              rotate: `${Math.random() * 360}deg`,
            }}
            animate={{
              width: ["0px", "100px", "0px"],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 3,
              delay: i * 0.5,
              repeat: Infinity,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
            What Z Jobs can do?
          </h2>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">
            Streamline your hiring process with strategic channels to reach
            qualified candidates
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative group"
            >
              {/* Decorative floating icons around the card */}
              {feature.decorativeIcons.map((icon, iconIndex) => (
                <motion.div
                  key={`icon-${iconIndex}`}
                  className={`absolute ${
                    iconIndex === 0 ? "-left-8 top-1/3" : "-right-8 bottom-1/3"
                  } text-white/30`}
                  variants={floatingAnimation}
                  initial="hidden"
                  animate="visible"
                  style={{
                    animationDelay: `${iconIndex * 0.5}s`,
                  }}
                >
                  {React.cloneElement(icon, { className: "w-8 h-8" })}
                </motion.div>
              ))}

              {/* Main card */}
              <motion.div
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                }}
                className={`bg-gradient-to-br ${feature.gradientFrom} ${feature.gradientTo} rounded-xl p-8 h-full backdrop-blur-lg border border-white/10`}
              >
                {/* Floating icon */}
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-gradient-to-br from-white to-indigo-100 p-4 rounded-full shadow-lg"
                  >
                    {React.cloneElement(feature.icon, {
                      className: "w-6 h-6 text-indigo-900",
                    })}
                  </motion.div>
                </div>

                {/* Card content */}
                <div className="mt-8">
                  <p className="text-white leading-relaxed">{feature.text}</p>
                </div>

                {/* Pulse effect around the card */}
                <motion.div
                  className="absolute inset-0 rounded-xl"
                  animate={{
                    boxShadow: [
                      "0 0 0 0 rgba(255,255,255,0)",
                      "0 0 0 10px rgba(255,255,255,0.1)",
                      "0 0 0 20px rgba(255,255,255,0)",
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "loop",
                  }}
                />
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Connection dots animation */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`dot-${i}`}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              delay: i * 0.3,
              repeat: Infinity,
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default WhatZjobsDo;
