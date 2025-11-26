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
import {
  addJobPosition,
  fetchJobPositions,
} from "@/lib/actions/jobPositionMaster.actions";

const PositionMaster = () => {
  const [positions, setPositions] = useState<string[]>([]);
  const [position, setPosition] = useState("");

  // Fetch positions on component mount
  useEffect(() => {
    const loadPositions = async () => {
      try {
        const fetchedPositions = await fetchJobPositions();
        setPositions(fetchedPositions);
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to fetch positions";

        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    };

    loadPositions();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Create FormData
    const formData = new FormData();
    formData.append("position", position);

    try {
      const result = await addJobPosition(formData);

      if (result.success) {
        // Update local state
        setPositions((prevPositions) => [...prevPositions, result.position]);

        // Clear input
        setPosition("");

        // Show success toast
        toast({
          title: "Success",
          description: "Position added successfully",
        });
      } else {
        // Show error toast
        toast({
          title: "Error",
          description: result.error || "Failed to add position",
          variant: "destructive",
        });
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to add position";

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mt-5">
      <h2 className="text-lg font-semibold mb-4">Position Master</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex items-center gap-4 mb-6">
        <Input
          type="text"
          placeholder="Add a position"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          required
        />
        <Button type="submit">Add</Button>
      </form>

      {/* Dropdown */}
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a position" />
        </SelectTrigger>
        <SelectContent>
          {positions.map((position) => (
            <SelectItem key={position} value={position}>
              {position}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default PositionMaster;
