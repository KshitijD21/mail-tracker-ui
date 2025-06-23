"use client";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  Eye,
  Mail,
  MoreVertical,
  Percent,
  Users,
} from "lucide-react";
import StatCard from "./components/stat-card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import LayoutBox from "@/components/layout-box";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TrackingLinkEntity } from "@/lib/api";
import { useDashboardMetricsStore } from "@/store/DashboardMetrics";
import { useTrackingStore } from "@/store/useTrackingStore";
import { DropdownMenuCheckboxItem } from "@radix-ui/react-dropdown-menu";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const { trackingLinks, fetchTrackingLinks } = useTrackingStore();
  const { metrics, fetchMetrics } = useDashboardMetricsStore();
  const router = useRouter();

  const table = useReactTable<TrackingLinkEntity>({
    data: trackingLinks,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  // Fetch tracking links when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchTrackingLinks();
      } catch (error) {
        console.error("Failed to fetch tracking links:", error);
      }
    };
    fetchData();

    // Fetch dashboard metrics
    const fetchMetricsData = async () => {
      try {
        await fetchMetrics();
      } catch (error) {
        console.error("Failed to fetch dashboard metrics:", error);
      }
    };
    fetchMetricsData();
  }, [fetchTrackingLinks, fetchMetrics]);

  return (
    <LayoutBox>
      <div className="flex flex-col mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 tracking-tight">
          Dashboard
        </h1>
      </div>

      {/* Dashboard metrics section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        <div className="transition-shadow duration-300 hover:shadow-xl rounded-xl bg-white dark:bg-gray-900">
          <StatCard
            label="Total Emails Sent"
            value={metrics?.totalEmailsSent}
            desc="All campaigns, last 30 days"
            icon={<Mail className="w-7 h-7 text-blue-600" />}
          />
        </div>
        <div className="transition-shadow duration-300 hover:shadow-xl rounded-xl bg-white dark:bg-gray-900">
          <StatCard
            label="Email Opens"
            value={metrics?.totalOpens}
            desc={`${
              metrics?.openRate ? `${metrics.openRate}%` : "N/A"
            } open rate this month`}
            icon={
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600">
                <Eye className="w-6 h-6 text-white" />
              </span>
            }
          />
        </div>
        <div className="transition-shadow duration-300 hover:shadow-xl rounded-xl bg-white dark:bg-gray-900">
          <StatCard
            label="Total Contacts"
            value={metrics?.totalUniqueRecipients}
            desc="Active in your list"
            icon={
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600">
                <Users className="w-6 h-6 text-white" />
              </span>
            }
          />
        </div>
        <div className="transition-shadow duration-300 hover:shadow-xl rounded-xl bg-white dark:bg-gray-900">
          <StatCard
            label="Open Rate"
            value={metrics?.openRate ? `${metrics.openRate}%` : "N/A"}
            desc="Compared to last month"
            icon={
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500">
                <Percent className="w-6 h-6 text-white" />
              </span>
            }
          />
        </div>
      </div>

      {/* Tracking Links Table */}
      <div className="flex flex-col mt-12">
        <div className="w-full">
          {/* Filter & Column Control */}
          <div className="flex items-center py-4">
            <Input
              placeholder="Filter by recipient..."
              value={
                (table
                  .getColumn("recipientEmail")
                  ?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table
                  .getColumn("recipientEmail")
                  ?.setFilterValue(event.target.value)
              }
              className="max-w-sm border border-gray-300 dark:border-gray-700 rounded-md mr-4 focus:ring-2 focus:ring-primary/30"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Columns <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="py-2 bg-white border-none min-w-[180px]"
              >
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize flex items-center gap-2 px-3 py-2 hover:bg-gray-100 hover:border-gray-100 dark:hover:bg-gray-700"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      <input
                        type="checkbox"
                        checked={column.getIsVisible()}
                        readOnly
                        className="accent-primary w-4 h-4 rounded border-gray-300 focus:ring-0"
                      />
                      <span>{column.id}</span>
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Table */}
          <div className="rounded-xl border shadow-md overflow-hidden">
            <Table className="border border-gray-100 border-collapse w-full">
              <TableHeader className="bg-gray-100 dark:bg-gray-800">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}
                    className="border border-gray-100"
                  >
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className="border border-gray-100 px-4 py-2 text-left font-bold text-base tracking-wide"
                      >
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
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className="border border-gray-100 hover:cursor-pointer transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                      onClick={() => {
                        const id = row.original.code;
                        const email = encodeURIComponent(
                          row.original.recipientEmail
                        );
                        const subject = encodeURIComponent(
                          row.original.subject
                        );
                        const sentAt = encodeURIComponent(
                          row.original.createdAt
                        );
                        const totalOpens = row.original.totalOpens;
                        router.push(
                          `/dashboard/${id}?email=${email}&subject=${subject}&sentAt=${sentAt}&opens=${totalOpens}`
                        );
                      }}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className="border border-gray-100 px-4 py-2"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow className="border border-gray-100">
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center border border-gray-100"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination & Info */}
          {/* <div className="flex items-center justify-end space-x-2 py-4">
            <div className="text-muted-foreground flex-1 text-sm">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="transition-transform duration-200 hover:scale-105"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="transition-transform duration-200 hover:scale-105"
              >
                Next
              </Button>
            </div>
          </div> */}
        </div>
      </div>
    </LayoutBox>
  );
}

export const columns: ColumnDef<TrackingLinkEntity>[] = [
  {
    accessorKey: "recipientEmail",
    header: "Recipient",
    size: 200,
    cell: ({ row }) => (
      <div className="max-w-[200px] break-words whitespace-normal">
        {row.getValue("recipientEmail")}
      </div>
    ),
  },
  {
    accessorKey: "subject",
    header: "Subject",
    size: 220,
    cell: ({ row }) => (
      <div className="max-w-[200px] break-words whitespace-normal">
        {row.getValue("subject")}
      </div>
    ),
  },
  {
    accessorKey: "opened",
    header: "Opened",
    size: 120,
    cell: ({ row }) => {
      const opened = row.getValue("opened") as boolean;
      return opened ? (
        <Badge
          variant="default"
          className="flex items-center gap-1 text-xs bg-green-50 text-green-700 border-green-200"
        >
          Opened
        </Badge>
      ) : (
        <Badge
          variant="destructive"
          className="flex items-center gap-1 text-xs border-red-200 text-red-700 bg-red-50"
        >
          Not Opened
        </Badge>
      );
    },
  },
  {
    accessorKey: "totalOpens",
    header: () => <div className="text-center w-full">Open Count</div>,
    size: 100,
    cell: ({ row }) => (
      <div className="text-center w-full font-semibold">
        {row.getValue("totalOpens")}
      </div>
    ),
    meta: { align: "center" },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className={
          "font-bold text-md m-0 hover:text-white dark:hover:bg-gray-700 text-left min-w-[160px]"
        }
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Created At
        <ArrowUpDown className="ml-2 h-4 w-4 font-bold text-md" />
      </Button>
    ),
    size: 180,
    cell: ({ row }) => {
      const rawDate = row.getValue("createdAt") as string;
      const formattedDate = new Date(rawDate).toLocaleString();
      return (
        <div className="max-w-[160px] break-words whitespace-normal">
          {formattedDate}
        </div>
      );
    },
  },
  {
    id: "actions",
    size: 64,
    minSize: 40,
    maxSize: 80,
    cell: ({ row }) => {
      const email = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-gray-50 dark:bg-gray-800 border border-gray-200 shadow-lg"
          >
            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(email.recipientEmail)
              }
              className="hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Copy Recipient Email
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-gray-100 dark:hover:bg-gray-700">
              Add to Follow Up
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
// function getPaginationRowMode():
//   | ((
//       table: import("@tanstack/react-table").Table<any>
//     ) => () => import("@tanstack/react-table").RowModel<any>)
//   | undefined {
//   throw new Error("Function not implemented.");
// }

// function getFilteredRowModel():
//   | ((
//       table: import("@tanstack/react-table").Table<any>
//     ) => () => import("@tanstack/react-table").RowModel<any>)
//   | undefined {
//   throw new Error("Function not implemented.");
// }
