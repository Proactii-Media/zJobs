"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Trash2, FileText, X, Eye, Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
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
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  deleteGeneralApplication,
  getGeneralApplications,
} from "@/lib/actions/generalApplications.actions";
import ResumeTypeBadge from "@/components/ResumeTypeBadge";
import Loader from "@/components/Loader";

interface JobApplication {
  _id: string;
  jobTitle: string;
  personalDetails: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  educationalDetails: {
    degree: string;
    graduationYear: string;
    university: string;
  };
  professionalDetails: {
    experience: string;
    resumeType?: "general" | "vacancy" | "admin";
    pdfData: {
      fileName: string;
      contentType: string;
      data: string;
    };
  };
}

const PdfViewer = ({
  pdfData,
}: {
  pdfData: { fileName: string; contentType: string; data: string };
}) => {
  // Existing PdfViewer code remains the same
  const [pdfUrl, setPdfUrl] = useState<string>("");

  useEffect(() => {
    if (pdfData?.data) {
      const binaryData = atob(pdfData.data);
      const array = new Uint8Array(binaryData.length);
      for (let i = 0; i < binaryData.length; i++) {
        array[i] = binaryData.charCodeAt(i);
      }
      const blob = new Blob([array], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [pdfData]);

  if (!pdfUrl)
    return (
      <div className="w-full h-full flex items-center justify-center">
        Loading PDF...
      </div>
    );

  return (
    <div className="w-full h-full relative">
      <object
        data={pdfUrl}
        type="application/pdf"
        className="w-full h-full rounded-lg"
      >
        <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
          <div className="text-center space-y-2 mb-4">
            <p className="text-gray-600 font-medium">
              PDF preview is not available on this device
            </p>
            <p className="text-sm text-gray-500">
              You can download the PDF to view it
            </p>
          </div>
          <a
            href={pdfUrl}
            download={pdfData.fileName}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            Download PDF
          </a>
        </div>
      </object>
    </div>
  );
};

const ResumeManagement = () => {
  //  * useStates
  const [data, setData] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [deleteTrigger, setDeleteTrigger] = useState(0);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [selectedPdf, setSelectedPdf] = useState<{
    fileName: string;
    contentType: string;
    data: string;
  } | null>(null);

  //  * hooks
  const router = useRouter();
  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      // * Parallel fetching of both data sources
      const [apiResponse, generalApplications] = await Promise.all([
        fetch("/api/jobApplication").then((res) =>
          res.ok ? res.json() : null
        ),
        getGeneralApplications(),
      ]);

      // * Combine applications, giving priority to API route data
      let combinedApplications: JobApplication[] = [];

      // * Add applications from API route if available
      if (apiResponse?.applications && apiResponse.applications.length > 0) {
        combinedApplications = [...apiResponse.applications];
      }

      // * Add general applications, avoiding duplicates
      if (generalApplications && generalApplications.length > 0) {
        const apiIds = new Set(combinedApplications.map((app) => app._id));
        const uniqueGeneralApplications = generalApplications.filter(
          (app: JobApplication) => !apiIds.has(app._id)
        );
        combinedApplications = [
          ...combinedApplications,
          ...uniqueGeneralApplications,
        ];
      }

      setData(combinedApplications);
    } catch (error) {
      console.error("Failed to fetch Applications:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // * Custom search and filter function
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;

    const lowercaseTerm = searchTerm.toLowerCase();
    return data.filter((application) => {
      // * Simplified matching with early return for better performance
      const searchFields = [
        application.personalDetails?.name?.toLowerCase(),
        application.personalDetails?.email?.toLowerCase(),
        application.jobTitle?.toLowerCase(),
        application.professionalDetails?.experience?.toLowerCase(),
        application.personalDetails.address?.toLowerCase(),
      ];

      return searchFields.some(
        (field) => field && field.includes(lowercaseTerm)
      );
    });
  }, [data, searchTerm]);

  // * Functions
  const handleDelete = async (id: string) => {
    try {
      // Attempt to delete through both methods
      await Promise.all([
        fetch(`/api/jobApplication/${id}`, { method: "DELETE" }).catch(
          () => {}
        ),
        deleteGeneralApplication(id).catch(() => {}),
      ]);

      // Update local state
      setData((prevData) =>
        prevData.filter((application) => application._id !== id)
      );
      setDeleteTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Failed to delete application:", error);
      fetchApplications();
    }
  };

  const handlePdfClick = (pdfData: {
    fileName: string;
    contentType: string;
    data: string;
  }) => {
    setSelectedPdf(pdfData);
  };

  // * Fetch applications
  useEffect(() => {
    fetchApplications();
  }, [fetchApplications, deleteTrigger]);

  // * Function to get row background color based on resume type
  const getRowBackgroundColor = (
    resumeType?: "general" | "vacancy" | "admin"
  ) => {
    switch (resumeType) {
      case "general":
        return "bg-green-50 hover:bg-green-100";
      case "vacancy":
        return "bg-indigo-50 hover:bg-pink-100";
      case "admin":
        return "bg-red-50 hover:bg-red-100";
      default:
        return "bg-white hover:bg-gray-50";
    }
  };

  // * Custom search input component
  const CustomSearchInput = () => {
    return (
      <div className="relative w-full max-w-md">
        <Input
          type="text"
          placeholder="Search by name, email, job title, city, or experience"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus // * Automatically focus the input
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>
    );
  };

  const columns: ColumnDef<JobApplication>[] = [
    {
      id: "name",
      accessorFn: (row) => row.personalDetails.name,
      header: "Name",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <span>{row.original.personalDetails.name}</span>
          <ResumeTypeBadge type={row.original.professionalDetails.resumeType} />
        </div>
      ),
    },
    {
      accessorKey: "jobTitle",
      header: "Job Title",
    },
    {
      id: "email",
      header: "Email",
      cell: ({ row }) => {
        const email = row.original.personalDetails.email;
        return (
          <Link
            href={`mailto:${email}`}
            className="text-blue-600 hover:underline"
          >
            {email}
          </Link>
        );
      },
    },
    {
      accessorFn: (row) => row.personalDetails.phone,
      id: "phone",
      header: "Phone",
    },
    {
      accessorFn: (row) => row.personalDetails.address,
      id: "address",
      header: "Address",
    },
    {
      id: "experience",
      header: "Experience",
      accessorFn: (row) => row.professionalDetails.experience,
    },
    {
      id: "resume",
      header: "Resume",
      cell: ({ row }) => {
        const pdfData = row.original.professionalDetails.pdfData;
        if (!pdfData) return null;

        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handlePdfClick(pdfData)}
            className="flex items-center space-x-2 underline"
          >
            <FileText className="h-4 w-4" />
            <span className="truncate">{pdfData.fileName}</span>
          </Button>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Link href={`/admin/resumes/view/${row.original._id}`}>
            <Button variant="ghost" size="icon">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDelete(row.original._id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  // * Apply custom filtering

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onPaginationChange: setPagination,
    state: {
      sorting,
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
    <>
      <section className="sm:px-5 md:px-1 lg:px-2">
        <h1 className="text-black text-2xl font-semibold sm:mb-5 md:mb-2">
          Job Applications
        </h1>
        <div className="bg-white border border-gray-300 rounded-xl p-6">
          <div className="flex items-center py-4 justify-between sm:gap-0 gap-2">
            {/* Replace the previous Input with the new CustomSearchInput */}
            <CustomSearchInput />
            <Button
              onClick={() => router.push("/admin/jobApplications/add")}
              className="text-white"
            >
              Add Application
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
                    className={getRowBackgroundColor(
                      row.original.professionalDetails.resumeType
                    )}
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
                    No results.
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

      <Dialog open={!!selectedPdf} onOpenChange={() => setSelectedPdf(null)}>
        <DialogContent className="max-w-4xl h-[90vh] sm:h-[80vh] p-4 sm:p-6">
          <Button
            size="icon"
            onClick={() => setSelectedPdf(null)}
            className="size-10 sm:size-20 p-0 absolute -right-2 -top-2 sm:-right-4 sm:-top-4 bg-transparent hover:bg-transparent"
          >
            <X className="size-8 sm:size-16" />
          </Button>
          <DialogHeader>
            <div className="flex-1 w-full h-full bg-gray-100 rounded-lg overflow-hidden mt-3 sm:mt-5">
              {selectedPdf && <PdfViewer pdfData={selectedPdf} />}
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ResumeManagement;
