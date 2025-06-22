"use client";

import { Sparkles } from "lucide-react";

const features = [
  {
    icon: "📬",
    title: "Real-Time Email Opens",
    description:
      "Gain immediate insights when your email is opened. Know the exact time, location, device type, and browser used by the recipient.",
  },
  {
    icon: "🧠",
    title: "AI Powered Replies",
    description:
      "Say goodbye to writer’s block. Our AI suggests concise, professional replies tailored to your previous messages.",
  },
  {
    icon: "📊",
    title: "Open Time Heatmap",
    description:
      "Visualize engagement by time and day. Optimize send timing based on historical interaction patterns.",
  },
  {
    icon: "⏱️",
    title: "Follow Up Criteria",
    description:
      "Auto-follow-up if no response in 48-72 hours. Great for sales cycles or cold emails where timing is critical.",
  },
];

export default function FeatureSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
          Features
        </h2>

        <div className="space-y-20">
          {features.map((el, index) => (
            <div
              key={el.title}
              className={`flex flex-col md:flex-row items-center justify-between gap-10 ${
                index % 2 === 1 ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Text */}
              <div className="max-w-xl">
                <h3 className="text-3xl md:text-4xl font-extrabold text-[#1E1E2F] leading-snug mb-4 max-w-md">
                  {el.title.split(" ").slice(0, 2).join(" ")} <br />
                  {el.title.split(" ").slice(2).join(" ")}
                </h3>

                <p className="text-gray-600 text-lg leading-relaxed max-w-2xl">
                  {el.description}
                </p>
              </div>

              {/* Icon with Glow */}
              <div className="relative flex items-center justify-center w-20 h-20">
                <div className="absolute -inset-2 rounded-2xl z-0 blur-2xl bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.5),_transparent_80%)]" />
                <div className="relative z-10 w-full h-full bg-[#1E1E2F] rounded-2xl flex items-center justify-center shadow-md">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
