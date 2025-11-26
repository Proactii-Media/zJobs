"use client";

import Hero from "@/components/Hero";
import BrowseCategory from "@/components/BrowseCategory";
import FeaturedJob from "@/components/FeaturedJob";
import Testimonial from "@/components/Testimonials";
import WhatZjobsDo from "@/components/WhatZjobsDo";

export default function Home() {
  return (
    <>
      <Hero />
      <BrowseCategory />
      <FeaturedJob />
      <WhatZjobsDo />
      <Testimonial />
    </>
  );
}
