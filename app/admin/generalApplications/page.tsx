"use client";
import { useCallback, useEffect, useState } from "react";
import { Trash2, FileText, X, Eye, PencilLine } from "lucide-react";
import Loader from "@/components/Loader";
import {
  deleteGeneralApplication,
  getGeneralApplications,
} from "@/lib/actions/generalApplications.actions";
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
  ColumnFiltersState,
  getFilteredRowModel,
  PaginationState,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

interface GeneralApplication {
  _id: string;
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

const UsersPage = () => {
  const [data, setData] = useState<GeneralApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [deleteTrigger, setDeleteTrigger] = useState(0);
  const [selectedPdf, setSelectedPdf] = useState<{
    fileName: string;
    contentType: string;
    data: string;
  } | null>(null);

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getGeneralApplications();
      setData(response);
    } catch (error) {
      console.error("Failed to fetch Applications:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteGeneralApplication(id);
      setDeleteTrigger((prev) => prev + 1);
      setData((prevData) =>
        prevData.filter((application) => application._id !== id)
      );
    } catch (error) {
      console.error("Failed to delete user:", error);
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

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications, deleteTrigger]);

  const columns: ColumnDef<GeneralApplication>[] = [
    {
      id: "name",
      accessorFn: (row) => row.personalDetails.name,
      header: "Name",
    },
    {
      accessorKey: "personalDetails.email",
      header: "Email",
      cell: ({ row }) => {
        const email = row.original.personalDetails?.email;
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
      accessorKey: "personalDetails.phone",
      header: "Phone",
    },
    {
      accessorKey: "professionalDetails.pdfData",
      header: "Resume",
      cell: ({ row }) => {
        const pdfData = row.original.professionalDetails?.pdfData;
        if (!pdfData) return null;

        return (
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePdfClick(pdfData)}
              className="flex items-center space-x-2 underline"
            >
              <FileText className="h-4 w-4" />
              <span className="max-w-[200px] truncate">{pdfData.fileName}</span>
            </Button>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const GeneralApplication = row.original;
        return (
          <div className="flex space-x-2">
            <Link
              href={`/admin/generalApplications/view/${GeneralApplication._id}`}
            >
              <Button variant="ghost" size="icon">
                <Eye className="h-4 w-4" />
              </Button>
            </Link>
            <Link
              href={`/admin/generalApplications/edit/${GeneralApplication._id}`}
            >
              <Button variant="ghost" size="icon">
                <PencilLine className="h-4 w-4" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(GeneralApplication._id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
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
    <>
      <section className="sm:px-5 md:px-1 lg:px-2">
        <h1 className="text-black text-2xl font-semibold sm:mb-5 md:mb-2">
          General Applications
        </h1>
        <div className="bg-white border border-gray-300 rounded-xl p-6">
          <div className="flex items-center py-4">
            <Input
              placeholder="Filter by name..."
              value={
                (table.getColumn("name")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("name")?.setFilterValue(event.target.value)
              }
              className="max-w-sm text-black"
            />
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

export default UsersPage;
