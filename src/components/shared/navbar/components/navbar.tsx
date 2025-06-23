"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LogOut, Menu, Settings, User } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState<{
    name: string;
    email: string;
    avatar?: string;
  } | null>(null);
  const { theme, setTheme } = useTheme();

  // Check authentication status
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsAuthenticated(true);
      // You can fetch user info from API or localStorage
      const storedUser = localStorage.getItem("userInfo");
      if (storedUser) {
        setUserInfo(JSON.parse(storedUser));
      } else {
        // Default user info if not stored
        setUserInfo({
          name: "John Doe",
          email: "john@example.com",
        });
      }
    }
  }, []);

  const landingLinks = ["Features", "Testimonials", "FAQ"];
  const dashboardLinks = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Follow up", path: "/followup" },
    { label: "Onboarding", path: "/onboarding", isDev: true },
  ];

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userInfo");
    setIsAuthenticated(false);
    setUserInfo(null);
    window.location.href = "/auth/signin";
  };

  const handleSignIn = () => {
    window.location.href = "/auth/signin";
  };

  const handleGetStarted = () => {
    window.location.href = "/auth/signup";
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 ">
      <div className=" mx-auto flex items-center justify-between px-6 md:px-12 py-3">
        {/* Logo */}
        <Link
          href={isAuthenticated ? "/dashboard" : "/"}
          className="flex items-center"
        >
          <Image
            src="/logo.png"
            alt="Mail Tracker Logo"
            width={170}
            height={36}
            // className="h-9 w-auto"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          {!isAuthenticated
            ? // Landing page navigation
              landingLinks.map((link) => (
                <Link
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors duration-200"
                >
                  {link}
                </Link>
              ))
            : // Dashboard navigation
              dashboardLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.path}
                  className="relative px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors duration-200 flex items-center gap-2"
                >
                  {item.label}
                  {item.isDev && (
                    <Badge variant="secondary" className="text-xs">
                      Dev
                    </Badge>
                  )}
                </Link>
              ))}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {!isAuthenticated ? (
            // Landing page actions
            <>
              <Button
                variant="ghost"
                className="hidden md:inline-flex text-gray-700 hover:bg-gray-100"
                onClick={handleSignIn}
              >
                Sign In
              </Button>
              <Button
                className="hidden md:inline-flex bg-gray-900 hover:bg-gray-800 text-white"
                onClick={handleGetStarted}
              >
                Get Started
              </Button>
            </>
          ) : (
            // Dashboard actions - User dropdown
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 px-2 py-2 h-auto"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={userInfo?.avatar} />
                    <AvatarFallback className="bg-gray-100 text-gray-600 text-sm">
                      {userInfo?.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("") || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-gray-900">
                      {userInfo?.name}
                    </p>
                    <p className="text-xs text-gray-500">{userInfo?.email}</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{userInfo?.name}</p>
                  <p className="text-xs text-gray-500">{userInfo?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col space-y-4 mt-8">
                {!isAuthenticated ? (
                  // Landing page mobile menu
                  <>
                    {landingLinks.map((link) => (
                      <Link
                        key={link}
                        href={`#${link.toLowerCase()}`}
                        className="text-lg font-medium py-2 px-4 hover:bg-gray-100 rounded-md"
                        onClick={() => setIsOpen(false)}
                      >
                        {link}
                      </Link>
                    ))}
                    <div className="pt-4 space-y-2">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          handleSignIn();
                          setIsOpen(false);
                        }}
                      >
                        Sign In
                      </Button>
                      <Button
                        className="w-full bg-gray-900 hover:bg-gray-800"
                        onClick={() => {
                          handleGetStarted();
                          setIsOpen(false);
                        }}
                      >
                        Get Started
                      </Button>
                    </div>
                  </>
                ) : (
                  // Dashboard mobile menu
                  <>
                    {dashboardLinks.map((item) => (
                      <Link
                        key={item.label}
                        href={item.path}
                        className="text-lg font-medium py-2 px-4 hover:bg-gray-100 rounded-md flex items-center gap-2"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.label}
                        {item.isDev && (
                          <Badge variant="secondary" className="text-xs">
                            Dev
                          </Badge>
                        )}
                      </Link>
                    ))}
                    <div className="pt-4 space-y-2 border-t">
                      <div className="flex items-center gap-3 px-4 py-2">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={userInfo?.avatar} />
                          <AvatarFallback className="bg-gray-100 text-gray-600">
                            {userInfo?.name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("") || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">
                            {userInfo?.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {userInfo?.email}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => {
                          handleLogout();
                          setIsOpen(false);
                        }}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
