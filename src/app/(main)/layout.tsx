import Header from "@/components/header";
import React from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background-gray">
      {/* <Sidebar /> */}
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="px-6 pt-3 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
