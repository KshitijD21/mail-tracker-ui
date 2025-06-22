"use client";

import { MousePointerClick, Smartphone, Sparkles } from "lucide-react";

const comingSoonFeatures = [
  {
    icon: MousePointerClick,
    title: "Link Click Tracking",
    description:
      "Track which links your recipient clicked, when, and how often.",
    eta: "~5–7 days",
    note: "Helps you measure CTA performance and optimize engagement.",
  },
  {
    icon: Smartphone,
    title: "WhatsApp Notification on Reply",
    description:
      "Get instant WhatsApp alerts when someone replies to your email.",
    eta: "~7–10 days",
    note: "Helps you act immediately on important responses.",
  },
  {
    icon: Sparkles,
    title: "Smart Send Suggestions",
    description:
      "Get AI-powered timing suggestions based on user open behavior.",
    eta: "~10–14 days",
    note: "Boosts open rates by recommending the best time to send.",
  },
];

// Background color classes for variety
const bgClasses = [
  "bg-yellow-100 text-yellow-600",
  "bg-blue-100 text-blue-600",
  "bg-green-100 text-green-600",
];

export default function ComingSoonFeatures() {
  return (
    <section className="w-full bg-white py-24 px-6" id="coming-soon">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h2 className="text-4xl font-bold mt-2">Coming Soon</h2>
        <p className="text-gray-600 mt-4 text-lg">
          We’re actively building the next wave of features to supercharge your
          email tracking.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {comingSoonFeatures.map((f, i) => {
          const Icon = f.icon;
          const bg = bgClasses[i % bgClasses.length];

          return (
            <div
              key={i}
              className="border border-gray-200 rounded-lg p-6 text-left shadow-sm bg-white hover:shadow-md transition"
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${bg}`}
                >
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {f.title}
              </h3>
              <p className="text-gray-600 mb-2">{f.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
