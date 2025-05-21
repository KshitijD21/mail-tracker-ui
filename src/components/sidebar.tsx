"use client";
import {
  BarChart2,
  GitGraph,
  HelpCircle,
  LayoutDashboard,
  LogIn,
  LucideIcon,
  Settings,
  UserPlus,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

interface SidebarItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

export default function Sidebar() {
  const { resolvedTheme } = useTheme();
  const [mount, setMount] = useState(false);
  const pathname = usePathname();

  useEffect(() => setMount(true));
  if (!mount) return null;

  const sidebarItems: SidebarItem[] = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Onboarding", path: "/onboarding", icon: UserPlus },
    { label: "Analytics", path: "/analytics", icon: BarChart2 },
    { label: "Settings", path: "/settings", icon: Settings },
    { label: "Help Center", path: "/help", icon: HelpCircle },
  ];

  return (
    <div className="w-56 transition-all bg-gradient-to-r from-gray-100 to-gray-100 dark:from-gray-800 dark:to-gray-900 h-full">
      <div className="p-2 h-12">
        <img
          src={resolvedTheme === "dark" ? "/logo-dark.png" : "/logo-light.png"}
          alt="Logo"
          className="h-8 w-auto"
        />
      </div>
      <hr />
      <div className="flex flex-col p-3 gap-5">
        <div className="flex flex-col p-3 gap-5">
          {sidebarItems.map(({ label, path, icon: Icon }: SidebarItem) => {
            const isActive = pathname === path;
            return (
              <Link key={path} href={path}>
                <div
                  className={`flex items-center gap-3 p-2 rounded-md transition-colors duration-200 ${
                    isActive
                      ? "bg-gray-300 dark:bg-gray-700 text-blue-600"
                      : "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <p className="text-sm font-medium">{label}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
