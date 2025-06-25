"use client";

import { BarChart3, Clock, RefreshCw, Zap } from "lucide-react";
import Image from "next/image";

const features = [
  {
    icon: <Clock className="w-8 h-8 text-blue-600" />,
    image: "/gmail-open.png",
    title: "Real-Time Email Opens",
    description:
      "Gain immediate insights when your email is opened. Know the exact time, location, device type, and browser used by the recipient.",
    points: [
      "Instant open notifications",
      "Browser analytics",
      "Read receipt timestamps",
      "Multiple opens tracking",
    ],
  },
  {
    icon: <Zap className="w-8 h-8 text-purple-600" />,
    image: "/ai reply.png",
    title: "AI Powered Replies",
    description:
      "Say goodbye to writer's block. Our AI suggests concise, professional replies tailored to your previous messages.",
    points: [
      "Context-aware suggestions",
      "Professional tone matching",
      "Custom reply templates",
      "Smart follow-up prompts",
    ],
  },
  {
    icon: <BarChart3 className="w-8 h-8 text-green-600" />,
    image: "/bargraph.png",
    title: "Open Time Heatmap",
    description:
      "Visualize engagement by time and day. Optimize send timing based on historical interaction patterns.",
    points: [
      "Interactive time heatmaps",
      "Best send time recommendations",
      "Weekly engagement patterns",
      "Recipient behavior analysis",
      "Performance benchmarking",
    ],
  },
  {
    icon: <RefreshCw className="w-8 h-8 text-orange-600" />,
    image: "/follow up.png",
    title: "Follow Up",
    description:
      "Track and follow up on emails that haven’t received a reply within 48–72 hours. Perfect for sales cycles or cold outreach where timing matters.",
    points: [
      "Add to Follow-Up",
      "Never Miss an Opportunity",
      "Follow-Up Analytics",
      "Organized Follow-Up Panel",
    ],
  },
];

export default function FeatureSection() {
  return (
    <section
      className="py-20 flex  justify-between   flex-col items-center "
      id="features"
    >
      <div className=" flex flex-col justify-between w-full mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Features
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Powerful tools to track, analyze, and optimize your email campaigns
            with professional-grade insights
          </p>
        </div>

        <div className="space-y-32 flex flex-col items-center">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`flex flex-col justify-between lg:flex-row items-center gap-30 ${
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* Content Side */}
              <div className="flex-1 max-w-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-white rounded-2xl shadow-lg border border-gray-100">
                    {feature.icon}
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900">
                    {feature.title}
                  </h3>
                </div>

                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  {feature.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {feature.points.map((point, pointIndex) => (
                    <div
                      key={pointIndex}
                      className="flex items-center gap-3 p-3 bg-white/50 rounded-lg border border-gray-100"
                    >
                      <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                      <span className="text-gray-700 font-medium">{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Image Side */}
              <div className="flex-1 max-w-lg">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 rounded-3xl transform rotate-3 scale-105"></div>
                  <div className="absolute inset-0 bg-gradient-to-l from-green-100 via-blue-100 to-indigo-100 rounded-3xl transform -rotate-2 scale-110 opacity-50"></div>

                  <div className="relative w-auto mx-auto bg-white rounded-2xl shadow-2xl p-6 flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      width={feature.title === "Follow Up" ? 300 : 500}
                      height={feature.title === "Follow Up" ? 300 : 500}
                      className="rounded-xl"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
