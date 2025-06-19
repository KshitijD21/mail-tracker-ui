"use client";

import { Button } from "@/components/ui/button";
import { fetchGoogleOAuthUrl } from "@/lib/api";
import { useSearchParams } from "next/navigation";

export default function Onboarding() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");

  const onButtonClicked = async () => {
    try {
      const url = await fetchGoogleOAuthUrl();
      window.location.href = url;
    } catch (error) {
      console.error("Failed to start Google OAuth:", error);
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      {status && <p>Status: {status}</p>}
      <Button onClick={onButtonClicked}>Connect to Google</Button>
    </div>
  );
}
