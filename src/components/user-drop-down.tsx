"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UserDropdown() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    router.push("/auth/signin");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white shadow-sm cursor-pointer hover:bg-gray-100 transition">
          <Avatar className="w-6 h-6">
            <AvatarImage
              src="https://api.dicebear.com/9.x/fun-emoji/svg?seed=Kimberly"
              alt="Kshitij Dumbre"
            />
            <AvatarFallback>KD</AvatarFallback>
          </Avatar>
          <span className="font-medium text-sm text-black/90">
            Kshitij Dumbre
          </span>
          <ChevronDown className="w-4 h-4 text-black/60" />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-44 bg-white shadow-lg rounded-xl mt-2 p-1 border-none"
        align="end"
      >
        <DropdownMenuItem
          onClick={handleLogout}
          className="  rounded-md flex items-center gap-2 px-3 py-2"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
