"use client";
import DateRangePicker from "@/app/(main)/dashboard/components/date-range-picker";
import LayoutBox from "@/components/layout-box";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchOpenChartData } from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import TimeBarChart from "../components/bar-chart";

interface TableDataRow {
  date: string;
  morning: number;
  afternoon: number;
  evening: number;
  total: number;
}

interface ChartDataItem {
  name: string;
  morning: number;
  afternoon: number;
  evening: number;
}

export default function TrackingDetailPage({
  params,
}: {
  params: { trackingId: string };
}) {
  const { trackingId } = params;
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get data from URL params
  const email = searchParams.get("email");
  const subject = searchParams.get("subject");
  const sentAt = searchParams.get("sentAt");
  const totalOpens = searchParams.get("opens");

  const today = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 6);

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: sevenDaysAgo,
    to: today,
  });
  const [chartData, setChartData] = useState<ChartDataItem[] | null>(null);

  // Fetch chart data
  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      fetchOpenChartData(trackingId, {
        startDate: dateRange.from,
        endDate: dateRange.to,
      }).then(setChartData);
    }
  }, [dateRange, trackingId]);

  // Prepare table data from chart data
  const tableData: TableDataRow[] = chartData
    ? chartData.map((item: ChartDataItem) => ({
        date: item.name,
        morning: item.morning,
        afternoon: item.afternoon,
        evening: item.evening,
        total: item.morning + item.afternoon + item.evening,
      }))
    : [];

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <LayoutBox>
      <div className="w-full mx-auto p-6 min-h-screen flex flex-col gap-8">
        {/* Top bar: Back button left, date picker right */}
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard")}
            className="font-medium"
          >
            ← Back
          </Button>
          <div className="flex-1" />
          <div className="w-[270px]">
            <DateRangePicker
              value={dateRange}
              onChange={setDateRange}
              placeholder="Select date range"
            />
          </div>
        </div>

        {/* Email Summary Section */}
        {email && subject && (
          <Card>
            <CardHeader>
              <CardTitle>Email Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Subject
                  </p>
                  <p className="text-sm font-semibold break-words">
                    {decodeURIComponent(subject)}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Recipient
                  </p>
                  <p className="text-sm font-semibold break-words">
                    {decodeURIComponent(email)}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Opens
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold">{totalOpens || "0"}</p>
                    <Badge
                      variant={Number(totalOpens) > 0 ? "default" : "secondary"}
                    >
                      {Number(totalOpens) > 0 ? "Opened" : "Not Opened"}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Sent At
                  </p>
                  <p className="text-sm font-semibold">{formatDate(sentAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Chart Section */}
        <Card>
          <CardHeader>
            <CardTitle>Opens by Time of Day</CardTitle>
          </CardHeader>
          <CardContent>
            <TimeBarChart data={chartData || []} />
          </CardContent>
        </Card>

        {/* Data Table */}
        {tableData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Detailed Data</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-center">Morning</TableHead>
                    <TableHead className="text-center">Afternoon</TableHead>
                    <TableHead className="text-center">Evening</TableHead>
                    <TableHead className="text-center">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableData.map((row: TableDataRow, index: number) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{row.date}</TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant="outline"
                          className="bg-sky-50 text-sky-700 border-sky-200"
                        >
                          {row.morning}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant="outline"
                          className="bg-amber-50 text-amber-700 border-amber-200"
                        >
                          {row.afternoon}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant="outline"
                          className="bg-purple-50 text-purple-700 border-purple-200"
                        >
                          {row.evening}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center font-semibold">
                        {row.total}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </LayoutBox>
  );
}
