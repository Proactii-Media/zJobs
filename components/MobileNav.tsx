import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { navbarLinks } from "@/constants";

const MobileNav = () => {
  //* hooks
  const pathname = usePathname();

  return (
    <section className="w-full max-w-[264px]">
      <Sheet>
        <SheetTrigger asChild>
          <Image
            src="/icons/hamburger.svg"
            alt="hamburger icon"
            width={36}
            height={36}
            className="cursor-pointer lg:hidden"
          />
        </SheetTrigger>
        <SheetContent
          side="right"
          className="border-none bg-indigo-950 text-white"
        >
          <div className="flex h-[calc(100vh-72px)] flex-col justify-between overflow-y-auto">
            <section className="flex h-full flex-col gap-6 pt-10 text-white">
              {/* Looping through sidebar links */}
              {navbarLinks.map((link) => {
                const isActive = pathname === link.route;
                return (
                  <SheetClose key={link.route} asChild>
                    <Link
                      href={link.route}
                      className={cn(
                        "flex gap-4 items-center p-4 border-b w-full max-w-60",
                        {
                          "bg-orange-600 text-white rounded-lg": isActive,
                        }
                      )}
                    >
                      <p className="font-semibold">{link.label}</p>
                    </Link>
                  </SheetClose>
                );
              })}
            </section>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default MobileNav;
