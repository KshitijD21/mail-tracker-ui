// components/ui/date-range-picker.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { DateRange, DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

export default function DateRangePicker({
  value,
  onChange,
  placeholder = "Select date range",
}: {
  value: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [tempRange, setTempRange] = useState<DateRange | undefined>(value);

  useEffect(() => {
    setTempRange(value);
  }, [value]);

  const label =
    value?.from && value?.to
      ? `${format(value.from, "MMM d, yyyy")} - ${format(
          value.to,
          "MMM d, yyyy"
        )}`
      : placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-[250px] justify-start text-left font-normal"
        >
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2 bg-white" align="end">
        <DayPicker
          mode="range"
          selected={tempRange}
          onSelect={setTempRange}
          numberOfMonths={2}
          navLayout="around"
          //   showWeekNumber
          //   modifiersClassNames={{
          //     selected: "bg-blue-600 text-white", // Use your default blue
          //     range_middle: "bg-blue-500 text-white",
          //     range_start: "bg-blue-600 text-white",
          //     range_end: "bg-blue-600 text-white",
          //     // today: "!bg-inherit !text-inherit !font-normal",
          //   }}
        />
        <div className="flex justify-end gap-2 px-4 pb-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setTempRange(value);
              setOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            className="bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => {
              onChange(tempRange);
              setOpen(false);
            }}
            disabled={!tempRange?.from || !tempRange?.to}
          >
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
