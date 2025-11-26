import BackToTop from "@/components/BackToTop";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import React, { ReactNode } from "react";

const MainLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <main className="relative">
      <Navbar />
      <section className="flex">
        <div className="flex min-h-screen flex-1 flex-col  max-md:pb-14 bg-white">
          <main className="w-full">{children}</main>
        </div>
        <BackToTop />
      </section>
      <Footer />
    </main>
  );
};

export default MainLayout;
