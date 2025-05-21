"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerUser } from "@/lib/api";
import { useTheme } from "next-themes";
import Link from "next/link";
import React, { FormEvent, useEffect, useState } from "react";

interface AuthFormProps {
  mode: "Signup" | "Login";
  onSubmit: (data: { email: string; password: string }) => void;
  resetForm?: boolean;
}

export default function signUp() {
  const { resolvedTheme } = useTheme();
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const res = await registerUser(email, userName, password);
      localStorage.setItem("authToken", res);
      console.log("Sign up successful");
    } catch (error) {
      console.error("Sign up failed; ", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex min-h-screen w-full">
      <div className="flex flex-1 p-3 ">
        <div className="flex-1 flex flex-col">
          <div className="p-3">
            <img
              src={
                resolvedTheme === "dark" ? "/logo-dark.png" : "/logo-light.png"
              }
              alt="Logo"
              className="h-8 w-auto"
            />
          </div>
          <div className="flex-1 w-1/2  h-screen flex justify-center items-center ">
            <div className="w-1/2 flex flex-col gap-4 p-8 bg-white dark:bg-gray-900 rounded-lg shadow-md">
              <div className=" flex flex-col gap-1">
                <p className="text-2xl font-semibold text-center">Sign up</p>
                <p className="text-sm text-center text-gray-600 dark:text-gray-300">
                  some small description
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium">Username</p>
                <Input
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium">Email</p>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium">Password</p>
                <Input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  type="password"
                />
              </div>
              <div className="flex flex-row justify-center mt-2">
                <Button variant="outline" type="submit" className="w-full">
                  Get Started
                </Button>
              </div>
              <div className="flex flex-row justify-center mt-2">
                <p>
                  Already have an account?{" "}
                  <Link href="/auth/signin" className="text-blue-600">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-300 mt-auto px-4 pb-2">
            <p className="text-gray-700 dark:text-gray-200">
              @ MailTracker 2025
            </p>
            <p className="text-gray-500 dark:text-gray-400">
              help@mailtracker.com
            </p>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center overflow-hidden">
          <img
            src="/auth-image3.png"
            alt="Dashboard Illustration"
            className="w-full h-full object-fill rounded-2xl"
          />
        </div>
      </div>
    </form>
  );
}
