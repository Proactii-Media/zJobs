"use client";

import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { addDegree, fetchDegrees } from "@/lib/actions/educationMaster.actions";

const EducationMaster = () => {
  const [degrees, setDegrees] = useState<string[]>([]);
  const [degree, setDegree] = useState("");

  // Fetch degrees on component mount
  useEffect(() => {
    const loadDegrees = async () => {
      try {
        const fetchedDegrees = await fetchDegrees();
        setDegrees(fetchedDegrees);
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to fetch degrees";

        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    };

    loadDegrees();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Create FormData
    const formData = new FormData();
    formData.append("degree", degree);

    try {
      const result = await addDegree(formData);

      if (result.success) {
        // Update local state
        setDegrees((prevDegrees) => [...prevDegrees, result.degree]);

        // Clear input
        setDegree("");

        // Show success toast
        toast({
          title: "Success",
          description: "Degree added successfully",
        });
      } else {
        // Show error toast
        toast({
          title: "Error",
          description: result.error || "Failed to add degree",
          variant: "destructive",
        });
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to add degree";

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Education Master</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex items-center gap-4 mb-6">
        <Input
          type="text"
          placeholder="Add a degree"
          value={degree}
          onChange={(e) => setDegree(e.target.value)}
          required
        />
        <Button type="submit">Add</Button>
      </form>

      {/* Dropdown */}
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a degree" />
        </SelectTrigger>
        <SelectContent>
          {degrees.map((degree) => (
            <SelectItem key={degree} value={degree}>
              {degree}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default EducationMaster;
