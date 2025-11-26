import { useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { adminSidebarLinks } from "@/constants";

const Sidebar = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderLinks = () => (
    <>
      {adminSidebarLinks.map((item) => {
        const isActive =
          pathname === item.route || pathname.startsWith(`${item.route}/`);
        const Icon = item.icon;
        return (
          <Link
            href={item.route}
            key={item.label}
            className={cn(
              "flex items-center gap-3 py-4 px-4 rounded-lg transition-colors",
              {
                "bg-indigo-100 text-black": isActive,
                "hover:bg-indigo-100 mt-2 text-neutral-700 mb-2": !isActive,
              }
            )}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Icon
              className={cn("w-6 h-6", {
                "text-black": isActive,
                "text-gray-500": !isActive,
              })}
            />
            <p className="text-base font-medium">{item.label}</p>
          </Link>
        );
      })}
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <section className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 h-screen">
        <div className="p-4 mb-6">
          <Link
            href="/"
            className="cursor-pointer flex flex-col items-center justify-center gap-2"
          >
            <Image
              src="/images/logo.jpg"
              width={160}
              height={48}
              alt="logo"
              className="w-auto h-12"
            />
            <span className="text-4xl font-bold italic text-indigo-900">
              Z Jobs
            </span>
          </Link>
        </div>
        <nav className="flex-grow px-2">{renderLinks()}</nav>
      </section>

      {/* Mobile Navigation */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="lg:hidden fixed sm:top-3 top-5 left-4 z-50 text-black"
          >
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 p-0 bg-white">
          <div className="flex flex-col h-full">
            <div className="p-4 mb-6">
              <Link
                href="/"
                className="cursor-pointer flex items-center justify-start gap-2"
              >
                <Image
                  src="/images/logo.jpg"
                  width={160}
                  height={48}
                  alt="logo"
                  className="w-auto h-12"
                />
                <span className="text-4xl font-bold italic text-indigo-900">
                  Z Jobs
                </span>
              </Link>
            </div>
            <nav className="flex-grow px-2 ">{renderLinks()}</nav>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Sidebar;
