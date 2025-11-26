"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Search,
  Star,
  MapPin,
  Clock,
  HelpCircle,
  Filter,
  X,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { RegionDropdown, CountryDropdown } from "react-country-region-selector";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { motion } from "framer-motion";

interface Job {
  _id: string;
  title: string;
  location: string;
  jobType: string[];
  salaryMin: number;
  salaryMax: number;
  currency: string;
  rating: number;
  posted: string;
  deadline: string;
}

type SortOption =
  | "rating-high"
  | "rating-low"
  | "salary-high"
  | "salary-low"
  | "latest"
  | "oldest"
  | "";

interface FindJobsClientProps {
  initialJobs: Job[];
}

const FindJobsClient: React.FC<FindJobsClientProps> = ({ initialJobs }) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  //* State management with URL parameters
  const [country, setCountry] = useState<string>("India");
  const [state, setState] = useState<string>(searchParams.get("state") || "");
  const [searchTerm, setSearchTerm] = useState<string>(
    searchParams.get("search") || ""
  );
  const [currentPage, setCurrentPage] = useState<number>(
    Number(searchParams.get("page") || 1)
  );
  const [itemsPerPage, setItemsPerPage] = useState<number>(
    Number(searchParams.get("perPage") || 10)
  );
  const [sortBy, setSortBy] = useState<SortOption>(
    (searchParams.get("sort") as SortOption) || ""
  );
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] =
    useState<boolean>(false);
  const [jobs] = useState<Job[]>(initialJobs);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(initialJobs);

  //* Update URL whenever search parameters change
  useEffect(() => {
    const params = new URLSearchParams();

    if (searchTerm) params.set("search", searchTerm);
    if (state) params.set("state", state);
    if (currentPage > 1) params.set("page", currentPage.toString());
    if (itemsPerPage !== 10) params.set("perPage", itemsPerPage.toString());
    if (sortBy) params.set("sort", sortBy);

    router.push(`/find-jobs?${params.toString()}`, { scroll: false });
  }, [searchTerm, state, currentPage, itemsPerPage, sortBy, router]);

  //* Clear all filters
  const clearAllFilters = () => {
    // Reset all filter states
    setSearchTerm("");
    setState("");
    setSortBy("");
    setItemsPerPage(10);
    setCurrentPage(1);

    // Reset to initial jobs
    setFilteredJobs(initialJobs);

    // Clear URL parameters
    router.push("/find-jobs", { scroll: false });
  };

  //* Filter and sort jobs (same as before)
  const filterAndSortJobs = (
    search: string,
    selectedState: string,
    sortOption: SortOption
  ): void => {
    let result = [...jobs];

    //* Apply both search and state filters together
    result = result.filter((job) => {
      const matchesSearch = search
        ? job.title.toLowerCase().includes(search.toLowerCase()) ||
          job.location.toLowerCase().includes(search.toLowerCase())
        : true;

      const matchesState = selectedState
        ? job.location.toLowerCase().includes(selectedState.toLowerCase())
        : true;

      return matchesSearch && matchesState;
    });

    //* Sort jobs
    result.sort((a: Job, b: Job) => {
      switch (sortOption) {
        case "rating-high":
          return b.rating - a.rating;
        case "rating-low":
          return a.rating - b.rating;
        case "salary-high":
          return b.salaryMax - a.salaryMax;
        case "salary-low":
          return a.salaryMin - b.salaryMin;
        case "latest":
          return new Date(b.posted).getTime() - new Date(a.posted).getTime();
        case "oldest":
          return new Date(a.posted).getTime() - new Date(b.posted).getTime();
        default:
          return 0;
      }
    });

    setFilteredJobs(result);
    setCurrentPage(1);
  };

  //* Event handlers with URL parameter updates
  const handleSearch = (e: React.FormEvent): void => {
    e.preventDefault();
    filterAndSortJobs(searchTerm, state, sortBy);
  };

  const handleSearchInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    filterAndSortJobs(newSearchTerm, state, sortBy);
  };

  const handleStateChange = (val: string): void => {
    setState(val);
    filterAndSortJobs(searchTerm, val, sortBy);
  };

  const handleSortChange = (value: SortOption): void => {
    setSortBy(value);
    filterAndSortJobs(searchTerm, state, value);
  };

  const handleItemsPerPageChange = (value: string): void => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  //* Helper functions
  const calculateDaysLeft = (deadline: string): string => {
    return formatDistanceToNow(new Date(deadline), { addSuffix: true });
  };

  const formatSalary = (min: number, max: number, currency: string): string => {
    return `${currency}${min.toLocaleString()} - ${currency}${max.toLocaleString()}`;
  };

  //* Pagination calculations
  const totalJobs = filteredJobs.length;
  const totalPages = Math.ceil(totalJobs / itemsPerPage);
  const indexOfLastJob = currentPage * itemsPerPage;
  const indexOfFirstJob = indexOfLastJob - itemsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  const getPageNumbers = (): (number | string)[] => {
    const pageNumbers: (number | string)[] = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }
    return pageNumbers;
  };

  useEffect(() => {
    // Apply filters based on URL parameters when component mounts
    filterAndSortJobs(searchTerm, state, sortBy);
  }, [searchTerm, state, sortBy]);

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-indigo-50 h-14 flex items-center">
        <div className="container max-w-7xl mx-auto px-4">
          <Breadcrumb>
            <BreadcrumbList className="text-sm md:text-base">
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="/"
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Find Jobs</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Search box */}
      <section>
        <div className="container max-w-7xl mx-auto px-4 py-4 md:py-6">
          <form
            onSubmit={handleSearch}
            className="bg-white rounded-lg shadow p-3 md:p-4"
          >
            <div className="flex flex-col md:flex-row gap-3 md:gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Job title, keywords or company"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-indigo-500"
                  value={searchTerm}
                  onChange={handleSearchInputChange}
                />
                <Search
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
              </div>

              <div className="w-full md:w-64 hidden">
                <CountryDropdown
                  value={country}
                  onChange={(val) => setCountry(val)}
                  classes="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-indigo-500 bg-gray-50"
                  disabled={true}
                  priorityOptions={["IN"]}
                  defaultOptionLabel="India"
                />
              </div>

              <div className="w-full md:w-64">
                <RegionDropdown
                  country={country}
                  value={state}
                  onChange={handleStateChange}
                  classes="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-indigo-500"
                  defaultOptionLabel="Select State"
                  blankOptionLabel="Select State"
                />
              </div>

              <Button
                type="submit"
                className="w-full md:w-auto px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Find Jobs
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Job list */}
      <section className="bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* Filters and sorting */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6 mb-4">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
                >
                  <Filter className="w-4 h-4" />
                  Filters
                </Button>
                <span className="text-sm text-gray-500 hidden sm:inline">
                  {totalJobs} jobs found
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
                <Select
                  onValueChange={handleItemsPerPageChange}
                  defaultValue="10"
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Items per page" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 items</SelectItem>
                    <SelectItem value="20">20 items</SelectItem>
                    <SelectItem value="30">30 items</SelectItem>
                  </SelectContent>
                </Select>

                <Select onValueChange={handleSortChange}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating-high">
                      Rating (High to Low)
                    </SelectItem>
                    <SelectItem value="rating-low">
                      Rating (Low to High)
                    </SelectItem>
                    <SelectItem value="salary-high">
                      Salary (High to Low)
                    </SelectItem>
                    <SelectItem value="salary-low">
                      Salary (Low to High)
                    </SelectItem>
                    <SelectItem value="latest">Latest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                  </SelectContent>
                </Select>

                {(searchTerm || state || sortBy || itemsPerPage !== 10) && (
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700"
                    onClick={clearAllFilters}
                  >
                    <X className="w-4 h-4" />
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>

            {/* Job listings */}
            {filteredJobs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No jobs found. Try adjusting your search criteria.
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                {currentJobs.map((job) => (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ scale: 1.02 }}
                    className="h-full"
                    key={job._id}
                  >
                    <Card className="group h-full p-4 md:p-6 transition-all duration-300 hover:shadow-xl hover:border-indigo-600 bg-gradient-to-br from-white to-indigo-50/30 relative overflow-hidden">
                      <Link href={`/find-jobs/${job._id}`}>
                        {/* Decorative Elements */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-500" />
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-100 rounded-full -ml-12 -mb-12 transition-transform group-hover:scale-150 duration-500" />

                        <div className="relative">
                          {/* Header Section */}
                          <div className="flex justify-between items-start gap-4 mb-4">
                            <div className="flex-1 min-w-0">
                              <motion.h3
                                className="text-lg md:text-xl font-semibold mb-2 flex items-center gap-2 truncate text-gray-900"
                                whileHover={{ x: 5 }}
                                transition={{ type: "spring", stiffness: 300 }}
                              >
                                {job.title}
                                <motion.span
                                  whileHover={{ rotate: 180 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <HelpCircle className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                                </motion.span>
                              </motion.h3>

                              <div className="flex items-center text-gray-600 text-sm mb-3 group-hover:text-indigo-600 transition-colors duration-300">
                                <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                                <span className="truncate">{job.location}</span>
                              </div>
                            </div>
                          </div>

                          {/* Job Types */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {job.jobType.map((type, typeIndex) => (
                              <motion.span
                                key={typeIndex}
                                whileHover={{ scale: 1.05 }}
                                className="px-3 py-1 text-xs md:text-sm rounded-full bg-indigo-50 text-indigo-700 border border-transparent hover:border-indigo-200 hover:bg-white transition-all duration-300"
                              >
                                {type}
                              </motion.span>
                            ))}
                          </div>

                          {/* Salary Section */}
                          <div className="flex items-center text-gray-700 mb-4 group-hover:text-indigo-700 transition-colors duration-300">
                            <span className="font-medium">
                              {formatSalary(
                                job.salaryMin,
                                job.salaryMax,
                                job.currency
                              )}
                            </span>
                            <span className="text-gray-400 ml-1">/year</span>
                          </div>

                          {/* Footer Section */}
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-4 border-t border-gray-100 group-hover:border-indigo-100 transition-colors duration-300">
                            <motion.div
                              className="flex items-center text-sm text-gray-500"
                              whileHover={{ x: 3 }}
                            >
                              <Clock className="w-4 h-4 mr-1" />
                              Posted {formatDistanceToNow(
                                new Date(job.posted)
                              )}{" "}
                              ago
                            </motion.div>

                            <div className="flex items-center gap-4">
                              <motion.div
                                className="flex"
                                whileHover={{ scale: 1.05 }}
                              >
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 transform transition-transform duration-300 group-hover:scale-110 ${
                                      i < job.rating
                                        ? "text-yellow-400"
                                        : "text-gray-200"
                                    }`}
                                    fill={
                                      i < job.rating ? "currentColor" : "none"
                                    }
                                  />
                                ))}
                              </motion.div>
                              <motion.span
                                className="text-sm text-gray-500 group-hover:text-indigo-600 transition-colors duration-300"
                                whileHover={{ x: 3 }}
                              >
                                Closes {calculateDaysLeft(job.deadline)}
                              </motion.span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalJobs > itemsPerPage && (
              <div className="mt-8 mb-16 overflow-x-auto">
                <Pagination>
                  <PaginationContent className="flex-wrap justify-center">
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => handlePageChange(currentPage - 1)}
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>

                    {getPageNumbers().map((pageNumber, index) => (
                      <PaginationItem key={index}>
                        {pageNumber === "..." ? (
                          <PaginationEllipsis />
                        ) : (
                          <PaginationLink
                            onClick={() =>
                              handlePageChange(pageNumber as number)
                            }
                            isActive={currentPage === pageNumber}
                            className="cursor-pointer"
                          >
                            {pageNumber}
                          </PaginationLink>
                        )}
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() => handlePageChange(currentPage + 1)}
                        className={
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default FindJobsClient;
