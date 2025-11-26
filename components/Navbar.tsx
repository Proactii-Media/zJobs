"use client";
import Image from "next/image";
import Link from "next/link";
import { navbarLinks } from "@/constants";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import MobileNav from "./MobileNav";
import { Button } from "./ui/button";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      style={{
        height: isScrolled ? "70px" : "80px",
        transition: "height 0.3s ease-in-out",
      }}
      className="w-full border-b-2 border-slate-200 bg-white sticky top-0 z-50"
    >
      <nav className="lg:max-w-screen-lg mx-auto h-full px-4 md:px-6">
        <div className="flex items-center justify-between h-full">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/ZJobs.png"
                width={500}
                height={500}
                alt="logo"
                className="w-[140px] h-[70px] object-contain p-1"
              />
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden lg:flex flex-1 justify-center">
            <ul className="flex items-center space-x-2">
              {navbarLinks.map((link) => {
                const isActive = pathname === link.route;
                return (
                  <li key={link.label}>
                    <Link
                      href={link.route}
                      className={cn(
                        "px-4 py-2 rounded-lg font-semibold transition-all duration-300",
                        "hover:bg-indigo-200 ",
                        {
                          "text-white bg-indigo-900 hover:bg-indigo-900 ":
                            isActive,
                        }
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* <ResumeUpload /> */}
            <Button
              className="bg-indigo-900 hover:bg-indigo-950 text-white px-4 py-2 rounded transition-transform duration-500 ease-in-out hover:translate-y-[-2px]"
              onClick={() => {
                router.push("/upload-resume");
              }}
            >
              Upload Resume
            </Button>
            <div className="lg:hidden">
              <MobileNav />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
