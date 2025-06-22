"use client";
import DateRangePicker from "@/app/(main)/dashboard/components/date-range-picker";
import LayoutBox from "@/components/layout-box";
import { Button } from "@/components/ui/button";
import { fetchOpenChartData } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import TimeBarChart from "../components/bar-chart";

interface PageProps {
  params: { trackingId: string };
}

export default function TrackingDetailPage({
  params,
}: {
  params: { trackingId: string };
}) {
  const { trackingId } = params;
  const router = useRouter();
  const today = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 6);

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: sevenDaysAgo,
    to: today,
  });
  const [chartData, setChartData] = useState<any>(null);

  console.log("Tracking ID:", trackingId);
  console.log("Date Range:", dateRange);
  console.log("Chart Data:", chartData);

  useEffect(() => {
    console.log("code is here");
    if (dateRange?.from && dateRange?.to) {
      fetchOpenChartData(trackingId, {
        startDate: dateRange.from,
        endDate: dateRange.to,
      }).then(setChartData);
    }
  }, [dateRange, trackingId]);

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

        <TimeBarChart data={chartData} />
      </div>
    </LayoutBox>
  );
}
