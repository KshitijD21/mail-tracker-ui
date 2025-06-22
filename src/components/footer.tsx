"use client";

import Link from "next/link";
import { Github, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#1E1E2F] text-white w-full py-6 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
        {/* Left Text */}
        <p className="text-center md:text-left">
          Made with ❤️ by Kshitij D. · © 2025 MailTrackerX
        </p>

        {/* Right Links with Icons */}
        <div className="flex items-center gap-4">
          <Link href="https://github.com" target="_blank">
            <Github className="w-5 h-5 hover:text-gray-300 transition" />
          </Link>
          <Link href="https://twitter.com" target="_blank">
            <Twitter className="w-5 h-5 hover:text-gray-300 transition" />
          </Link>
          <Link href="/privacy" className="hover:underline">
            Privacy
          </Link>
          <Link href="/terms" className="hover:underline">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
