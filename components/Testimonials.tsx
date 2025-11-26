import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { Star, Quote, MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { testimonials } from "@/constants";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/pagination";

const Testimonial = () => {
  return (
    <section className="relative py-20 bg-gradient-to-br from-gray-900 to-indigo-900 overflow-hidden">
      {/* Animated background elements */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white/10 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      ))}

      {/* Floating decorative elements */}
      <motion.div
        className="absolute left-10 top-20 text-white/20"
        animate={{
          y: [-10, 10, -10],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <MessageCircle size={40} />
      </motion.div>
      <motion.div
        className="absolute right-10 bottom-20 text-white/20"
        animate={{
          y: [-10, 10, -10],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Quote size={40} />
      </motion.div>

      <div className="container mx-auto px-4">
        <div className="sm:max-w-7xl lg:max-w-4xl max-w-xs mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
              What our clients are saying
            </h2>
            <p className="text-lg text-gray-300">
              Showing companies based on reviews and recent job openings
            </p>
          </motion.div>

          <div className="relative">
            <Swiper
              modules={[Autoplay, Pagination]}
              spaceBetween={24}
              loop
              slidesPerView={1}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                  spaceBetween: 24,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 32,
                },
              }}
              pagination={{
                clickable: true,
                bulletActiveClass: "swiper-pagination-bullet-active",
                bulletClass: "swiper-pagination-bullet",
              }}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              className="testimonial-swiper !pb-12"
            >
              {testimonials.map((testimonial, index) => (
                <SwiperSlide key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2, duration: 0.5 }}
                  >
                    <Card className="h-full bg-white/5 backdrop-blur-lg border border-white/10 group">
                      <div className="p-6 relative">
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Quote icon */}
                        <motion.div
                          className="absolute -top-4 -left-4 text-white/20"
                          whileHover={{ scale: 1.2, rotate: [0, 5, -5, 0] }}
                          transition={{ duration: 0.5 }}
                        >
                          <Quote size={48} />
                        </motion.div>

                        <div className="relative">
                          <blockquote className="mb-6">
                            <p className="text-gray-200 leading-relaxed italic">
                              &quot;{testimonial.quote}&quot;
                            </p>
                          </blockquote>

                          <div className="flex items-center">
                            <motion.div
                              className="w-10 h-10 rounded-full bg-gradient-to-br from-white/20 to-white/10 mr-3 flex items-center justify-center"
                              whileHover={{ scale: 1.1, rotate: 360 }}
                              transition={{ duration: 0.5 }}
                            >
                              <span className="text-lg font-bold text-white">
                                {testimonial.author[0]}
                              </span>
                            </motion.div>

                            <div>
                              <h4 className="text-sm font-semibold text-white">
                                {testimonial.author}
                              </h4>
                              <p className="text-xs text-indigo-300">
                                {testimonial.position}
                              </p>
                              <div className="flex mt-2 space-x-1">
                                {[...Array(5)].map((_, i) => (
                                  <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                  >
                                    <Star
                                      className={`w-3 h-3 ${
                                        i < testimonial.rating
                                          ? "text-yellow-400 fill-current"
                                          : "text-gray-600"
                                      }`}
                                    />
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .testimonial-swiper {
          width: 100%;
        }

        .testimonial-swiper .swiper-wrapper {
          align-items: stretch;
          padding-top: 1rem;
        }

        .testimonial-swiper .swiper-slide {
          height: auto;
        }

        .testimonial-swiper .swiper-pagination {
          bottom: 0 !important;
          position: relative;
          margin-top: 1rem;
        }

        .testimonial-swiper .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: rgba(255, 255, 255, 0.2);
          opacity: 1;
          margin: 0 4px;
          transition: all 0.3s ease;
        }

        .testimonial-swiper .swiper-pagination-bullet-active {
          background: rgba(255, 255, 255, 0.9);
          transform: scale(1.2);
        }
      `}</style>
    </section>
  );
};

export default Testimonial;
