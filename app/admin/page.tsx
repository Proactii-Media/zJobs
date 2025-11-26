"use client";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import AdminAuth from "./AdminAuth";

export default function AdminPage() {
  // * useStates
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // *useEffect
  useEffect(() => {
    //* Check if the user is authenticated (stored in cookies)
    const authenticated = Cookies.get("admin_authenticated");
    setIsAuthenticated(Boolean(authenticated));
  }, []);

  //* Handler function to update authentication state after success
  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <AdminAuth onSuccess={handleAuthSuccess} />;
  }
}
