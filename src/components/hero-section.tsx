"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="w-full px-4 md:px-6 py-8 md:py-10 my-5 bg-white">
      <div className="relative w-full h-[90vh] rounded-lg border border-gray-200 p-6 bg-[#F6F6F6] overflow-hidden">
        {/* Floating Images */}
        <Image
          src="/gmail-open.png"
          alt="Top Left"
          width={400}
          height={400}
          className="absolute top-4 left-4 rotate-[-10deg] rounded-2xl w-[40vw] max-w-[400px] hidden sm:block"
        />

        <Image
          src="/gmail-open.png"
          alt="Top Right"
          width={400}
          height={400}
          className="absolute top-10 right-6 rotate-[8deg] rounded-2xl w-[40vw] max-w-[400px] hidden sm:block"
        />
        <Image
          src="/gmail-open.png"
          alt="Bottom Left"
          width={400}
          height={400}
          className="absolute bottom-8 left-4 rotate-[12deg] rounded-2xl w-[40vw] max-w-[400px] hidden sm:block"
        />
        <Image
          src="/bargraph.png"
          alt="Bottom Right"
          width={400}
          height={400}
          className="absolute bottom-0 right-0 rotate-[0deg] rounded-2xl w-[40vw] max-w-[400px] hidden sm:block"
        />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4 md:px-10">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-black">
            Track Emails. Gain Insights. <br />
            <span className="text-gray-500">Supercharge Your Follow-Ups.</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-700 max-w-2xl">
            A powerful, privacy-respecting email tracking tool built for
            developers, recruiters, founders & professionals. Know exactly when
            your emails are opened and links are clicked — with rich analytics.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="text-base px-6 py-4" variant="outline">
              🚀 Get Started Free
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
