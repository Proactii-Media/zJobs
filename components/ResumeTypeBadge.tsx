import React from "react";

const ResumeTypeBadge = ({
  type,
}: {
  type?: "general" | "vacancy" | "admin";
}) => {
  // Color and text mapping for resume types
  const typeConfig = {
    general: {
      bg: "bg-green-100",
      text: "text-green-800",
      label: "GEN",
    },
    vacancy: {
      bg: "bg-indigo-100",
      text: "text-indigo-800",
      label: "VAC",
    },
    admin: {
      bg: "bg-red-100",
      text: "text-red-800",
      label: "ADM",
    },
  };

  // If no type is provided, return null
  if (!type) return null;

  // Get configuration for the specific type
  const config = typeConfig[type];

  return (
    <span
      className={`
          ${config.bg} 
          ${config.text} 
          px-2 py-0.5 
          rounded-full 
          text-xs 
          font-medium
          uppercase
          inline-block
        `}
    >
      {config.label}
    </span>
  );
};

export default ResumeTypeBadge;
