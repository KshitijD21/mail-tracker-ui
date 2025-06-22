"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import UserDropdown from "./user-drop-down";

const navItems = [
  { label: "Dashboard" },
  { label: "Followup" },
  { label: "On boarding" },
];

interface SidebarItem {
  label: string;
  path: string;
}

const sidebarItems: SidebarItem[] = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Followup", path: "/followup" },
  { label: "On boarding", path: "/onboarding" },
];
export default function Header() {
  const [active, setActive] = useState("Dashboard");

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    window.location.href = "/auth/signin";
  };
  return (
    <header className="w-full">
      <nav className=" mx-auto flex items-center justify-between px-4 pt-4 pb-2 gap-4">
        {/* Left: Logo and Location */}
        <div className="flex items-center gap-4">
          <Image
            src="/logo.png"
            alt="Promptping Logo"
            width={156}
            height={36}
          />
        </div>
        {/* Center: Navigation Links with animation */}
        <div className="flex gap-2 md:gap-4">
          {sidebarItems.map((item) => (
            <Link
              key={item.label}
              href={item.path || "#"}
              onClick={() => setActive(item.label)}
              className={`relative px-3 py-1 font-medium duration-200 ${
                active === item.label
                  ? "bg-white text-primary rounded-md ring-2 ring-transparent ring-offset-2 ring-offset-white"
                  : "text-black/90 hover:text-primary"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
        {/* Right: Notifications and User */}
        <UserDropdown />
      </nav>
      <style jsx>{`
        button:focus {
          outline: none;
        }
      `}</style>
    </header>
  );
}
