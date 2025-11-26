"use client";

import React, { useEffect, useState } from "react";
import { bouncy } from "ldrs";

interface LoaderProps {
  size?: number;
  color?: string;
  speed?: number;
  fullScreen?: boolean;
}

const Loader: React.FC<LoaderProps> = ({
  size = 85,
  color = "#6366f1",
  speed = 0.9,
  fullScreen = true,
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Only register on client side
    if (typeof window !== "undefined") {
      bouncy.register();
      setIsClient(true);
    }
  }, []);

  if (!isClient) {
    return null;
  }

  const loaderContent = React.createElement("l-bouncy", {
    size,
    speed,
    color,
  });

  if (fullScreen) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        {loaderContent}
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center w-full">
      {loaderContent}
    </div>
  );
};

// Add display name to satisfy eslint
Loader.displayName = "Loader";

export default Loader;
