"use client";
import React, { useState, useEffect } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import Loader from "@/components/Loader";
import Link from "next/link";

// Import the actions for companies
import { deleteCompany, fetchCompanies } from "@/lib/actions/company.actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Company {
  _id: string;
  name: string;
  jobId: string;
  title: string;
  cityName: string;
  posted: string;
  email: string;
  phone: string;
  address: string;
  vacancyCount: number;
  activeVacancyCount: number;
}

const CompanyTable = () => {
  // * useStates
  const [data, setData] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // *hooks
  const router = useRouter();
  const { toast } = useToast();

  // * functions
  const fetchCompanyData = async () => {
    try {
      const response = await fetchCompanies();
      setData(response);
    } catch (error) {
      console.error("Failed to fetch companies:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCompany(id);
      await fetchCompanyData();
      toast({
        title: "Deleted",
        description: "Company deleted successfully!",
        variant: "default",
        className: "text-black z-20 bg-white",
      });
    } catch (error) {
      console.error("Failed to delete company:", error);
      toast({
        title: "Error",
        description: "Failed to delete company.",
        variant: "destructive",
        className: "text-white",
      });
    }
  };

  // * useEffects
  useEffect(() => {
    fetchCompanyData();
  }, []);

  const columns: ColumnDef<Company>[] = [
    {
      accessorKey: "name",
      header: "Company Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      accessorKey: "address",
      header: "Address",
      cell: ({ row }) => {
        const address = row.getValue("address") as string;
        return address.length > 50 ? address.slice(0, 50) + "..." : address;
      },
    },
    {
      accessorKey: "companyType",
      header: "Company Type",
    },
    {
      accessorKey: "vacancyCount",
      header: "Total Vacancies",
      cell: ({ row }) => {
        const vacancyCount = row.getValue("vacancyCount") as number;
        return vacancyCount || 0;
      },
    },
    {
      accessorKey: "activeVacancyCount",
      header: "Active Vacancies",
      cell: ({ row }) => {
        const activeVacancyCount = row.getValue("activeVacancyCount") as number;
        return activeVacancyCount || 0;
      },
    },
    {
      accessorKey: "job",
      header: "Jobs",
      cell: ({ row }) => {
        const jobId = row.original.jobId;
        const jobTitle = row.original.title;
        const jobCity = row.original.cityName;
        const jobPosted = row.original.posted;

        return (
          <Dialog>
            <DialogTrigger>
              <Button variant="default" size="sm">
                Show Jobs
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Jobs</DialogTitle>
                <DialogDescription>
                  Details of all jobs associated with this company.
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Job Title</TableHead>
                        <TableHead>City</TableHead>
                        <TableHead>Date Posted</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>{jobTitle}</TableCell>
                        <TableCell>{jobCity}</TableCell>
                        <TableCell>{formatDate(jobPosted)}</TableCell>
                        <TableCell>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() =>
                              router.push(`/admin/job/view/${jobId}`)
                            }
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        );
      },
    },
    {
      accessorKey: "actions",
      header: "Actions",
      id: "actions",
      cell: ({ row }) => {
        const company = row.original;
        return (
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push(`/admin/company/view/${company._id}`)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push(`/admin/company/edit/${company._id}`)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(company._id)}
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
    <section className="sm:px-5 md:px-1 lg:px-2">
      <h1 className="text-black text-2xl font-semibold sm:mb-5 md:mb-2">
        Companies
      </h1>

      <div className="bg-white border border-gray-300 rounded-xl p-6">
        <div className="flex items-center py-4 justify-between sm:gap-0 gap-2">
          <Input
            placeholder="Filter by company name..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <Link href="/admin/company/add">
            <Button className="text-white px-6">Add Company</Button>
          </Link>
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
  );
};

export default CompanyTable;
