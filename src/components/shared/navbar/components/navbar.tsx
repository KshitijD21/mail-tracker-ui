"use client";

import Link from "next/link";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useTheme } from "next-themes";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const links = ["Features", "Testimonials", "FAQ"];

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-12 py-1 mt-2">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-lg"
        >
          E-Mail Tracker
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-sm font-medium hover:underline"
            >
              {link}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="outline" className="hidden md:inline-flex">
            Sign In
          </Button>
          <Button className="hidden md:inline-flex bg-[#1E1E2F] text-white">
            Get Started
          </Button>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="flex flex-col space-y-4 mt-8 p-2">
                {links.map((link) => (
                  <Link
                    key={link}
                    href={`#${link.toLowerCase()}`}
                    className="text-lg font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    {link}
                  </Link>
                ))}
                <Button variant="outline">Sign In</Button>
                <Button>Login</Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
