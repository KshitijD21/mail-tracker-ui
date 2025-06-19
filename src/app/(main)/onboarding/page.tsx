// src/app/(main)/onboarding/page.tsx
"use client"
import { Suspense } from "react";
import Onboarding from "./components/onboarding";

// const Onboarding = dynamic(() => import("@/app/(main)/onboarding/components/onboarding"), {
//   ssr: false,
// });

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Onboarding />
    </Suspense>
  );
}
