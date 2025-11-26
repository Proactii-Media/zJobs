"use client";
import { ArrowUp } from "lucide-react";
import React, { useState, useEffect } from "react";

const BackToTop = () => {
  // * useStates
  const [isVisible, setIsVisible] = useState(false);

  // * Functions
  const toggleVisibility = () => {
    if (window.scrollY > 0) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // * useEffects
  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    isVisible && (
      <button
        onClick={scrollToTop}
        className="fixed bottom-5 right-7 size-14 flex items-center justify-center text-lg z-50 bg-indigo-900 rounded-full border border-white"
      >
        <ArrowUp className="text-white" />
      </button>
    )
  );
};

export default BackToTop;
