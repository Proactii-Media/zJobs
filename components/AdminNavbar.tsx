import React from "react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";

const AdminNavbar = () => {
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("admin_authenticated");
    Cookies.remove("accessKey");
    router.push("/");
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-5 sm:py-5 md:py-3 w-full">
      <div className="flex flex-1 justify-end items-end">
        <Button onClick={handleLogout} className="flex items-center gap-2">
          <LogOut size={20} />
          <span>Logout</span>
        </Button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
