import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { decryptKey, encryptKey } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock } from "lucide-react"; // Import Lucide icons

interface AdminAuthProps {
  onSuccess: () => void;
}

const AdminAuth: React.FC<AdminAuthProps> = ({ onSuccess }) => {
  // * useState
  const [email, setEmail] = useState(""); // New email state
  const [password, setPassword] = useState(""); // New password state
  const [error, setError] = useState("");
  const [open, setOpen] = useState(true);

  // * hooks
  const router = useRouter();
  const path = usePathname();

  // * functions
  const encryptedKey = Cookies.get("accessKey");

  const validateCredentials = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    if (
      email === process.env.NEXT_PUBLIC_ADMIN_EMAIL &&
      password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD
    ) {
      const encryptedKey = encryptKey(email); // Encrypt email instead of passkey
      Cookies.set("accessKey", encryptedKey, { expires: 1 });
      Cookies.set("admin_authenticated", "true", { expires: 1 });

      setOpen(false);
      onSuccess();
      router.push(`/admin/dashboard`);
    } else {
      setError("Invalid email or password. Please try again.");
    }
  };

  const closeModal = () => {
    setOpen(false);
    router.push("/");
  };

  // * useEffect
  useEffect(() => {
    const accessKey = encryptedKey && decryptKey(encryptedKey);
    if (path) {
      if (accessKey === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
        setOpen(false);
        router.push("/admin/dashboard");
      } else {
        setOpen(true);
      }
    }
  }, [encryptedKey, path, router]);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="bg-white text-black w-[90%] max-w-md mx-auto p-6 rounded-lg shadow-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center justify-between text-lg sm:text-xl md:text-2xl">
            Admin Access
            <Image
              src="/icons/close.svg"
              alt="close"
              height={20}
              width={20}
              onClick={closeModal}
              className="cursor-pointer"
            />
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm sm:text-base md:text-lg text-gray-600">
            Please enter your credentials to access the admin dashboard.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="my-6 space-y-4">
          <div className="relative">
            <Label className="mb-1 text-gray-700">Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full p-2 pr-10 border border-gray-300 rounded-md focus-visible:ring-transparent"
            />
            <Mail className="absolute top-[70%] right-3 transform -translate-y-1/2 text-gray-400" />
          </div>

          <div className="relative">
            <Label className="mb-1 text-gray-700">Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full p-2 pr-10 border border-gray-300 rounded-md focus-visible:ring-transparent"
            />
            <Lock className="absolute top-[70%] right-3 transform -translate-y-1/2 text-gray-400" />
          </div>

          {error && (
            <p className="text-sm mt-2 text-center text-red-500">{error}</p>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogAction
            onClick={(e) => validateCredentials(e)}
            className="w-full  text-white text-sm py-2 rounded-lg transition duration-200"
          >
            Sign In
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AdminAuth;
