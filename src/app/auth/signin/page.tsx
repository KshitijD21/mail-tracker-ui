"use client";
import AuthHeader from "@/app/auth/components/auth-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginUser } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast, Toaster } from "sonner";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await loginUser(email, password);
      if (res.status === "success") {
        localStorage.setItem("authToken", res.data);
        toast.success("Login successful!");
        router.push("/dashboard");
      } else {
        toast.error("Invalid credentials.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center  px-4 min-h-screen">
        {/* Header */}
        <div className="w-full ">
          <AuthHeader />
        </div>
        <Toaster richColors position="top-right" />

        {/* Sign In Form */}
        <div className="w-full max-w-md mx-auto flex-1 flex flex-col justify-center animate-fade-in">
          <div className={"flex flex-col items-center mb-6 gap-2"}>
            <p className="text-4xl font-semibold text-center text-primary">
              Sign In
            </p>
            <p className="text-lg text-center text-muted-text">
              Open Smarter. Reply Faster.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="text-black rounded-md mt-1"
                autoComplete="email"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="text-black rounded-md mt-1"
                autoComplete="current-password"
              />
            </div>
            {/* <div className="flex justify-between items-center">
              <Link
                href="#"
                className="text-sm text-primary hover:underline transition-colors"
              >
                Forgot password?
              </Link>
            </div> */}
            <Button
              type="submit"
              disabled={!email || !password}
              className="w-full bg-primary cursor-pointer text-primary-text rounded-md py-2 hover:bg-primary-hover transition-colors"
            >
              Sign In
            </Button>
            {/* {message && <p className="text-green-600 text-center">{message}</p>}
            {error && <p className="text-red-600 text-center">{error}</p>} */}
          </form>
          <p className="text-center mt-6 text-sm text-muted-text">
            Don’t have an account?{" "}
            <Link
              href="/auth/signup"
              className="text-primary hover:underline transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>

        {/* Footer */}
        <footer className="w-full  text-center py-3 text-xs  bg-white flex flex-row justify-between items-center px-4">
          <p>© {new Date().getFullYear()} Promptping. All rights reserved.</p>
          <p>kshitijdumbre2001@gmail.com</p>
        </footer>
      </div>

      {/* Right Side Background */}
      <div className="hidden md:flex w-1/2 relative items-center justify-center overflow-hidden">
        <img
          src="/auth-background.jpg"
          alt="Promptping background"
          className="absolute inset-0 w-full h-full object-cover object-center z-0"
        />

        <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-black/20 to-black/10 z-0" />

        <div className="relative z-10 w-full h-full flex items-center justify-center px-8">
          <div
            className="rounded-xl p-10 max-w-md w-full text-center text-white shadow-xl backdrop-blur-sm"
            style={{
              background:
                "linear-gradient(to bottom right, rgba(0, 0, 0, 0.7), rgba(14, 165, 233, 0.5))",
            }}
          >
            <h2 className="text-4xl font-bold mb-4 drop-shadow-lg animate-slide-down">
              Welcome to <span className="gradient-text">Promptping</span>
            </h2>
            <p className="text-lg text-blue-100 animate-fade-in-delay">
              Track your emails, analyze engagement, and boost your productivity
              with a professional, privacy-first dashboard.
            </p>
          </div>
        </div>

        <style jsx global>{`
          @keyframes fade-in {
            0% {
              opacity: 0;
              transform: translateY(24px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in {
            animation: fade-in 0.7s ease-out both;
          }

          @keyframes slide-down {
            0% {
              opacity: 0;
              transform: translateY(-32px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-slide-down {
            animation: slide-down 0.8s ease-out both;
          }

          @keyframes fade-in-delay {
            0% {
              opacity: 0;
            }
            100% {
              opacity: 1;
            }
          }
          .animate-fade-in-delay {
            animation: fade-in-delay 1.2s 0.4s both;
          }

          .gradient-text {
            background: linear-gradient(90deg, #0ea5e9 0%, #0284c7 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
        `}</style>
      </div>
    </div>
  );
}
