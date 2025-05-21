"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { ModeToggle } from "@/components/mode-toggle";

export default function Header() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="h-12 w-full flex items-center justify-end px-4 py-2 transition-all bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-900">
      <></>
      <ModeToggle />
    </div>
  );
}
