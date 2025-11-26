"use client";

import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchCompanies } from "@/lib/actions/company.actions";

// Define an interface for the company document
interface Company {
  _id: string;
  name: string;
  // Add other properties as needed
}

interface CompanySelectProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const CompanySelect: React.FC<CompanySelectProps> = ({
  value,
  onChange,
  placeholder = "Select a company",
  disabled = false,
}) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        setIsLoading(true);
        const fetchedCompanies = await fetchCompanies();
        setCompanies(fetchedCompanies);
        setError(null);
      } catch (err) {
        console.error("Error fetching companies:", err);
        setError("Failed to load companies");
      } finally {
        setIsLoading(false);
      }
    };

    loadCompanies();
  }, []);

  if (error) {
    return (
      <div className="text-red-500 text-sm">
        {error}. Please try again later.
      </div>
    );
  }

  return (
    <Select
      value={value}
      onValueChange={onChange}
      disabled={disabled || isLoading}
    >
      <SelectTrigger className="w-full">
        <SelectValue
          placeholder={isLoading ? "Loading companies..." : placeholder}
        />
      </SelectTrigger>
      <SelectContent>
        {isLoading ? (
          <SelectItem value="loading" disabled>
            Loading companies...
          </SelectItem>
        ) : (
          companies.map((company) => (
            <SelectItem key={company._id} value={company.name}>
              {company.name}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
};
