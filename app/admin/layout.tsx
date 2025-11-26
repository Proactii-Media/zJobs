"use client";
import { ReactNode, useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import AdminNavbar from "@/components/AdminNavbar";
import Cookies from "js-cookie";
import AdminAuth from "./AdminAuth";
import { Toaster } from "@/components/ui/toaster";

const MainLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  // *useState
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // * useEffect
  useEffect(() => {
    //* Check if the user is authenticated (stored in cookies)
    const authenticated = Cookies.get("admin_authenticated");
    setIsAuthenticated(Boolean(authenticated));
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <AdminAuth onSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminNavbar />
        <main className="flex-1 overflow-y-auto p-4 bg-slate-100">
          {children}
        </main>
        <Toaster />
      </div>
    </div>
  );
};

export default MainLayout;
