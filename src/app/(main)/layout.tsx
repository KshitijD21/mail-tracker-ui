import Header from "@/components/header";
import React from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col">
        <Header />
        {/* Add top padding to account for fixed navbar */}
        <main className="px-6 pt-20 overflow-y-auto flex-1">{children}</main>
      </div>
    </div>
  );
}
