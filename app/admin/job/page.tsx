"use client";
import { useCallback, useEffect, useState } from "react";
import { Trash2, PencilLine, Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  PaginationState,
} from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import Loader from "@/components/Loader";
import Link from "next/link";

interface Job {
  _id: string;
  company: string;
  title: string;
  location: string;
  jobType: string[];
  posted: string;
  applicationCount?: number;
  applicationIds?: string[];
  applicantName?: string[];
  applicantEmail?: string[];
  applicantPhone?: string[];
  applicantAddress?: string[];
}

const JobsPage = () => {
  // * States
  const [data, setData] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [deleteTrigger, setDeleteTrigger] = useState(0);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // * Hooks
  const router = useRouter();

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const [jobsResponse, applicationCountResponse] = await Promise.all([
        fetch("/api/jobs"),
        fetch("/api/jobs/with-applications"),
      ]);

      const jobs = await jobsResponse.json();
      const applicationCounts = await applicationCountResponse.json();

      // Merge application counts and IDs with jobs
      const jobsWithApplications = jobs.map((job: Job) => {
        const matchingJob = applicationCounts.find(
          (appJob: Job) => appJob.title === job.title
        );
        return {
          ...job,
          applicationCount: matchingJob ? matchingJob.applicationCount : 0,
          applicationIds: matchingJob ? matchingJob.applicationIds : [], // Include application IDs
          applicantName: matchingJob ? matchingJob.applicantName : "", // Include applicant name
          applicantEmail: matchingJob ? matchingJob.applicantEmail : "", // Include applicant email
          applicantPhone: matchingJob ? matchingJob.applicantPhone : "", // Include applicant phone
          applicantAddress: matchingJob ? matchingJob.applicantAddress : "", // Include applicant address
        };
      });

      setData(jobsWithApplications);
    } catch (error) {
      console.error("Failed to fetch jobs or application counts:", error);
      toast({
        title: "Error",
        description: "Failed to fetch jobs or application counts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // * Functions
  const handleDelete = async () => {
    if (!jobToDelete) return;

    try {
      const response = await fetch(`/api/jobs/${jobToDelete}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Job Deleted successfully",
        });
        setDeleteTrigger((prev) => prev + 1);
        setData((prevData) =>
          prevData.filter((job) => job._id !== jobToDelete)
        );
      } else {
        console.error("Failed to delete job");
        toast({
          title: "Error",
          description: "Failed to delete job",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting job:", error);
      toast({
        title: "Error",
        description: "Failed to delete job",
        variant: "destructive",
      });
    } finally {
      setJobToDelete(null);
    }
  };

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // * useEffects
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs, deleteTrigger]);

  const columns: ColumnDef<Job>[] = [
    {
      accessorKey: "company",
      header: "Company Name",
    },
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "location",
      header: "Location",
    },
    {
      accessorKey: "jobType",
      header: "Job Type",
      cell: ({ row }) => {
        return (
          <div className="space-x-1">
            {row.original.jobType.map((type, index) => (
              <span
                key={index}
                className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800"
              >
                {type}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: "posted",
      header: "Posted Date",
      cell: ({ row }) => formatDate(row.original.posted),
    },
    {
      accessorKey: "applicationCount",
      header: "Applications",
      cell: ({ row }) => {
        const count = row.original.applicationCount || 0;
        return (
          <span className="inline-block px-2 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
            {count}
          </span>
        );
      },
    },
    {
      accessorKey: "applicants",
      header: "Applicants",
      cell: ({ row }) => {
        const applicants = row.original.applicationIds || [];
        const applicantNames = row.original.applicantName || [];
        const applicantEmails = row.original.applicantEmail || [];
        const applicantPhones = row.original.applicantPhone || [];
        const applicantAddresses = row.original.applicantAddress || [];

        return (
          <Dialog>
            <DialogTrigger>
              <Button variant="default" size="sm">
                Show Applicants
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Applicants</DialogTitle>
                <DialogDescription>
                  Details of all applicants for this job posting.
                </DialogDescription>
              </DialogHeader>
              <DialogDescription className="max-h-[500px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applicantNames.map((name, index) => (
                      <TableRow key={index}>
                        <TableCell>{name}</TableCell>
                        <TableCell>
                          <Link
                            href={`mailto:${applicantEmails[index]}`}
                            className="text-blue-600 hover:underline"
                          >
                            {applicantEmails[index]}
                          </Link>
                        </TableCell>
                        <TableCell>{applicantPhones[index]}</TableCell>
                        <TableCell>{applicantAddresses[index]}</TableCell>
                        <TableCell>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() =>
                              router.push(
                                `/admin/jobApplications/view/${applicants[index]}`
                              )
                            }
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </DialogDescription>
            </DialogContent>
          </Dialog>
        );
      },
    },

    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const job = row.original;
        return (
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push(`/admin/job/view/${job._id}`)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push(`/admin/job/edit/${job._id}`)}
            >
              <PencilLine className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setJobToDelete(job._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the job posting and remove it from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setJobToDelete(null)}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      pagination,
    },
  });

  // * Generate page numbers
  const pageCount = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex + 1;
  const pageNumbers = Array.from({ length: pageCount }, (_, i) => i + 1);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Loader />
      </div>
    );
  }

  return (
    <section className="sm:px-5 md:px-1 lg:px-2">
      <div className="flex justify-between items-center">
        <h1 className="text-black text-2xl font-semibold sm:mb-5 md:mb-2">
          Jobs
        </h1>
      </div>
      <div className="bg-white border border-gray-300 rounded-xl p-6">
        <div className="flex items-center py-4 justify-between sm:gap-0 gap-2">
          <Input
            placeholder="Filter by title..."
            value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("title")?.setFilterValue(event.target.value)
            }
            className="max-w-sm text-black"
          />
          <Button
            onClick={() => router.push("/admin/job/add")}
            className="text-white"
          >
            Add New Job
          </Button>
        </div>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-black">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No jobs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between space-x-2 py-4">
          {/* Page Size Selector */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Rows per page:</span>
            <Select
              value={pagination.pageSize.toString()}
              onValueChange={(value) => {
                setPagination({
                  pageIndex: 0,
                  pageSize: Number(value),
                });
              }}
            >
              <SelectTrigger className="w-[70px]">
                <SelectValue placeholder={pagination.pageSize} />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 50, 100].map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="text-black"
            >
              Previous
            </Button>

            {/* Page Numbers */}
            <div className="flex space-x-1">
              {pageNumbers.map((pageNumber) => (
                <Button
                  key={pageNumber}
                  variant={currentPage === pageNumber ? "default" : "outline"}
                  size="sm"
                  onClick={() => table.setPageIndex(pageNumber - 1)}
                  className={`text-black ${
                    currentPage === pageNumber ? "bg-black text-white" : ""
                  }`}
                >
                  {pageNumber}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="text-black"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobsPage;
