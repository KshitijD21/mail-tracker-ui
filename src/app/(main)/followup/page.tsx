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
import { ArrowUpDown, ChevronDown, MoreVertical } from "lucide-react";

import LayoutBox from "@/components/layout-box";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllFollowUps, setFollowUp, TrackingLinkEntity } from "@/lib/api";
import { DropdownMenuCheckboxItem } from "@radix-ui/react-dropdown-menu";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function FollowUpPage() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [followUpData, setFollowUpData] = useState<TrackingLinkEntity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const handleRemoveFromFollowUp = async (trackingId: string) => {
    try {
      await setFollowUp(trackingId, false);
      toast.success("Removed from follow-up successfully");
      // Refresh the data
      fetchFollowUpData();
    } catch (error) {
      console.error("Failed to remove from follow-up:", error);
      toast.error("Failed to remove from follow-up");
    }
  };

  const columns: ColumnDef<TrackingLinkEntity>[] = [
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
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard.writeText(email.recipientEmail);
                  toast.success("Email copied to clipboard");
                }}
                className="hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Copy Recipient Email
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFromFollowUp(email.code);
                }}
                className="hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600"
              >
                Remove from Follow Up
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable<TrackingLinkEntity>({
    data: followUpData,
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

  const fetchFollowUpData = async () => {
    try {
      setIsLoading(true);
      const data = await getAllFollowUps();
      setFollowUpData(data);
    } catch (error) {
      console.error("Failed to fetch follow-up data:", error);
      toast.error("Failed to load follow-up items");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowUpData();
  }, []);

  return (
    <LayoutBox>
      <div className="flex flex-col mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 tracking-tight">
          Follow Up
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage your follow-up emails and track their progress
        </p>
      </div>

      {/* Follow Up Table */}
      <div className="flex flex-col mt-6">
        <div className="w-full">
          {/* Filter & Column Control */}
          <div className="flex items-center py-4">
            {/* <Input
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
            /> */}
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
                {isLoading ? (
                  <TableRow className="border border-gray-100">
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center border border-gray-100"
                    >
                      Loading follow-up items...
                    </TableCell>
                  </TableRow>
                ) : table.getRowModel().rows.length ? (
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
                      No follow-up items found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </LayoutBox>
  );
}
