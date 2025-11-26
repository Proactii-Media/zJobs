"use client";

import { useEffect } from "react";
import { AlertCircle, Home, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="max-w-md w-full shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-center">
            <AlertCircle className="h-12 w-12 text-red-500 animate-pulse" />
          </div>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <h1 className="text-2xl font-semibold text-gray-900">
            Something went wrong!
          </h1>
          <p className="text-gray-500">
            {error.message || "An unexpected error has occurred"}
          </p>
          {error.digest && (
            <p className="text-sm text-gray-400">Error ID: {error.digest}</p>
          )}
        </CardContent>
        <CardFooter className="flex justify-center space-x-4">
          <Button
            variant="outline"
            onClick={() => {
              window.location.reload();
            }}
            className="flex items-center space-x-2"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Try again</span>
          </Button>
          <Button
            onClick={() => {
              router.push("/admin/dashboard");
            }}
            className="flex items-center space-x-2"
          >
            <Home className="h-4 w-4" />
            <span>Go Home</span>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
