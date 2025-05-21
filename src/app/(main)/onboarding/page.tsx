"use client";
import { Button } from "@/components/ui/button";
import { fetchGoogleOAuthUrl } from "@/lib/api";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import React from "react";

function Onboarding() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  console.log(status);

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
      <div>
        <Button onClick={() => onButtonClicked()}>Connect to Google</Button>
      </div>
    </div>
  );
}

export default Onboarding;
